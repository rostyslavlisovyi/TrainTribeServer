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

   AUTH0_AUDIENCE='your auth0 audience'

   AUTH0_DOMAIN='your auth0 domain'

    MONGO_DB_URI='your mongo db uri'
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

| Directory / File                    | Description                                        |
| ----------------------------------- | -------------------------------------------------- |
| `src/`                              | Main code directory                                |
| ├── `config/`                       | Configuration files (e.g., database, environment)  |
| │ └── `database.ts`                 | Database connection configuration                  |
| │ └── `sequelize.ts`                | Connect to MySql DB                                |
| │ └── `swagger.ts`                  | Swagger/OpenAPI documentation configuration        |
| │ └── `syncMock.ts`                 | Connect do MongoDB and sync collections with Mock  |
| ├── `controllers/`                  | Controllers for handling requests                  |
| │ └── `sport.controller.ts`         | Logic for handling sport-related API requests      |
| │ └── `upload.controller.ts`        | Logic for handling file uploads                    |
| │ └── `user.controller.ts`          | Logic for handling user-related API requests       |
| ├── `interfaces/`                   | TypeScript interfaces for strict type definitions  |
| │ └── `sport.interfaces.ts`         | Define TypeScript interfaces for sport entities    |
| │ └── `training.interfaces.ts`      | Define TypeScript interfaces for training entities |
| │ └── `user.interfaces.ts`          | Define TypeScript interfaces for user entities     |
| ├── `middleware/`                   | Middleware functions                               |
| │ └── `auth.middleware.ts`          | Middleware for handling user authentication        |
| │ └── `upload.middleware.ts`        | Middleware for                                     |
| ├── `mock/`                         | Mock data for development and testing              |
| │ └── `sportsMock.mock.ts`          | Mock data for sports-related entities              |
| ├── `models/`                       | Database structure definitions (Models)            |
| │ └── `MongoDB/`                    | MongoDB models for application                     |
| │ │ └── `sport.model.mongoDB.ts`    | MongoDB model for sports entities                  |
| │ │ └── `training.model.mongoDB.ts` | MongoDB model for training entities                |
| │ │ └── `user.model.mongoDB.ts`     | MongoDB model for user entities                    |
| │ └── `mySql/`                      | MySQL models for application                       |
| │ └── `user.model.mySql.ts`         | MySQL model for user entities                      |
| │ └── `training.ts`                 | MySQL model for training entities                  |
| ├── `routes/`                       | API route definitions                              |
| │ └── `index.ts`                    | Main router combining all routes                   |
| │ └── `user.routes.ts`              | Routes for user-related endpoints                  |
| │ └── `training.routes.ts`          | Routes for training-related endpoints              |
| │ └── `upload.routes.ts`            | Routes for                                         |
| │ └── `sport.routes.ts`             | Routes for sport-related endpoints                 |
| ├── `types/`                        | Global TypeScript type definitions                 |
| │ └── `env.d.ts`                    | Type definitions for environment variables         |
| │ └── `express.d.ts`                | Extended Express types for TypeScript              |
| ├── `utils/`                        | Utility and helper functions                       |
| │ └── `handleError.ts`              | General error handling utility                     |
| │ └── `handleMongooseError.ts`      | Utility for handling MongoDB-specific errors       |
| │ └── `handleSequalizeError.ts`     | Utility for handling Sequelize-specific errors     |
| │ └── `validationObjectId.ts`       | Utility for validating MongoDB ObjectIDs           |
| └── `appServer.ts`                  | Main server initialization logic                   |
| `uploads/`                          | Uploads directory                                  |
| `.eslintrc.json`                    | ESLint configuration                               |
| `.prettierrc`                       | Prettier configuration                             |
| `.gitignore`                        | Git ignore file                                    |
| `package.json`                      | Node.js dependencies file                          |
| `README.md`                         | Project documentation                              |
| `jest.config.ts`                    | Jest configuration file for testing setup          |
| `nodemon.json`                      | Nodemon configuration file for automatic restarts  |

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

### **Upload**

| Method | Endpoint      | Description   |
| ------ | ------------- | ------------- |
| POST   | `/api/upload` | Upload images |

## Models

### User

| Field                | Type         | Required | Unique | Description                                                                   |
| -------------------- | ------------ | -------- | ------ | ----------------------------------------------------------------------------- |
| `_id`                | `String`     | Yes      | Yes    | User's id.                                                                    |
| `username`           | `String`     | No       | No     | User's display name.                                                          |
| `first_name`         | `String`     | No       | No     | User's first name.                                                            |
| `last_name`          | `String`     | No       | No     | User's last name.                                                             |
| `email`              | `String`     | Yes      | Yes    | User's email address (used for authentication and communication).             |
| `sports`             | `[ObjectId]` | Yes      | No     | Array of references to the `Sport` collection, representing user preferences. |
| `image_url`          | `String`     | No       | No     | URL to the user's profile picture.                                            |
| `latitude`           | `Number`     | No       | No     | Geographical latitude of the user's location.                                 |
| `longitude`          | `Number`     | No       | No     | Geographical longitude of the user's location.                                |
| `completed_trainings`| `Number`     | Yes      | No     | Number of trainings the user has completed.                                   |
| `social_number`      | `String`     | Yes      | No     | User's social number.                                                         |
| `athlete_bio`        | `String`     | No       | No     | User's biography or description.                                              |
| `training_created`   | `[ObjectId]` | No       | No     | Array of references to `Training` documents the user has created.             |
| `training_join`      | `[ObjectId]` | No       | No     | Array of references to `Training` documents the user has joined.              |
| `createdAt`          | `Date`       | Auto     | No     | Timestamp when the user document was created.                                 |
| `updatedAt`          | `Date`       | Auto     | No     | Timestamp when the user document was last updated.                            |

### Training Model

The `Training` model represents training events created by users in the system.

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

### Sport Model

The `Sport` model represents various sports that can be associated with users or training events in the system.

| **Field** | **Type** | **Required** | **Description**                        |
| --------- | -------- | ------------ | -------------------------------------- |
| `_id`     | `String` | Yes          | The name of the sport. Must be unique. |
| `name`    | `String` | Yes          | The name of the sport. Must be unique. |

---

[//]: # "4. **Create new MySQL Database**:"
[//]: # "   1. Open new terminal and run `mysql -u root -p` to log in to MySQL."
[//]: # "   2. Create a new database by running the following command:"
[//]: # "      ```sql"
[//]: # "      CREATE DATABASE db_name;"
[//]: # "      ```"
[//]: # "   3. Verify that the database was created by running:"
[//]: # "      ```sql"
[//]: # "      SHOW DATABASES;"
[//]: # "      ```"
[//]: # "   4. Create a new user and grant privileges to the database:"
[//]: # "      ```sql"
[//]: # "      CREATE USER 'db_username'@'localhost' IDENTIFIED BY 'db_password';"
[//]: # "      GRANT ALL PRIVILEGES ON db_name.* TO 'db_username'@'localhost';"
[//]: # "      FLUSH PRIVILEGES;"
[//]: # "      ```"
[//]: # "   5. Use the database by running:"
[//]: # "      ```sql"
[//]: # "      USE db_name;"
[//]: # "      ```"
