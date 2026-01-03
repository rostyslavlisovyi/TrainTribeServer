import type { AuthResult } from "express-oauth2-jwt-bearer";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { Document, Model, Schema, Types } from "mongoose";
jest.mock("../src/models/index.js", () => {
  const mongoose = require("mongoose");
  const TestUserSchema = new mongoose.Schema({ authId: String });
  const TestUserModel =
    mongoose.models.TestUser || mongoose.model("TestUser", TestUserSchema);
  return {
    UserModel: TestUserModel
  };
});

import { DataCannotBeEmpty, NotFoundError } from "../src/errors/index.js";
import { BaseService } from "../src/services/base.service.js";

interface IRelated extends Document {
  title: string;
}

interface IDummy extends Document {
  name: string;
  owner?: string;
  related?: Types.ObjectId;
}

const RelatedSchema = new Schema<IRelated>({
  title: String
});

const DummySchema = new Schema<IDummy>({
  name: { type: String, required: true },
  owner: { type: String },
  related: { type: Schema.Types.ObjectId, ref: "Related" }
});

const RelatedModel: Model<IRelated> = mongoose.model("Related", RelatedSchema);
const DummyModel: Model<IDummy> = mongoose.model("Dummy", DummySchema);

class DummyService extends BaseService<IDummy> {
  constructor(auth?: AuthResult) {
    super(DummyModel, auth);
  }

  protected override async baseFilter() {
    if (this.auth?.payload?.user_id) {
      return { owner: this.auth.payload.user_id };
    }
    return {};
  }
}

class OwnershipDummyService extends BaseService<IDummy> {
  constructor(auth?: AuthResult) {
    super(DummyModel, auth);
  }

  // no base filter, only ownership guard for mutations
  protected override async ownershipFilter() {
    if (this.auth?.payload?.user_id) {
      return { owner: this.auth.payload.user_id };
    }
    return {};
  }
}

describe("BaseService", () => {
  let mongo: MongoMemoryServer;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
  });

  afterEach(async () => {
    await Promise.all([DummyModel.deleteMany({}), RelatedModel.deleteMany({})]);
  });

  it("creates documents and rejects empty payloads", async () => {
    const service = new DummyService();

    const created = await service.create({ name: "Test" } as Partial<IDummy>);
    expect(created.name).toBe("Test");

    await expect(service.create({} as Partial<IDummy>)).rejects.toBeInstanceOf(
      DataCannotBeEmpty
    );
  });

  it("retrieves documents with populate support", async () => {
    const service = new DummyService();
    const related = await RelatedModel.create({ title: "Related" });
    const doc = await DummyModel.create({
      name: "Populated",
      related: related._id
    });

    const result = await service.get({
      id: doc._id.toString(),
      populateFields: "related"
    });

    expect(result?.name).toBe("Populated");
    expect((result?.related as unknown as IRelated).title).toBe("Related");
  });

  it("applies baseFilter for list", async () => {
    await DummyModel.create({ name: "Public" });
    await DummyModel.create({ name: "OwnerA", owner: "owner-a" });
    await DummyModel.create({ name: "OwnerB", owner: "owner-b" });

    const auth = {
      payload: { user_id: "owner-a" }
    } as AuthResult;
    const service = new DummyService(auth);

    const result = await service.list({ pageNum: 1, pageSize: 10 });

    expect(result.data).toHaveLength(1);
    expect(result.data[0].owner).toBe("owner-a");
  });

  it("supports pagination and sorting", async () => {
    const service = new DummyService();
    await DummyModel.create({ name: "B" });
    await DummyModel.create({ name: "A" });
    await DummyModel.create({ name: "C" });

    const result = await service.list({
      pageNum: 1,
      pageSize: 2,
      sort: { name: 1 }
    });

    expect(result.data.map((d) => d.name)).toEqual(["A", "B"]);
    expect(result.totalItems).toBe(3);
    expect(result.currentPage).toBe(1);
  });

  it("updates documents and validates payloads", async () => {
    const service = new DummyService();
    const doc = await DummyModel.create({ name: "Before" });

    const updated = await service.update({
      id: doc._id.toString(),
      entity: { name: "After" } as Partial<IDummy>
    });

    expect(updated?.name).toBe("After");

    await expect(
      service.update({ id: doc._id.toString(), entity: {} as Partial<IDummy> })
    ).rejects.toBeInstanceOf(DataCannotBeEmpty);

    await expect(
      service.update({
        id: new mongoose.Types.ObjectId().toString(),
        entity: { name: "Missing" } as Partial<IDummy>
      })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("deletes documents and throws when missing", async () => {
    const service = new DummyService();
    const doc = await DummyModel.create({ name: "Delete me" });

    const removed = await service.delete(doc._id.toString());
    expect(removed).toBe(true);

    await expect(
      service.delete(new mongoose.Types.ObjectId().toString())
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("enforces ownership filters on update/delete when auth is provided", async () => {
    const ownerA = await DummyModel.create({ name: "OwnerA", owner: "a" });
    const otherDoc = await DummyModel.create({ name: "OwnerB", owner: "b" });

    const auth = { payload: { user_id: "a" } } as AuthResult;
    const service = new OwnershipDummyService(auth);

    const updated = await service.update({
      id: ownerA._id.toString(),
      entity: { name: "OwnerA-updated" } as Partial<IDummy>
    });
    expect(updated?.name).toBe("OwnerA-updated");

    await expect(
      service.update({
        id: otherDoc._id.toString(),
        entity: { name: "Illegal" } as Partial<IDummy>
      })
    ).rejects.toBeInstanceOf(NotFoundError);

    await expect(
      service.delete(otherDoc._id.toString())
    ).rejects.toBeInstanceOf(NotFoundError);

    await expect(service.delete(ownerA._id.toString())).resolves.toBe(true);
  });
});
