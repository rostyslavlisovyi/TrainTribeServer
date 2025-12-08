import { BaseController } from "../src/controllers/base.controller.js";

const createRes = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };
  return res;
};

class DummyController extends BaseController<unknown, any> {
  constructor(service: any) {
    super(service);
  }
}

describe("BaseController", () => {
  it("returns data for get", async () => {
    const service = {
      get: jest.fn().mockResolvedValue({ name: "Doc" })
    };
    const controller = new DummyController(service);
    const req = {
      params: { id: "123" },
      query: { populate: "related" }
    } as any;
    const res = createRes();

    await controller.get(req, res as any);

    expect(service.get).toHaveBeenCalledWith({
      id: "123",
      populateFields: "related"
    });
    expect(res.json.mock.calls[0][0]).toMatchObject({ data: { name: "Doc" } });
  });

  it("responds 404 when get returns null", async () => {
    const service = {
      get: jest.fn().mockResolvedValue(null)
    };
    const controller = new DummyController(service);
    const req = { params: { id: "missing" }, query: {} } as any;
    const res = createRes();

    await controller.get(req, res as any);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Not Found" });
  });

  it("validates pagination input in list", async () => {
    const service = {
      list: jest.fn().mockResolvedValue({
        data: [],
        totalItems: 0,
        pageSize: 10,
        currentPage: 1
      })
    };
    const controller = new DummyController(service);
    const res = createRes();

    await controller.list({ body: { pageNum: "0" } } as any, res as any);
    expect(res.status).toHaveBeenCalledWith(400);

    const res2 = createRes();
    await controller.list({ body: { pageNum: 1, pageSize: 10 } } as any, res2 as any);
    expect(service.list).toHaveBeenCalledWith({
      pageNum: 1,
      pageSize: 10,
      populateFields: undefined,
      sort: undefined,
      filters: undefined
    });
    expect(res2.json.mock.calls[0][0]).toMatchObject({
      data: [],
      totalItems: 0,
      totalPages: 1
    });
  });

  it("creates entities", async () => {
    const service = {
      create: jest.fn().mockResolvedValue({ name: "New" })
    };
    const controller = new DummyController(service);
    const req = { body: { name: "New" } } as any;
    const res = createRes();

    await controller.create(req, res as any);

    expect(service.create).toHaveBeenCalledWith({ name: "New" });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json.mock.calls[0][0]).toMatchObject({ data: { name: "New" } });
  });

  it("updates entities", async () => {
    const service = {
      update: jest.fn().mockResolvedValue({ name: "Updated" })
    };
    const controller = new DummyController(service);
    const req = {
      params: { id: "abc" },
      body: { name: "Updated" },
      query: { populate: "creator" }
    } as any;
    const res = createRes();

    await controller.update(req, res as any);

    expect(service.update).toHaveBeenCalledWith({
      id: "abc",
      entity: { name: "Updated" },
      populateFields: "creator"
    });
    expect(res.json.mock.calls[0][0]).toMatchObject({ data: { name: "Updated" } });
  });

  it("deletes entities", async () => {
    const service = {
      delete: jest.fn().mockResolvedValue(true)
    };
    const controller = new DummyController(service);
    const req = { params: { id: "abc" } } as any;
    const res = createRes();

    await controller.delete(req, res as any);

    expect(service.delete).toHaveBeenCalledWith("abc");
    expect(res.status).toHaveBeenCalledWith(204);
  });
});
