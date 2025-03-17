# TrainTribeServer

## Description

TrainTribeServer is a server-side REST API designed to handle requests from the client side, managing users and training events. The application is built on `Node.js` using the `Express` framework and supports both `MongoDB` and `MySQL` databases.

This project includes **Swagger** documentation, which provides an interactive user interface for exploring and testing API endpoints. It simplifies understanding and debugging the API for developers and external teams.

## Functionality

- Handles requests from the client side to facilitate communication between users and training events.
- Manages a MySQL database to store data about users and events.
- CRUD operations for users: creating, editing, and deleting user accounts.
- CRUD operations for training events: creating, editing, sorting, and deleting training sessions.

## Installation and Setup Instructions

This section provides step-by-step instructions for installing and running the server locally or in a production environment.

### Prerequisites

Before installing and running the server, make sure the following tools are installed on your system:

- **Node.js** (v16.x or later)
- **npm** (v8.x or later)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/rokokos97/TrainTribeServer.git
   cd project-name

   ```

2. **Install Dependencies**:

   ```bash
   npm install

   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add the following environment variables:

   ```bash
   PORT=666

   DB_TYPE=mongoDB

   OAUTH_AUDIENCE='your auth0 audience'

   OAUTH_DOMAIN='your auth0 domain'

    MONGODB_URI='your mongo db uri'
   ```

4. **Run the Server**:

   ```bash
   npm run build
   npm start
   ```

5. **View API Documentation**:
   After starting the server, you can access the API documentation powered by **Swagger** at the following URL:

   ```plaintext
   http://localhost:<PORT>/api-docs
   ```

## Architecture

The application is built on the `MVC` architecture pattern, where the `Model` represents the data, the `View` represents the user interface, and the `Controller` manages the communication between the `Model` and the `View`.

## Project Structure

| Directory / File               | Description                                        |
| ------------------------------ | -------------------------------------------------- |
| `src/`                         | Main code directory                                |
| ├── `config/`                  | Configuration files (e.g., database, environment)  |
| ├── `controllers/`             | Controllers for handling requests                  |
| │ └── `base.controller.ts`     | Base controller with common functionality          |
| │ └── `city.controller.ts`     | Logic for handling city-related API requests       |
| │ └── `training.controller.ts` | Logic for handling training-related API requests   |
| │ └── `upload.controller.ts`   | Logic for handling file uploads                    |
| │ └── `user.controller.ts`     | Logic for handling user-related API requests       |
| ├── `errors/`                  | Error handling classes and utilities               |
| │ └── `baseError.ts`           | Base error class for custom error handling         |
| │ └── `clientErrors.ts`        | Client-side error definitions                      |
| │ └── `mongoErrors.ts`         | MongoDB-specific error handling                    |
| │ └── `networkErrors.ts`       | Network-related error definitions                  |
| │ └── `serverError.ts`         | Server-side error definitions                      |
| ├── `interfaces/`              | TypeScript interfaces for strict type definitions  |
| ├── `middlewares/`             | Middleware functions                               |
| │ └── `auth.middleware.ts`     | Middleware for handling user authentication        |
| │ └── `upload.middleware.ts`   | Middleware for handling file uploads               |
| │ └── `validation.middleware.ts` | Middleware for request validation                |
| ├── `mock/`                    | Mock data for testing and development              |
| ├── `models/`                  | Database structure definitions (Models)            |
| │ └── `MongoDB/`               | MongoDB models for application                     |
| │ │ └── `city.model.ts`        | MongoDB model for city entities                    |
| │ │ └── `training.model.ts`    | MongoDB model for training entities                |
| │ │ └── `user.model.ts`        | MongoDB model for user entities                    |
| ├── `routes/`                  | API route definitions                              |
| │ └── `city.routes.ts`         | Routes for city-related endpoints                  |
| │ └── `index.ts`               | Main router combining all routes                   |
| │ └── `user.routes.ts`         | Routes for user-related endpoints                  |
| │ └── `training.routes.ts`     | Routes for training-related endpoints              |
| │ └── `upload.route.ts`        | Routes for file upload endpoints                   |
| ├── `services/`                | Business logic layer                               |
| │ └── `base.service.ts`        | Base service with common functionality             |
| │ └── `city.service.ts`        | Service for city-related operations                |
| │ └── `training.service.ts`    | Service for training-related operations            |
| │ └── `user.service.ts`        | Service for user-related operations                |
| ├── `types/`                   | Global TypeScript type definitions                 |
| ├── `utils/`                   | Utility and helper functions                       |
| ├── `validators/`              | Request validation schemas                         |
| │ └── `user.validator.ts`      | Validation schemas for user-related requests       |
| `dist/`                        | Compiled JavaScript output directory               |
| `public/`                      | Static files directory                             |
| `uploads/`                     | Uploads directory for storing user files           |
| `.eslintrc.json`               | ESLint configuration                               |
| `eslint.config.js`             | ESLint configuration                               |
| `.gitignore`                   | Git ignore file                                    |
| `package.json`                 | Node.js dependencies file                          |
| `README.md`                    | Project documentation                              |
| `jest.config.ts`               | Jest configuration file for testing setup          |
| `nodemon.json`                 | Nodemon configuration file for automatic restarts  |
| `tsconfig.json`                | TypeScript configuration                           |
| `vercel.json`                  | Vercel deployment configuration                    |

## Technologies

- **Node.js**
- **Express**
- **Mongoose**
- **Bcrypt**
- **JWT**
- **Dotenv**
- **nanoid**
- **JESt**

## API Endpoints

The server provides the following API endpoints:

### **User**

| Method | Endpoint    | Description                                  |
| ------ | ----------- | -------------------------------------------- |
| GET    | `/api/user` | Fetch user data                              |
| PUT    | `/api/user` | Update user by Token (ID extracted from JWT) |
| POST   | `/api/user` | Update user by Token (ID extracted from JWT) |
| DELETE | `/api/user` | Delete user by Token (ID extracted from JWT) |

### **City**

| Method | Endpoint         | Description      |
| ------ | ---------------- | ---------------- |
| GET    | `/api/city`      | Get all cities   |
| GET    | `/api/city/id`   | Get city by ID   |
| GET    | `/api/city/name` | Get city by name |

### **Upload**

| Method | Endpoint      | Description   |
| ------ | ------------- | ------------- |
| POST   | `/api/upload` | Upload images |

## Models

### User

| Field                      | Type         | Required | Unique | Description                                                              |
| -------------------------- | ------------ | -------- | ------ | ------------------------------------------------------------------------ |
| `_id`                      | `String`     | Yes      | Yes    | User's id.                                                               |
| `username`                 | `String`     | No       | No     | User's display name.                                                     |
| `first_name`               | `String`     | No       | No     | User's first name.                                                       |
| `last_name`                | `String`     | No       | No     | User's last name.                                                        |
| `email`                    | `String`     | Yes      | Yes    | User's email address (used for authentication and communication).        |
| `sports`                   | `String[]`   | Yes      | No     | Array of sports types from SportsEnum (e.g., running, cycling, swimming) |
| `image_url`                | `String`     | No       | No     | URL to the user's profile picture.                                       |
| `city`                     | `ObjectId`   | No       | No     | Reference to the user's city.                                            |
| `completed_trainings`      | `Number`     | No       | No     | Number of trainings the user has completed.                              |
| `social_number`            | `String`     | No       | No     | User's social number.                                                    |
| `athlete_bio`              | `String`     | No       | No     | User's athletic biography and background information.                    |
| `auth_id`                  | `String`     | Yes      | Yes    | Unique authentication ID from the auth provider.                         |
| `last_onboarding_step`     | `String`     | No       | No     | Indicates the last completed onboarding step.                            |
| `has_completed_onboarding` | `Boolean`    | Yes      | No     | Indicates if user has completed onboarding.                              |
| `privacy_settings`         | `Boolean`    | No       | No     | User's privacy preference. Default is false.                             |
| `training_created`         | `[ObjectId]` | No       | No     | Array of references to `Training` documents the user has created.        |
| `training_join`            | `[ObjectId]` | No       | No     | Array of references to `Training` documents the user has joined.         |
| `createdAt`                | `Date`       | Auto     | No     | Timestamp when the user document was created.                            |
| `updatedAt`                | `Date`       | Auto     | No     | Timestamp when the user document was last updated.                       |

### City

| Field        | Type     | Required | Unique | Description                                       |
| ------------ | -------- | -------- | ------ | ------------------------------------------------- |
| `_id`        | `String` | Yes      | Yes    | City's id.                                        |
| `id`         | `Number` | Yes      | No     | City's numeric identifier.                        |
| `name`       | `String` | No       | No     | Name of the city.                                 |
| `latitude`   | `Number` | No       | No     | Geographical latitude of the city's location.     |
| `longitude`  | `Number` | No       | No     | Geographical longitude of the city's location.    |
| `province`   | `String` | No       | No     | Province or state where the city is located.      |
| `population` | `Number` | No       | No     | Population of the city.                           |
| `createdAt`  | `Date`   | Auto     | No     | Timestamp when the city document was created.     |
| `updatedAt`  | `Date`   | Auto     | No     | Timestamp when the user document was last updated |

### Training Model

| **Field**      | **Type**     | **Required** | **Description**                                                                              |
| -------------- | ------------ | ------------ | -------------------------------------------------------------------------------------------- |
| `title`        | `String`     | Yes          | The title or name of the training event.                                                     |
| `description`  | `String`     | No           | Additional details about the training event.                                                 |
| `date`         | `Date`       | Yes          | The date and time of the training event.                                                     |
| `latitude`     | `Number`     | Yes          | The geographical latitude where the training event will take place.                          |
| `longitude`    | `Number`     | Yes          | The geographical longitude where the training event will take place.                         |
| `sport`        | `ObjectId`   | Yes          | A reference to the `Sport` collection, representing the sport category for the training.     |
| `creator`      | `ObjectId`   | Yes          | A reference to the `User` collection, identifying the creator of the training event.         |
| `participants` | `ObjectId[]` | No           | An array of references to the `User` collection, representing users who joined the training. |
| `createdAt`    | `Date`       | Auto         | The timestamp when the training document was created.                                        |
| `updatedAt`    | `Date`       | Auto         | The timestamp when the training document was last updated.                                   |

---
