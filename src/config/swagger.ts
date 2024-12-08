import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TrainTribeApi Documentation",
      version: "1.0.0",
      description: "API Documentation for TrainTribeApi"
    },
    servers: [
      {
        url: "http://localhost:666"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT" // Опціонально
        }
      },
      schemas: {
        Sport: {
          type: "object",
          required: ["name"],
          properties: {
            id: {
              type: "string",
              description: "The unique identifier of the sport"
            },
            name: {
              type: "string",
              description: "The name of the sport"
            }
          }
        },
        User: {
          type: "object",
          required: ["email", "sports"],
          properties: {
            _id: {
              type: "string",
              description: "The unique identifier of the user"
            },
            email: {
              type: "string",
              description: "The email of the user"
            },
            username: {
              type: "string",
              description: "The username of the user"
            },
            first_name: {
              type: "string",
              description: "The first name of the user"
            },
            last_name: {
              type: "string",
              description: "The last name of the user"
            },
            image_url: {
              type: "string",
              description: "The image URL"
            },
            latitude: {
              type: "number",
              description: "The latitude of the user"
            },
            longitude: {
              type: "number",
              description: "The longitude of the user"
            },
            sports: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Sport"
              }
            },
            training_created: {
              type: "array",
              items: {
                type: "string"
              }
            },
            training_join: {
              type: "array",
              items: {
                type: "string"
              }
            },
            createdAt: {
              type: "string",
              description: "The date the user was created"
            },
            updatedAt: {
              type: "string",
              description: "The date the user was last updated"
            }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.ts"]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
