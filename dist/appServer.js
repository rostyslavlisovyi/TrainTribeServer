// src/appServer.ts
import { scopePerRequest } from "awilix-express";
import chalk6 from "chalk";
import cors from "cors";
import dotenv2 from "dotenv";
import express7 from "express";

// src/config/database.ts
import dotenv from "dotenv";
import mongoose from "mongoose";
import chalk from "chalk";
dotenv.config();
var connectDB = async () => {
  try {
    console.log("Connecting to MongoDB database...");
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI ?? "");
    console.log(chalk.green("Connected to MongoDB database."));
  } catch (error) {
    console.error(chalk.red("Error connection to database", error));
    process.exit(1);
  }
};
var database_default = connectDB;

// src/config/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
var swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TrainTribeApi Documentation",
      version: "1.0.0",
      description: "API Documentation for TrainTribeApi"
    },
    servers: [
      {
        url: "http://localhost:666/api",
        description: "Local development server with API base path"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      responses: {
        BadRequest: {
          description: "Bad Request - The request was malformed or contained invalid parameters",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Bad request"
                  },
                  statusCode: {
                    type: "integer",
                    example: 400
                  }
                }
              }
            }
          }
        },
        Unauthorized: {
          description: "Unauthorized - Authentication is required or has failed",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Unauthorized"
                  },
                  statusCode: {
                    type: "integer",
                    example: 401
                  }
                }
              }
            }
          }
        },
        NotFound: {
          description: "Not Found - The requested resource was not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Resource not found"
                  },
                  statusCode: {
                    type: "integer",
                    example: 404
                  }
                }
              }
            }
          }
        },
        ValidationError: {
          description: "Validation Error - The request data failed validation",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Validation failed"
                  },
                  statusCode: {
                    type: "integer",
                    example: 422
                  },
                  errors: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        field: {
                          type: "string",
                          example: "email"
                        },
                        message: {
                          type: "string",
                          example: "Invalid email format"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        InternalServerError: {
          description: "Internal Server Error - Something went wrong on the server",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Internal server error"
                  },
                  statusCode: {
                    type: "integer",
                    example: 500
                  }
                }
              }
            }
          }
        }
      },
      schemas: {
        TimeSlot: {
          type: "object",
          properties: {
            day: {
              type: "string",
              enum: [
                "MONDAY",
                "TUESDAY",
                "WEDNESDAY",
                "THURSDAY",
                "FRIDAY",
                "SATURDAY",
                "SUNDAY"
              ],
              description: "Day of the week"
            },
            startTime: {
              type: "string",
              description: "Start time in format HH:MM",
              example: "06:00"
            },
            endTime: {
              type: "string",
              description: "End time in format HH:MM",
              example: "07:00"
            }
          }
        },
        City: {
          type: "object",
          required: ["id"],
          properties: {
            _id: {
              type: "string",
              description: "The unique MongoDB identifier of the city"
            },
            id: {
              type: "integer",
              description: "The numeric identifier of the city"
            },
            name: {
              type: "string",
              description: "The name of the city"
            },
            latitude: {
              type: "number",
              description: "The latitude coordinate of the city"
            },
            longitude: {
              type: "number",
              description: "The longitude coordinate of the city"
            },
            province: {
              type: "string",
              description: "The province of the city"
            },
            population: {
              type: "integer",
              description: "The population of the city"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date the city was created"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date the city was last updated"
            }
          }
        },
        ParticipantAttendance: {
          type: "object",
          properties: {
            participant: {
              type: "string",
              description: "The user ID of the participant"
            },
            attended: {
              type: "boolean",
              description: "Whether the participant attended the training"
            }
          }
        },
        Training: {
          type: "object",
          required: ["title", "date", "latitude", "longitude", "creator"],
          properties: {
            _id: {
              type: "string",
              description: "The unique identifier of the training"
            },
            title: {
              type: "string",
              description: "The title of the training"
            },
            description: {
              type: "string",
              description: "The description of the training"
            },
            date: {
              type: "string",
              format: "date-time",
              description: "The date and time of the training"
            },
            address: {
              type: "string",
              description: "The address of the training"
            },
            latitude: {
              type: "string",
              description: "The latitude coordinate of the training location"
            },
            longitude: {
              type: "string",
              description: "The longitude coordinate of the training location"
            },
            sport: {
              type: "array",
              items: {
                type: "string",
                enum: ["SWIMMING", "CYCLING", "RUNNING", "WALKING", "TRIATHLON"]
              },
              description: "The type of sport for the training"
            },
            creator: {
              type: "string",
              description: "The user ID of the creator"
            },
            participantAttendance: {
              type: "array",
              items: {
                $ref: "#/components/schemas/ParticipantAttendance"
              },
              description: "Array of objects tracking participant attendance"
            },
            difficultyLevel: {
              type: "string",
              enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
              description: "The difficulty level of the training"
            },
            duration: {
              type: "integer",
              description: "The duration of the training in minutes"
            },
            likes: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Array of user IDs who liked the training"
            },
            comments: {
              type: "object",
              properties: {
                user: {
                  type: "string",
                  description: "The user ID who made the comment"
                },
                text: {
                  type: "string",
                  description: "The comment text"
                },
                timestamp: {
                  type: "boolean",
                  description: "Whether to include timestamp"
                }
              }
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date the training was created"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date the training was last updated"
            }
          }
        },
        User: {
          type: "object",
          required: ["email", "authId"],
          properties: {
            _id: {
              type: "string",
              description: "The unique identifier of the user"
            },
            athleteBio: {
              type: "string",
              description: "User's athletic biography"
            },
            authId: {
              type: "string",
              description: "Authentication ID from the auth provider"
            },
            city: {
              type: "string",
              description: "Reference to the user's city (ObjectId)"
            },
            countTrainingOrganized: {
              type: "integer",
              description: "Number of trainings organized by the user",
              example: 0
            },
            countTrainingJoined: {
              type: "integer",
              description: "Number of trainings the user has joined and attended",
              example: 0
            },
            countTrainingMissed: {
              type: "integer",
              description: "Number of trainings the user was registered for but missed",
              example: 0
            },
            dateOfBirth: {
              type: "string",
              format: "date",
              description: "The user's date of birth"
            },
            email: {
              type: "string",
              description: "The email of the user"
            },
            firstName: {
              type: "string",
              description: "The first name of the user"
            },
            hasCompletedOnboarding: {
              type: "boolean",
              description: "Whether the user has completed onboarding"
            },
            image: {
              type: "object",
              description: "Object of cloudinary image"
            },
            lastName: {
              type: "string",
              description: "The last name of the user"
            },
            lastOnboardingStep: {
              type: "string",
              description: "The last completed onboarding step"
            },
            privacySettings: {
              type: "boolean",
              description: "User's privacy settings"
            },
            rangeOfAction: {
              type: "number",
              description: "User's preferred range of action in kilometers"
            },
            sports: {
              type: "array",
              items: {
                type: "string",
                enum: ["SWIMMING", "CYCLING", "RUNNING", "WALKING", "TRIATHLON"]
              },
              description: "Sports the user is interested in"
            },
            training_created: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Trainings created by the user"
            },
            trainingGoal: {
              type: "array",
              items: {
                type: "string",
                enum: ["RACE", "LOSE_WEIGHT", "STAY_FIT", "HAVE_FUN", "OTHER"]
              },
              description: "User's training goals"
            },
            trainingLevel: {
              type: "string",
              enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
              description: "User's training level"
            },
            trainingFrequency: {
              type: "string",
              enum: ["1_2_PER_WEEK", "3_4_PER_WEEK", "5_PLUS_PER_WEEK"],
              description: "User's training frequency"
            },
            trainingPartnerPreference: {
              type: "string",
              description: "User's preference for training partners"
            },
            trainingTimeSlot: {
              type: "array",
              items: {
                $ref: "#/components/schemas/TimeSlot"
              },
              description: "User's preferred training time slots"
            },
            language: {
              type: "string",
              enum: ["it", "en"],
              description: "User's preferred language"
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "The date the user was created"
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "The date the user was last updated"
            }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.ts"]
};
var swaggerSpec = swaggerJSDoc(swaggerOptions);
var setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

// src/container.ts
import { asClass, createContainer, InjectionMode } from "awilix";

// src/utils/validators/validateFileContent.ts
import { fileTypeFromBuffer } from "file-type";

// src/utils/handleError.ts
import mongoose2 from "mongoose";
import chalk2 from "chalk";

// src/errors/baseError.ts
var BaseError = class extends Error {
  statusCode;
  isOperational;
  details;
  constructor(message, statusCode, isOperational = true, details) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    this.name = this.constructor.name;
  }
  toJSON() {
    return {
      message: this.message,
      name: this.name,
      statusCode: this.statusCode,
      ...this.details && { details: this.details }
    };
  }
};

// src/errors/clientErrors.ts
var NotFoundError = class extends BaseError {
  constructor(resource) {
    super(`${resource} not found`, 404, true);
  }
};
var BadRequestError = class extends BaseError {
  constructor(message = "Invalid request", details) {
    super(message, 400, true, details);
  }
};
var DataCannotBeEmpty = class extends BaseError {
  constructor(field) {
    super(`${field} cannot be empty`, 400, true);
  }
};

// src/errors/mongoErrors.ts
var MongoValidationError = class extends BaseError {
  constructor(error) {
    super("Validation Error", 400, true, {
      errors: Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message
      }))
    });
  }
};
var MongoCastError = class extends BaseError {
  constructor(error) {
    super("Invalid ID format", 422, true, {
      details: `The provided value '${error.value}' is not a valid MongoDB ObjectId.`
    });
  }
};
var MongoDuplicateKeyError = class extends BaseError {
  constructor(error) {
    super("Duplicate key error", 409, true, {
      details: error.message
    });
  }
};

// src/errors/networkErrors.ts
var DatabaseConnectionError = class extends BaseError {
  constructor(details) {
    super(
      "Database connection error",
      503,
      true,
      details ? { details } : void 0
    );
  }
};

// src/errors/serverError.ts
var InternalServerError = class extends BaseError {
  constructor(details) {
    super(
      "Internal Server Error",
      500,
      false,
      details ? { details } : void 0
    );
  }
};

// src/utils/handleError.ts
function handleError(res, error) {
  console.error(chalk2.red("Error:", error));
  if (error instanceof BaseError) {
    return res.status(error.statusCode).json(error.toJSON());
  }
  if (error instanceof NotFoundError) {
    return res.status(404).json(error.toJSON());
  }
  if (error instanceof BadRequestError) {
    return res.status(400).json(error.toJSON());
  }
  if (error instanceof DataCannotBeEmpty) {
    return res.status(400).json(error.toJSON());
  }
  if (error instanceof mongoose2.Error.ValidationError) {
    return res.status(400).json(new MongoValidationError(error).toJSON());
  }
  if (error instanceof mongoose2.Error.CastError) {
    return res.status(422).json(new MongoCastError(error).toJSON());
  }
  if (error instanceof mongoose2.mongo.MongoServerError) {
    if (error.code === 11e3) {
      return res.status(409).json(new MongoDuplicateKeyError(error).toJSON());
    }
  }
  if (error instanceof Error) {
    if (error.message.includes("network") || error.message.includes("connection")) {
      return res.status(503).json(new DatabaseConnectionError(error.message).toJSON());
    }
  }
  return res.status(500).json(new InternalServerError().toJSON());
}

// src/controllers/base.controller.ts
var BaseController = class {
  service;
  userService;
  constructor(service) {
    this.service = service;
    this.userService = container_default.resolve("userService");
  }
  async getUserFromToken(req, populate) {
    const token = req.auth;
    if (!token) {
      throw new Error("No token provided");
    }
    const query = this.userService.model.findOne({
      authId: token.payload.user_id
    });
    if (populate) {
      query.populate(populate);
    }
    const user = await query;
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  async get(req, res) {
    try {
      const { id } = req.params;
      const populateFields = req.query.populate;
      const result = await this.service.get({
        id,
        populateFields
      });
      if (!result.data) {
        res.status(404).json({ message: "Not Found" });
        return;
      }
      res.json(result);
    } catch (error) {
      handleError(res, error);
    }
  }
  async list(req, res) {
    try {
      const { pageNum, pageSize, sort, populate, filters } = req.body;
      const parsedPageNum = parseInt(pageNum || "1", 10);
      const parsedPageSize = parseInt(pageSize || "10", 10);
      if (isNaN(parsedPageNum) || parsedPageNum < 1) {
        res.status(400).json({ message: "Invalid pageNum. Must be a positive number." });
        return;
      }
      if (isNaN(parsedPageSize) || parsedPageSize < 1) {
        res.status(400).json({ message: "Invalid pageSize. Must be a positive number." });
        return;
      }
      const result = await this.service.list({
        pageNum: parsedPageNum,
        pageSize: parsedPageSize,
        populateFields: populate,
        sort,
        filters
      });
      res.json(result);
    } catch (error) {
      handleError(res, error);
    }
  }
  async create(req, res) {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }
  async update(req, res) {
    try {
      const { id } = req.params;
      const populateFields = req.query.populate;
      const result = await this.service.update({
        id,
        entity: req.body,
        populateFields
      });
      res.json(result);
    } catch (error) {
      handleError(res, error);
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.service.delete(id);
      res.status(204).send();
    } catch (error) {
      handleError(res, error);
    }
  }
};

// src/controllers/city.controller.ts
var CityController = class extends BaseController {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(cityService) {
    super(cityService);
  }
  async inizialize(req, res) {
    try {
      const authorization = req.headers.authorization || "";
      if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        res.status(401).end("Unauthorized");
        return;
      }
      await this.service.inizialize();
      res.json({ message: "Inizialize completed" });
    } catch (error) {
      handleError(res, error);
    }
  }
};

// src/controllers/cloudinary.controller.ts
var CloudinaryController = class {
  service;
  constructor(cloudinaryService) {
    this.service = cloudinaryService;
  }
  upload = async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "NO FILE UPLOADED" });
        return;
      }
      const folder = req.body.folder;
      const result = await this.service.upload(req.file, folder);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: "UPLOAD FAILED",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };
  delete = async (req, res) => {
    try {
      const { public_id } = req.params;
      if (!public_id) {
        res.status(400).json({ message: "PUBLIC_ID IS REQUIRED" });
        return;
      }
      await this.service.delete(public_id);
      res.status(200).json();
    } catch (error) {
      res.status(500).json({
        message: "DELETE FAILED",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  };
};

// src/controllers/geocode.controller.ts
var GeocodeController = class {
  service;
  constructor(geocodeService) {
    this.service = geocodeService;
  }
  async search(req, res) {
    try {
      const { search } = req.query;
      const language = req.headers["accept-language"]?.split(",")[0] || "it";
      if (!search || typeof search !== "string") {
        res.status(400).json({ message: "search parameter is required" });
        return;
      }
      const results = await this.service.geocode(search, language);
      res.json({ data: results });
    } catch (error) {
      handleError(res, error);
    }
  }
  async reverse(req, res) {
    try {
      const { lat, lon } = req.query;
      const language = req.headers["accept-language"]?.split(",")[0] || "it";
      if (!lat || !lon || typeof lat !== "string" || typeof lon !== "string") {
        res.status(400).json({
          message: "Latitude and longitude parameters are required"
        });
        return;
      }
      const result = await this.service.reverse(lat, lon, language);
      res.json({ data: result });
    } catch (error) {
      handleError(res, error);
    }
  }
};

// src/controllers/training.controller.ts
var TrainingController = class extends BaseController {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(trainingService) {
    super(trainingService);
  }
  async getRecommendedTrainings(req, res) {
    try {
      const user = await this.getUserFromToken(req, ["city"]);
      const populateFields = req.query.populate;
      const result = await this.service.getRecommendedTrainings(
        user,
        populateFields
      );
      res.status(201).json(result);
    } catch (error) {
      handleError(res, error);
    }
  }
  async addLike(req, res) {
    try {
      const { id } = req.params;
      const user = await this.getUserFromToken(req);
      const data = await this.service.addLike(id, user._id.toString());
      res.status(200).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }
  async removeLike(req, res) {
    try {
      const { id } = req.params;
      const user = await this.getUserFromToken(req);
      const data = await this.service.removeLike(id, user._id.toString());
      res.status(200).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }
  async addParticipant(req, res) {
    try {
      const { id } = req.params;
      const user = await this.getUserFromToken(req);
      const data = await this.service.addParticipant(id, user._id.toString());
      res.status(200).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }
  async removeParticipant(req, res) {
    try {
      const { id } = req.params;
      const user = await this.getUserFromToken(req);
      const data = await this.service.removeParticipant(
        id,
        user._id.toString()
      );
      res.status(200).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }
  async addComment(req, res) {
    try {
      const { id } = req.params;
      const { text } = req.body;
      const user = await this.getUserFromToken(req);
      const data = await this.service.addComment(id, user._id.toString(), text);
      res.status(200).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }
  async updateComment(req, res) {
    try {
      const { commentId } = req.params;
      const { text } = req.body;
      const data = await this.service.updateComment(commentId, text);
      res.status(200).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }
  async removeComment(req, res) {
    try {
      const { id, commentId } = req.params;
      const data = await this.service.removeComment(id, commentId);
      res.status(200).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }
  async changeStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = await this.getUserFromToken(req);
      const data = await this.service.changeStatus(
        id,
        user._id.toString(),
        status
      );
      res.status(200).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }
  async addReview(req, res) {
    try {
      const { id } = req.params;
      const { rating, comment, images } = req.body;
      const user = await this.getUserFromToken(req);
      const data = await this.service.addReview(
        id,
        user._id.toString(),
        rating,
        comment,
        images
      );
      res.status(201).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  }
};

// src/controllers/upload.controller.ts
import chalk3 from "chalk";
import multer from "multer";
import path from "path";
import fs from "fs/promises";

// src/controllers/user.controller.ts
var UserController = class extends BaseController {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(userService) {
    super(userService);
  }
  async getMe(req, res) {
    try {
      const user = await this.getUserFromToken(
        req,
        req.query.populate
      );
      res.json(user);
    } catch (error) {
      handleError(res, error);
    }
  }
};

// src/services/base.service.ts
import chalk4 from "chalk";
var BaseService = class {
  model;
  constructor(model) {
    this.model = model;
  }
  async get({
    id,
    populateFields
  }) {
    try {
      let query = this.model.findById(id);
      if (populateFields) {
        query = query.populate(this.buildPopulate(populateFields));
      }
      const result = await query;
      return { data: result };
    } catch (error) {
      console.error(chalk4.red("Error in get method:"), error);
      throw error;
    }
  }
  async list({
    pageNum = 1,
    pageSize = 10,
    populateFields,
    sort,
    filters = {}
  }) {
    try {
      const validPageNum = Math.max(1, pageNum);
      const validPageSize = Math.max(1, pageSize);
      const skips = validPageSize * (validPageNum - 1);
      const totalItems = await this.model.countDocuments(filters);
      const totalPages = totalItems > 0 ? Math.ceil(totalItems / validPageSize) : 1;
      let query = this.model.find(filters);
      if (sort) {
        query = query.sort(sort);
      }
      query = query.skip(skips).limit(validPageSize);
      if (populateFields) {
        query = query.populate(this.buildPopulate(populateFields));
      }
      const data = await query;
      return {
        data,
        totalItems,
        totalPages,
        pageSize: validPageSize,
        currentPage: validPageNum,
        hasNextPage: validPageNum < totalPages,
        hasPreviousPage: validPageNum > 1
      };
    } catch (error) {
      console.error(chalk4.red("Error in list:"), chalk4.red(error));
      throw error;
    }
  }
  async create(entity) {
    try {
      if (!entity || Object.keys(entity).length === 0) {
        throw new DataCannotBeEmpty("Entity data cannot be empty");
      }
      const newEntity = await this.model.create(entity);
      return { data: newEntity };
    } catch (error) {
      console.error(chalk4.red("Error in create:"), error);
      throw error;
    }
  }
  async update({
    id,
    entity,
    populateFields
  }) {
    try {
      if (!entity || Object.keys(entity).length === 0) {
        throw new DataCannotBeEmpty("Update data cannot be empty");
      }
      let query = this.model.findByIdAndUpdate(id, entity, {
        new: true
      });
      if (populateFields) {
        query = query.populate(this.buildPopulate(populateFields));
      }
      const updatedData = await query;
      if (!updatedData) {
        throw new NotFoundError(`Data with id ${id} not found`);
      }
      return { data: updatedData };
    } catch (error) {
      console.error(chalk4.red("Error in update:"), error);
      throw error;
    }
  }
  async delete(id) {
    try {
      const deleted = await this.model.findByIdAndDelete(id);
      if (!deleted) {
        throw new NotFoundError(`Data with id ${id} not found`);
      }
      return { data: !!deleted };
    } catch (error) {
      console.error(chalk4.red("Error in delete:"), error);
      throw error;
    }
  }
  buildPopulate(paths) {
    const tree = {};
    const pathArray = Array.isArray(paths) ? paths : [paths];
    for (const path2 of pathArray) {
      const parts = path2.split(".");
      let current = tree;
      for (const part of parts) {
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    }
    function convert(node) {
      return Object.entries(node).map(([key, value]) => {
        const populate = convert(value);
        const result2 = { path: key };
        if (populate.length > 0) {
          result2.populate = populate.length === 1 ? populate[0] : populate;
        }
        return result2;
      });
    }
    const result = convert(tree);
    return result.length === 1 ? result[0] : result;
  }
};

// src/services/city.service.ts
import axios from "axios";
import chalk5 from "chalk";
import * as XLSX from "xlsx";

// src/models/MongoDB/city.model.ts
import mongoose3, { Schema } from "mongoose";
var CitySchema = new Schema(
  {
    istatCode: { type: String, required: true, unique: true },
    province: { type: String },
    region: { type: String },
    name: { type: String },
    latitude: { type: Number },
    longitude: { type: Number }
  },
  {
    timestamps: true
  }
);
var CityModel = mongoose3.model("City", CitySchema);
var city_model_default = CityModel;

// src/services/city.service.ts
var CityService = class extends BaseService {
  constructor() {
    super(city_model_default);
  }
  inizialize = async () => {
    try {
      console.log(chalk5.yellow("Downloading Excel file..."));
      const urlInstat = "https://www.istat.it/wp-content/uploads/2024/09/Elenco-comuni-italiani.xlsx";
      const response = await axios({
        method: "get",
        url: urlInstat,
        responseType: "arraybuffer"
      });
      console.log(chalk5.yellow("Parsing Excel file..."));
      const workbook = XLSX.read(response.data, { type: "buffer" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      let cities = jsonData.map((row) => ({
        istatCode: row["Codice Comune formato alfanumerico"],
        region: row["Denominazione Regione"],
        name: row["Denominazione in italiano"],
        province: row[
          // eslint-disable-next-line max-len
          "Denominazione dell'Unit\xE0 territoriale sovracomunale \r\n(valida a fini statistici)"
        ]
      }));
      console.log(chalk5.green(`Processed ${cities.length} cities`));
      console.log(chalk5.yellow("Fetching coordinates from Wikidata..."));
      const sparqlQuery = `
        SELECT ?istat ?coordinate
        WHERE {
          ?item p:P31/ps:P31/wdt:P279* wd:Q747074.
          OPTIONAL { ?item wdt:P635 ?istat. }
          OPTIONAL { ?item wdt:P625 ?coordinate. }
        }
      `;
      const sparqlUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(
        sparqlQuery
      )}&format=json`;
      const sparqlResponse = await axios.get(sparqlUrl, {
        headers: {
          "User-Agent": "NodeJS-App",
          Accept: "application/json"
        }
      });
      const results = sparqlResponse.data.results.bindings;
      const wikidataMap = /* @__PURE__ */ new Map();
      for (const r of results) {
        const istat = r.istat?.value;
        let latitude, longitude;
        if (r.coordinate?.value) {
          const coords = r.coordinate.value.replace("Point(", "").replace(")", "").split(" ");
          longitude = parseFloat(coords[0]);
          latitude = parseFloat(coords[1]);
        }
        if (istat) {
          wikidataMap.set(istat, { latitude, longitude });
        }
      }
      cities = cities.map((city) => {
        const extra = wikidataMap.get(city.istatCode);
        return extra ? { ...city, ...extra } : city;
      });
      console.log(chalk5.green("Dati arricchiti con Wikidata"));
      console.log(
        chalk5.yellow(
          "Cities without coordinates:",
          cities.filter((x) => !x.latitude || !x.longitude).length
        )
      );
      const istatCodesFromExcel = cities.map((c) => c.istatCode);
      const bulkOps = cities.map((city) => ({
        updateOne: {
          filter: { istatCode: city.istatCode },
          update: { $set: city },
          upsert: true
        }
      }));
      const bulkResult = await this.model.bulkWrite(bulkOps);
      const deleteResult = await this.model.deleteMany({
        istatCode: { $nin: istatCodesFromExcel }
      });
      console.log(chalk5.green("Database sincronizzato correttamente"));
      console.log(chalk5.green(`Inseriti: ${bulkResult.upsertedCount || 0}`));
      console.log(chalk5.green(`Aggiornati: ${bulkResult.modifiedCount || 0}`));
      console.log(chalk5.green(`Eliminati: ${deleteResult.deletedCount || 0}`));
      console.log(chalk5.green("Database sincronizzato correttamente"));
    } catch (error) {
      console.error(chalk5.red("Error processing inizialize cities:", error));
      throw error;
    }
  };
};

// src/services/cloudinary.service.ts
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
var CloudinaryService = class {
  async upload(file, folder) {
    try {
      return new Promise((resolve, reject) => {
        const baseFolder = process.env.CLOUDINARY_BASE_FOLDER_UPLOAD;
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            asset_folder: baseFolder + (folder ? `/${folder}` : ""),
            resource_type: "auto"
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error("No result from Cloudinary"));
            resolve(result);
          }
        );
        const bufferStream = Readable.from(file.buffer);
        bufferStream.pipe(uploadStream);
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to upload image: ${errorMessage}`);
    }
  }
  async delete(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to delete image: ${errorMessage}`);
    }
  }
};

// src/services/geocode.service.ts
import fetch from "node-fetch";
var GeocodeService = class {
  baseUrl = "https://nominatim.openstreetmap.org";
  async geocode(search, language = "it") {
    const url = `${this.baseUrl}/search?format=json&q=${encodeURIComponent(search)}&addressdetails=1&accept-language=${language}&countrycodes=it`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "TrainTribe API Server",
        Referer: process.env.APP_URL || ""
      }
    });
    return await response.json();
  }
  async reverse(lat, lon, language = "it") {
    const url = `${this.baseUrl}/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=${language}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "TrainTribe API Server",
        Referer: process.env.APP_URL || ""
      }
    });
    return await response.json();
  }
};

// src/models/MongoDB/comment.model.ts
import mongoose4, { Schema as Schema2 } from "mongoose";
var CommentSchema = new Schema2(
  {
    user: { type: Schema2.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true }
  },
  {
    timestamps: true
  }
);
var CommentModel = mongoose4.model("Comment", CommentSchema);
var comment_model_default = CommentModel;

// src/models/MongoDB/review.model.ts
import mongoose5, { Schema as Schema3 } from "mongoose";
var ReviewSchema = new Schema3(
  {
    reviewer: { type: Schema3.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String },
    images: [{ type: Schema3.Types.Mixed }],
    createdAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);
var ReviewModel = mongoose5.model("Review", ReviewSchema);
var review_model_default = ReviewModel;

// src/models/MongoDB/training.model.ts
import mongoose6, { Schema as Schema4 } from "mongoose";

// src/types/enums.ts
var SportsEnum = /* @__PURE__ */ ((SportsEnum2) => {
  SportsEnum2["SWIMMING"] = "SWIMMING";
  SportsEnum2["CYCLING"] = "CYCLING";
  SportsEnum2["RUNNING"] = "RUNNING";
  SportsEnum2["WALKING"] = "WALKING";
  SportsEnum2["TRIATHLON"] = "TRIATHLON";
  SportsEnum2["HYROX"] = "HYROX";
  return SportsEnum2;
})(SportsEnum || {});
var TrainingLevelEnum = /* @__PURE__ */ ((TrainingLevelEnum2) => {
  TrainingLevelEnum2["BEGINNER"] = "BEGINNER";
  TrainingLevelEnum2["INTERMEDIATE"] = "INTERMEDIATE";
  TrainingLevelEnum2["ADVANCED"] = "ADVANCED";
  return TrainingLevelEnum2;
})(TrainingLevelEnum || {});
var TrainingGoalEnum = /* @__PURE__ */ ((TrainingGoalEnum2) => {
  TrainingGoalEnum2["RACE"] = "RACE";
  TrainingGoalEnum2["LOSE_WEIGHT"] = "LOSE_WEIGHT";
  TrainingGoalEnum2["STAY_FIT"] = "STAY_FIT";
  TrainingGoalEnum2["HAVE_FUN"] = "HAVE_FUN";
  TrainingGoalEnum2["OTHER"] = "OTHER";
  return TrainingGoalEnum2;
})(TrainingGoalEnum || {});
var TrainingFrequencyEnum = /* @__PURE__ */ ((TrainingFrequencyEnum2) => {
  TrainingFrequencyEnum2["BEGINNER"] = "1_2_PER_WEEK";
  TrainingFrequencyEnum2["INTERMEDIATE"] = "3_4_PER_WEEK";
  TrainingFrequencyEnum2["ADVANCED"] = "5_PLUS_PER_WEEK";
  return TrainingFrequencyEnum2;
})(TrainingFrequencyEnum || {});
var DaysOfTheWeekEnum = /* @__PURE__ */ ((DaysOfTheWeekEnum2) => {
  DaysOfTheWeekEnum2["MONDAY"] = "MONDAY";
  DaysOfTheWeekEnum2["TUESDAY"] = "TUESDAY";
  DaysOfTheWeekEnum2["WEDNESDAY"] = "WEDNESDAY";
  DaysOfTheWeekEnum2["THURSDAY"] = "THURSDAY";
  DaysOfTheWeekEnum2["FRIDAY"] = "FRIDAY";
  DaysOfTheWeekEnum2["SATURDAY"] = "SATURDAY";
  DaysOfTheWeekEnum2["SUNDAY"] = "SUNDAY";
  return DaysOfTheWeekEnum2;
})(DaysOfTheWeekEnum || {});
var TimeSlotsEnum = /* @__PURE__ */ ((TimeSlotsEnum2) => {
  TimeSlotsEnum2["T_06_00"] = "06:00";
  TimeSlotsEnum2["T_06_30"] = "06:30";
  TimeSlotsEnum2["T_07_00"] = "07:00";
  TimeSlotsEnum2["T_07_30"] = "07:30";
  TimeSlotsEnum2["T_08_00"] = "08:00";
  TimeSlotsEnum2["T_08_30"] = "08:30";
  TimeSlotsEnum2["T_09_00"] = "09:00";
  TimeSlotsEnum2["T_09_30"] = "09:30";
  TimeSlotsEnum2["T_10_00"] = "10:00";
  TimeSlotsEnum2["T_10_30"] = "10:30";
  TimeSlotsEnum2["T_11_00"] = "11:00";
  TimeSlotsEnum2["T_11_30"] = "11:30";
  TimeSlotsEnum2["T_12_00"] = "12:00";
  TimeSlotsEnum2["T_12_30"] = "12:30";
  TimeSlotsEnum2["T_13_00"] = "13:00";
  TimeSlotsEnum2["T_13_30"] = "13:30";
  TimeSlotsEnum2["T_14_00"] = "14:00";
  TimeSlotsEnum2["T_14_30"] = "14:30";
  TimeSlotsEnum2["T_15_00"] = "15:00";
  TimeSlotsEnum2["T_15_30"] = "15:30";
  TimeSlotsEnum2["T_16_00"] = "16:00";
  TimeSlotsEnum2["T_16_30"] = "16:30";
  TimeSlotsEnum2["T_17_00"] = "17:00";
  TimeSlotsEnum2["T_17_30"] = "17:30";
  TimeSlotsEnum2["T_18_00"] = "18:00";
  TimeSlotsEnum2["T_18_30"] = "18:30";
  TimeSlotsEnum2["T_19_00"] = "19:00";
  TimeSlotsEnum2["T_19_30"] = "19:30";
  TimeSlotsEnum2["T_20_00"] = "20:00";
  TimeSlotsEnum2["T_20_30"] = "20:30";
  TimeSlotsEnum2["T_21_00"] = "21:00";
  TimeSlotsEnum2["T_21_30"] = "21:30";
  TimeSlotsEnum2["T_22_00"] = "22:00";
  return TimeSlotsEnum2;
})(TimeSlotsEnum || {});
var LanguageEnum = /* @__PURE__ */ ((LanguageEnum2) => {
  LanguageEnum2["IT"] = "it";
  LanguageEnum2["EN"] = "en";
  return LanguageEnum2;
})(LanguageEnum || {});
var TrainingStatusEnum = /* @__PURE__ */ ((TrainingStatusEnum2) => {
  TrainingStatusEnum2["SCHEDULED"] = "SCHEDULED";
  TrainingStatusEnum2["COMPLETED"] = "COMPLETED";
  TrainingStatusEnum2["CANCELLED"] = "CANCELLED";
  return TrainingStatusEnum2;
})(TrainingStatusEnum || {});

// src/models/MongoDB/training.model.ts
var TrainingSchema = new Schema4(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    date: { type: Date, required: true },
    address: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point"
      },
      coordinates: {
        type: [Number],
        // [longitude, latitude]
        required: true
      }
    },
    sport: {
      type: String,
      enum: Object.values(SportsEnum)
    },
    creator: { type: Schema4.Types.ObjectId, ref: "User", required: true },
    participantAttendance: [
      {
        participant: { type: Schema4.Types.ObjectId, ref: "User" },
        attended: { type: Boolean, default: false }
      }
    ],
    difficultyLevel: { type: String, enum: Object.values(TrainingLevelEnum) },
    duration: { type: Number },
    likes: [{ type: Schema4.Types.ObjectId, ref: "User" }],
    comments: [
      {
        type: Schema4.Types.ObjectId,
        ref: "Comment"
      }
    ],
    reviews: [{ type: Schema4.Types.ObjectId, ref: "Review" }],
    status: {
      type: String,
      enum: Object.values(TrainingStatusEnum),
      default: "SCHEDULED" /* SCHEDULED */
    }
  },
  {
    timestamps: true
  }
);
TrainingSchema.index({ location: "2dsphere" });
TrainingSchema.index({ date: 1, sport: 1, creator: 1 });
TrainingSchema.index({ date: 1 });
TrainingSchema.index({ creator: 1 });
var TrainingModel = mongoose6.model(
  "Training",
  TrainingSchema
);
var training_model_default = TrainingModel;

// src/models/MongoDB/user.model.ts
import mongoose7, { Schema as Schema5 } from "mongoose";
var UserSchema = new Schema5(
  {
    athleteBio: { type: String, required: false },
    authId: { type: String, required: true, unique: true },
    city: { type: Schema5.Types.ObjectId, ref: "City", required: false },
    dateOfBirth: { type: Date, required: false },
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    hasCompletedOnboarding: { type: Boolean, required: false },
    image: { type: Schema5.Types.Mixed, required: false },
    lastName: { type: String },
    lastOnboardingStep: { type: String, required: false },
    privacySettings: { type: Boolean, default: false },
    rangeOfAction: { type: Number },
    sports: [
      {
        type: String,
        enum: Object.values(SportsEnum)
      }
    ],
    trainingGoal: [
      {
        type: String,
        enum: Object.values(TrainingGoalEnum)
      }
    ],
    trainingLevel: {
      type: String,
      enum: Object.values(TrainingLevelEnum)
    },
    trainingFrequency: {
      type: String,
      enum: Object.values(TrainingFrequencyEnum)
    },
    trainingPartnerPreference: { type: String },
    trainingTimeSlot: [
      {
        day: {
          type: String,
          enum: Object.values(DaysOfTheWeekEnum)
        },
        startTime: {
          type: String,
          enum: Object.values(TimeSlotsEnum)
        },
        endTime: {
          type: String,
          enum: Object.values(TimeSlotsEnum)
        }
      }
    ],
    trainingPoints: { type: Number, default: 0 },
    reviewPoints: { type: Number, default: 0 },
    countTrainingOrganized: { type: Number, default: 0 },
    countTrainingJoined: { type: Number, default: 0 },
    countTrainingMissed: { type: Number, default: 0 },
    language: {
      type: String,
      enum: Object.values(LanguageEnum),
      default: "it" /* IT */
    }
  },
  {
    timestamps: true
  }
);
var UserModel = mongoose7.model("User", UserSchema);
var user_model_default = UserModel;

// src/services/training.service.ts
var TrainingService = class extends BaseService {
  constructor() {
    super(training_model_default);
  }
  async create(entity) {
    const { data: newTraining } = await super.create(entity);
    if (newTraining && newTraining.creator) {
      await user_model_default.findByIdAndUpdate(newTraining.creator, {
        $inc: { countTrainingOrganized: 1 }
      });
    }
    return { data: newTraining };
  }
  async delete(id) {
    const training = await this.model.findById(id);
    if (!training) {
      throw new Error("Training not found");
    }
    const creatorId = training.creator;
    const { data: deleted } = await super.delete(id);
    if (deleted && creatorId) {
      await user_model_default.findByIdAndUpdate(creatorId, {
        $inc: { countTrainingOrganized: -1 }
      });
    }
    return { data: deleted };
  }
  async getRecommendedTrainings(user, populateFields, maxDistanceKm = 40, limit = 10) {
    const now = /* @__PURE__ */ new Date();
    const userSports = user.sports || [];
    const userLevel = user.trainingLevel;
    const userTimeSlots = user.trainingTimeSlot || [];
    const hasCityCoordinates = user.city && user.city.longitude !== void 0 && user.city.latitude !== void 0;
    let idsWithDistance = [];
    const minResults = limit / 2;
    if (hasCityCoordinates) {
      idsWithDistance = await this.model.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [user.city.longitude || 0, user.city.latitude || 0]
            },
            distanceField: "distance",
            spherical: true,
            maxDistance: maxDistanceKm * 1e3
          }
        },
        {
          $match: {
            date: { $gte: now },
            sport: { $in: userSports },
            creator: { $ne: user._id }
          }
        },
        { $project: { _id: 1, distance: 1 } },
        { $limit: limit }
      ]);
      if (idsWithDistance.length < minResults) {
        const extra = await this.model.aggregate([
          {
            $geoNear: {
              near: {
                type: "Point",
                coordinates: [user.city.longitude || 0, user.city.latitude || 0]
              },
              distanceField: "distance",
              spherical: true,
              maxDistance: maxDistanceKm * 5 * 1e3
            }
          },
          {
            $match: {
              date: { $gte: now },
              creator: { $ne: user._id }
            }
          },
          { $project: { _id: 1, distance: 1 } },
          { $limit: limit }
        ]);
        idsWithDistance = [
          ...idsWithDistance,
          ...extra.filter(
            (e) => !idsWithDistance.find(
              (t) => t._id.toString() === e._id.toString()
            )
          )
        ];
      }
    }
    if (idsWithDistance.length < limit) {
      const fallback = await this.model.find({
        date: { $gte: now },
        creator: { $ne: user._id }
      }).sort({ date: 1 }).limit(limit - idsWithDistance.length).select("_id").lean();
      idsWithDistance = [
        ...idsWithDistance,
        ...fallback.filter(
          (e) => !idsWithDistance.find((t) => t._id.toString() === e._id.toString())
        )
      ];
    }
    const ids = idsWithDistance.map((item) => item._id);
    const { data } = await this.list({
      pageNum: 1,
      pageSize: limit,
      filters: {
        _id: { $in: ids },
        creator: { $ne: user._id }
      },
      populateFields
    });
    const trainingsWithScore = data.map((training) => {
      let score = 0;
      if (training.sport && userSports.includes(training.sport)) score += 5;
      if (userLevel && training.difficultyLevel === userLevel) score += 3;
      if (userTimeSlots.length && training.date) {
        const trainingHour = new Date(training.date).getHours();
        const trainingDay = new Date(training.date).getDay();
        const slotMatch = userTimeSlots.some((slot) => {
          const start = parseInt(slot.startTime.split(":")[0], 10);
          const end = parseInt(slot.endTime.split(":")[0], 10);
          return trainingHour >= start && trainingHour <= end && parseInt(slot.day, 10) === trainingDay;
        });
        if (slotMatch) score += 2;
      }
      const distanceObj = idsWithDistance.find(
        (i) => i._id.toString() === training._id.toString()
      );
      if (distanceObj?.distance) {
        const distKm = distanceObj.distance / 1e3;
        if (distKm <= maxDistanceKm) score += 5;
        else if (distKm <= maxDistanceKm * 2) score += 2;
      }
      return { training, score };
    });
    trainingsWithScore.sort((a, b) => b.score - a.score);
    return trainingsWithScore.map((item) => item.training).slice(0, limit);
  }
  async addLike(id, userId) {
    return this.model.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userId } },
      { new: true }
    );
  }
  async removeLike(id, userId) {
    return this.model.findByIdAndUpdate(
      id,
      { $pull: { likes: userId } },
      { new: true }
    );
  }
  async addParticipant(id, userId) {
    const training = await this.model.findById(id);
    if (!training) {
      throw new Error("Training not found");
    }
    if (training.status !== "SCHEDULED" /* SCHEDULED */) {
      throw new Error(
        "Cannot add participant. Training is not in scheduled status."
      );
    }
    const newParticipant = { participant: userId, attended: true };
    return this.model.findByIdAndUpdate(
      id,
      { $addToSet: { participantAttendance: newParticipant } },
      { new: true }
    );
  }
  async removeParticipant(id, userId) {
    const training = await this.model.findById(id);
    if (!training) {
      throw new Error("Training not found");
    }
    if (training.status !== "SCHEDULED" /* SCHEDULED */) {
      throw new Error(
        "Cannot remove participant. Training is not in scheduled status."
      );
    }
    return this.model.findByIdAndUpdate(
      id,
      { $pull: { participantAttendance: { participant: userId } } },
      { new: true }
    );
  }
  async addComment(id, userId, text) {
    const comment = await comment_model_default.create({ user: userId, text });
    return this.model.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      { new: true }
    );
  }
  async updateComment(commentId, text) {
    return comment_model_default.findByIdAndUpdate(
      commentId,
      { text, updatedAt: /* @__PURE__ */ new Date() },
      { new: true }
    );
  }
  async removeComment(id, commentId) {
    await comment_model_default.deleteOne({ _id: commentId });
    return this.model.findByIdAndUpdate(
      id,
      { $pull: { comments: commentId } },
      { new: true }
    );
  }
  async changeStatus(id, userId, newStatus) {
    const training = await this.model.findById(id);
    if (!training) {
      throw new Error("Training not found");
    }
    const validStatuses = [
      "SCHEDULED" /* SCHEDULED */,
      "COMPLETED" /* COMPLETED */,
      "CANCELLED" /* CANCELLED */
    ];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(
        "Invalid status. Must be one of: scheduled, completed, cancelled"
      );
    }
    if (training.creator.toString() !== userId) {
      throw new Error("Only the creator can change the status");
    }
    if (newStatus === "COMPLETED" /* COMPLETED */ && training.status !== "COMPLETED" /* COMPLETED */) {
      if (training.participantAttendance && training.participantAttendance.length > 0) {
        await user_model_default.findByIdAndUpdate(userId, {
          $inc: { trainingPoints: 5 }
        });
        for (const attendance of training.participantAttendance) {
          if (attendance.attended) {
            await user_model_default.findByIdAndUpdate(attendance.participant, {
              $inc: { countTrainingJoined: 1, trainingPoints: 1 }
            });
          } else {
            await user_model_default.findByIdAndUpdate(attendance.participant, {
              $inc: { countTrainingMissed: 1 }
            });
          }
        }
      }
    }
    if (newStatus === "CANCELLED" /* CANCELLED */ && training.status !== "CANCELLED" /* CANCELLED */) {
      await user_model_default.findByIdAndUpdate(userId, {
        $inc: { countTrainingOrganized: -1 }
      });
    }
    return this.model.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );
  }
  async addReview(trainingId, reviewerId, rating, comment, images) {
    const training = await this.model.findById(trainingId);
    if (!training) {
      throw new Error("Training not found");
    }
    if (training.status !== "COMPLETED" /* COMPLETED */) {
      throw new Error("Training must be completed before it can be reviewed");
    }
    const isParticipant = training.participantAttendance && training.participantAttendance.some(
      (attendance) => attendance.participant.toString() === reviewerId
    );
    if (!isParticipant) {
      throw new Error("Only participants can add reviews");
    }
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    const existingReview = await review_model_default.findOne({
      training: trainingId,
      reviewer: reviewerId
    });
    if (existingReview) {
      throw new Error("You have already reviewed this training");
    }
    const review = await review_model_default.create({
      training: trainingId,
      reviewer: reviewerId,
      rating,
      comment,
      images
    });
    await this.model.findByIdAndUpdate(trainingId, {
      $addToSet: { reviews: review._id }
    });
    await user_model_default.findByIdAndUpdate(training.creator, {
      $inc: { reviewPoints: rating }
    });
    return review;
  }
};

// src/services/user.service.ts
var UserService = class extends BaseService {
  constructor() {
    super(user_model_default);
  }
};

// src/container.ts
var container = createContainer({
  injectionMode: InjectionMode.CLASSIC
});
container.register({
  cityService: asClass(CityService),
  userService: asClass(UserService),
  trainingService: asClass(TrainingService),
  cloudinaryService: asClass(CloudinaryService),
  geocodeService: asClass(GeocodeService)
}).register({
  cityController: asClass(CityController),
  userController: asClass(UserController),
  trainingController: asClass(TrainingController),
  cloudinaryController: asClass(CloudinaryController),
  geocodeController: asClass(GeocodeController)
});
var container_default = container;

// src/routes/index.ts
import express6 from "express";

// src/routes/city.routes.ts
import express from "express";

// src/middlewares/auth.middleware.ts
import { auth } from "express-oauth2-jwt-bearer";
var authenticate = auth({
  audience: process.env.OAUTH_AUDIENCE,
  issuerBaseURL: process.env.OAUTH_DOMAIN,
  tokenSigningAlg: "RS256"
});

// src/middlewares/upload.middleware.ts
import multer2 from "multer";
var fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("ONLY IMAGES ARE ALLOWED!"));
  }
};
var upload = multer2({
  storage: multer2.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 2
    // 2MB file size limit
  }
});

// src/middlewares/validation.middleware.ts
import { validationResult } from "express-validator";
var handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array(),
      message: "INVALID INPUTS TYPE"
    });
    return;
  }
  next();
};

// src/routes/city.routes.ts
var cityRoute = express.Router();
var cityController = container_default.resolve("cityController");
cityRoute.get("/inizialize", (req, res) => cityController.inizialize(req, res));
cityRoute.post(
  "/list",
  authenticate,
  (req, res) => cityController.list(req, res)
);
cityRoute.get("/:id", authenticate, (req, res) => cityController.get(req, res));
cityRoute.post(
  "/",
  authenticate,
  (req, res) => cityController.create(req, res)
);
cityRoute.put(
  "/:id",
  authenticate,
  (req, res) => cityController.update(req, res)
);
cityRoute.delete(
  "/:id",
  authenticate,
  (req, res) => cityController.delete(req, res)
);
var city_routes_default = cityRoute;

// src/routes/cloudinary.route.ts
import express2 from "express";
var cloudinaryRoute = express2.Router();
var cloudinaryController = container_default.resolve(
  "cloudinaryController"
);
cloudinaryRoute.post(
  "/upload",
  authenticate,
  upload.single("file"),
  (req, res) => cloudinaryController.upload(req, res)
);
cloudinaryRoute.delete(
  "/:public_id",
  authenticate,
  (req, res) => cloudinaryController.delete(req, res)
);
var cloudinary_route_default = cloudinaryRoute;

// src/routes/geocode.routes.ts
import express3 from "express";
var geocodeRoutes = express3.Router();
var geocodeController = container_default.resolve("geocodeController");
geocodeRoutes.get(
  "/search",
  authenticate,
  (req, res) => geocodeController.search(req, res)
);
geocodeRoutes.get(
  "/reverse",
  authenticate,
  (req, res) => geocodeController.reverse(req, res)
);
var geocode_routes_default = geocodeRoutes;

// src/routes/training.routes.ts
import express4 from "express";
var trainingRoutes = express4.Router({ mergeParams: true });
var trainingController = container_default.resolve("trainingController");
trainingRoutes.post(
  "/list",
  authenticate,
  (req, res) => trainingController.list(req, res)
);
trainingRoutes.get(
  "/recommended",
  authenticate,
  (req, res) => trainingController.getRecommendedTrainings(req, res)
);
trainingRoutes.get(
  "/:id",
  authenticate,
  (req, res) => trainingController.get(req, res)
);
trainingRoutes.post(
  "/",
  authenticate,
  (req, res) => trainingController.create(req, res)
);
trainingRoutes.put(
  "/:id",
  authenticate,
  (req, res) => trainingController.update(req, res)
);
trainingRoutes.post(
  "/:id/like",
  authenticate,
  (req, res) => trainingController.addLike(req, res)
);
trainingRoutes.post(
  "/:id/participants",
  authenticate,
  (req, res) => trainingController.addParticipant(req, res)
);
trainingRoutes.delete(
  "/:id/like",
  authenticate,
  (req, res) => trainingController.removeLike(req, res)
);
trainingRoutes.delete(
  "/:id/participants",
  authenticate,
  (req, res) => trainingController.removeParticipant(req, res)
);
trainingRoutes.delete(
  "/:id",
  authenticate,
  (req, res) => trainingController.delete(req, res)
);
trainingRoutes.post(
  "/:id/comments",
  authenticate,
  (req, res) => trainingController.addComment(req, res)
);
trainingRoutes.put(
  "/comments/:commentId",
  authenticate,
  (req, res) => trainingController.updateComment(req, res)
);
trainingRoutes.delete(
  "/:id/comments/:commentId",
  authenticate,
  (req, res) => trainingController.removeComment(req, res)
);
trainingRoutes.patch(
  "/:id/status",
  authenticate,
  (req, res) => trainingController.changeStatus(req, res)
);
trainingRoutes.post(
  "/:id/reviews",
  authenticate,
  (req, res) => trainingController.addReview(req, res)
);
var training_routes_default = trainingRoutes;

// src/routes/user.routes.ts
import express5 from "express";

// src/validators/user.validator.ts
import { body } from "express-validator";
var validateUserCreation = [
  body("email").exists({ checkFalsy: true }).withMessage("EMAIL IS REQUIRED").isEmail().withMessage("EMAIL INVALID TYPE").normalizeEmail(),
  body("authId").exists({ checkFalsy: true }).withMessage("authId IS REQUIRED").isString().withMessage("authId INVALID TYPE"),
  body("firstName").optional().isString().withMessage("FIRST NAME INVALID TYPE"),
  body("lastName").optional().isString().withMessage("LAST NAME INVALID TYPE"),
  body("image").optional().isObject().withMessage("IMAGE INVALID TYPE"),
  body("dateOfBirth").optional().isISO8601().withMessage("DATE OF BIRTH INVALID TYPE"),
  body("city").optional().isMongoId().withMessage("CITY INVALID ID"),
  body("sports").optional().isArray().withMessage("SPORTS MUST BE AN ARRAY").custom(
    (sports) => sports.every(
      (sport) => Object.values(SportsEnum).includes(sport)
    )
  ).withMessage("INVALID SPORT VALUE"),
  body("trainingLevel").optional().isIn(Object.values(TrainingLevelEnum)).withMessage("trainingLevel NOT ALLOWED"),
  body("trainingGoal").optional().isArray().withMessage("trainingGoal MUST BE AN ARRAY").custom(
    (goals) => goals.every(
      (goal) => Object.values(TrainingGoalEnum).includes(goal)
    )
  ).withMessage("INVALID trainingGoal VALUE"),
  body("athleteBio").optional().isString().isLength({ max: 500 }).withMessage("athleteBio TOO LONG"),
  body("lastOnboardingStep").optional().isString().withMessage("lastOnboardingStep INVALID TYPE"),
  body("hasCompletedOnboarding").optional().isBoolean().withMessage("hasCompletedOnboarding MUST BE BOOLEAN"),
  body("privacySettings").optional().isBoolean().withMessage("privacySettings MUST BE BOOLEAN")
];
var validateUserUpdate = [
  body("email").optional().isEmail().withMessage("EMAIL INVALID TYPE").normalizeEmail(),
  body("authId").optional().isString().withMessage("authId INVALID TYPE"),
  body("firstName").optional().isString().withMessage("FIRST NAME INVALID TYPE"),
  body("lastName").optional().isString().withMessage("LAST NAME INVALID TYPE"),
  body("image").optional().isObject().withMessage("IMAGE INVALID TYPE"),
  body("dateOfBirth").optional().isISO8601().withMessage("DATE OF BIRTH INVALID TYPE"),
  body("city").optional().isMongoId().withMessage("CITY INVALID ID"),
  body("sports").optional().isArray().withMessage("SPORTS MUST BE AN ARRAY").custom(
    (sports) => sports.every(
      (sport) => Object.values(SportsEnum).includes(sport)
    )
  ).withMessage("INVALID SPORT VALUE"),
  body("trainingLevel").optional().isIn(Object.values(TrainingLevelEnum)).withMessage("trainingLevel NOT ALLOWED"),
  body("trainingGoal").optional().isArray().withMessage("trainingGoal MUST BE AN ARRAY").custom(
    (goals) => goals.every(
      (goal) => Object.values(TrainingGoalEnum).includes(goal)
    )
  ).withMessage("INVALID trainingGoal VALUE"),
  body("athleteBio").optional().isString().isLength({ max: 500 }).withMessage("athleteBio TOO LONG"),
  body("lastOnboardingStep").optional().isString().withMessage("lastOnboardingStep INVALID TYPE"),
  body("hasCompletedOnboarding").optional().isBoolean().withMessage("hasCompletedOnboarding MUST BE BOOLEAN"),
  body("privacySettings").optional().isBoolean().withMessage("privacySettings MUST BE BOOLEAN")
];

// src/routes/user.routes.ts
var userRoute = express5.Router();
var userController = container_default.resolve("userController");
userRoute.get(
  "/me",
  authenticate,
  (req, res) => userController.getMe(req, res)
);
userRoute.get("/:id", authenticate, (req, res) => userController.get(req, res));
userRoute.post(
  "/",
  authenticate,
  validateUserCreation,
  handleValidationErrors,
  (req, res) => userController.create(req, res)
);
userRoute.put(
  "/:id",
  authenticate,
  validateUserUpdate,
  handleValidationErrors,
  (req, res) => userController.update(req, res)
);
userRoute.delete(
  "/:id",
  authenticate,
  (req, res) => userController.delete(req, res)
);
var user_routes_default = userRoute;

// src/routes/index.ts
var router = express6.Router();
router.use("/city", city_routes_default);
router.use("/cloudinary", cloudinary_route_default);
router.use("/geocode", geocode_routes_default);
router.use("/training", training_routes_default);
router.use("/user", user_routes_default);
var routes_default = router;

// src/appServer.ts
dotenv2.config();
var REQUIRED_ENV_VARS = ["SERVER_PORT", "MONGODB_URI"];
REQUIRED_ENV_VARS.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(chalk6.red(`Environment variable ${varName} is not defined.`));
    process.exit(1);
  }
});
var SERVER_PORT = parseInt(process.env.SERVER_PORT ?? "666", 10);
var appServer = express7();
appServer.use(scopePerRequest(container_default));
appServer.use(express7.json());
var corsOptions = {
  origin: process.env.APP_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
};
appServer.use(cors(corsOptions));
appServer.options("*", cors(corsOptions));
appServer.use(express7.urlencoded({ extended: true }));
appServer.use(express7.static("public"));
appServer.get("/", (_req, res) => {
  res.sendFile("index.html", { root: "./public" });
});
appServer.use("/api", routes_default);
setupSwagger(appServer);
async function gracefulShutdown(signal) {
  console.info(`Received ${signal}. Gracefully shutting down...`);
  try {
    console.info("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error(chalk6.red("Error during shutdown: ", error));
    process.exit(1);
  }
}
["SIGINT", "SIGTERM"].forEach(
  (signal) => process.on(signal, () => gracefulShutdown(signal))
);
async function startServer() {
  try {
    await database_default();
    const shouldFetchCityOnStartup = process.env.FETCH_CITY_ON_STARTUP === "true";
    if (shouldFetchCityOnStartup) {
      const cityService = container_default.resolve("cityService");
      await cityService.inizialize();
    }
    appServer.listen(SERVER_PORT, () => {
      console.info(
        chalk6.green(`Server is running on http://localhost:${SERVER_PORT}`)
      );
    });
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
}
startServer().catch((error) => {
  console.error("Failed to start the server:", error);
  process.exit(1);
});
