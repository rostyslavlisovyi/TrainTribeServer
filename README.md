# TrainTribeServer

## Description

is a server-side REST API designed to handle requests from the client side, managing users and training events. The application is built on `Node.js` using the `Express` framework and a `MySQL` database.

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
   
   
   JWT_SECRET=secret_key
   JWT_EXPIRES_IN=12h
   
    MONGO_DB_URI='your mongo db uri'
   ```
   
4. **Run the Server**:
   ```bash
   npm run build
   npm start
   ```

## Architecture

The application is built on the `MVC` architecture pattern, where the `Model` represents the data, the `View` represents the user interface, and the `Controller` manages the communication between the `Model` and the `View`.

## Project Structure

| Directory / File                    | Description                                        |
|-------------------------------------|----------------------------------------------------|
| `src/`                              | Main code directory                                |
| ├── `config/`                       | Configuration files (e.g., database, environment)  |
| │ └── `database.ts`                 | Database connection configuration                  |
| │ └── `sequelize.ts`                | Connect to MySql DB                                |
| │ └── `syncMock.ts`                 | Connect do MongoDB and sync collections with Mock  |
| ├── `interfaces/`                   | Controllers for handling requests                  |
| │ └── `sport.interfaces.ts`         | Define TypeScript interfaces for sport entities    |
| │ └── `training.interfaces.ts`      | Define TypeScript interfaces for training entities |
| │ └── `user.interfaces.ts`          | Define TypeScript interfaces for user entities     |
| ├── `middleware/`                   | Middleware functions                               |
| │ └── `auth.middleware.ts`          | Middleware for handling user authentication        |
| ├── `mock/`                         | Mock data for development and testing              |
| │ └── `sportsMock.mock.ts`          | Mock data for sports-related entities              |
| ├── `models/`                       | Database structure definitions (Models)            |
| │ └── `MongoDB/`                    | MongoDB models for application                     |
| │ │  └── `sport.model.mongoDB.ts`   | MongoDB model for sports entities                  |
| │ │  └── `training.model.mongoDB.ts`| MongoDB model for training entities                |
| │ │  └── `user.model.mongoDB.ts`    | MongoDB model for user entities                    |
| │ └── `mySql/`                      | MySQL models for application                       |
| │    └── `user.model.mySql.ts`      | MySQL model for user entities                      |
| │    └── `training.ts`              | MySQL model for training entities                  |
| ├── `routes/`                       | API route definitions                              |
| │ └── `index.ts`                    | Main router combining all routes                   |
| │ └── `auth.routes.ts`              | Routes for authentication-related endpoints        |
| │ └── `user.routes.ts`              | Routes for user-related endpoints                  |
| │ └── `training.routes.ts`          | Routes for training-related endpoints              |
| │ └── `sport.routes.ts`             | Routes for sport-related endpoints                 |
| ├── `types/`                        | Global TypeScript type definitions                 |
| │ └── `env.d.ts`                    | Type definitions for environment variables         |
| │ └── `express.d.ts`                | Extended Express types for TypeScript              |
| ├── `utils/`                        | Utility and helper functions                       |
| │ └── `jwt.utils.ts`                | Utility functions for working with JWT tokens      |
| │ └── `password.utils.ts`           | Function for password hashing and verification     |
| └── `appServer.ts`                  | Main server initialization logic                   |
| `.eslintrc.json`                    | ESLint configuration                               |
| `.prettierrc`                       | Prettier configuration                             |
| `.gitignore`                        | Git ignore file                                    |
| `package.json`                      | Node.js dependencies file                          |
| `README.md`                         | Project documentation                              |

## Technologies

- **Node.js**
- **Express**
- **Mongoose**
- **Bcrypt**
- **JWT**
- **Dotenv**
- **nanoid**

## API Endpoints

The server provides the following API endpoints:

### **Authentication**
| Method | Endpoint           | Description                  |
|--------|--------------------|------------------------------|
| POST   | `/api/auth/signUp` | Register a new user          |
| POST   | `/api/auth/signIn` | Log in as an existing user   |

### **User**
| Method | Endpoint    | Description                                  |
|--------|-------------|----------------------------------------------|
| GET    | `/api/user` | Fetch user data                              |
| PUT    | `/api/user` | Update user by Token (ID extracted from JWT) |
| DELETE | `/api/user` | Delete user by Token (ID extracted from JWT) |





[//]: # (4. **Create new MySQL Database**:)

[//]: # (   1. Open new terminal and run `mysql -u root -p` to log in to MySQL.)

[//]: # (   2. Create a new database by running the following command:)

[//]: # (      ```sql)

[//]: # (      CREATE DATABASE db_name;)

[//]: # (      ```)

[//]: # (   3. Verify that the database was created by running:)

[//]: # (      ```sql)

[//]: # (      SHOW DATABASES;)

[//]: # (      ```)

[//]: # (   4. Create a new user and grant privileges to the database:)

[//]: # (      ```sql)

[//]: # (      CREATE USER 'db_username'@'localhost' IDENTIFIED BY 'db_password';)

[//]: # (      GRANT ALL PRIVILEGES ON db_name.* TO 'db_username'@'localhost';)

[//]: # (      FLUSH PRIVILEGES;)

[//]: # (      ```)

[//]: # (   5. Use the database by running:)

[//]: # (      ```sql)

[//]: # (      USE db_name;)

[//]: # (      ```)
