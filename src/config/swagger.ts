import { Express } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

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
          description:
            "Bad Request - The request was malformed or contained invalid parameters",
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
          description:
            "Unauthorized - Authentication is required or has failed",
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
          description:
            "Internal Server Error - Something went wrong on the server",
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
              description:
                "Number of trainings the user has joined and attended",
              example: 0
            },
            countTrainingMissed: {
              type: "integer",
              description:
                "Number of trainings the user was registered for but missed",
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

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
