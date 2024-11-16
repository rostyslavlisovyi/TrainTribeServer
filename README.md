# TrainTribeServer

## Description
is a server-side REST API designed to handle requests from the client side, managing users and training events. The application is built on `Node.js` using the `Express` framework and a `MySQL` database.

## Functionality
- Handles requests from the client side to facilitate communication between users and training events.
- Manages a MySQL database to store data about users and events.
- CRUD operations for users: creating, editing, and deleting user accounts.
- CRUD operations for training events: creating, editing, sorting, and deleting training sessions.

## Architecture 
The application is built on the `MVC` architecture pattern, where the `Model` represents the data, the `View` represents the user interface, and the `Controller` manages the communication between the `Model` and the `View`.

## Project Structure

| Directory / File          | Description                                       |
|---------------------------|---------------------------------------------------|
| `src/`                    | Main code directory                               |
| ├── `config/`             | Configuration files (e.g., database, environment) |
| │    └── `database.ts`    | Database connection configuration                 |
| │    └── `env.d.ts`       | Environment variables                             |
| ├── `controllers/`        | Controllers for handling requests                 |
| │   └──                   |                                                   |
| ├── `models/`             | Database structure definitions (Models)           |
| │   └── `user.ts`         | User model                                        |
| │   └── `training.ts`     | Training model                                    |
| ├── `routes/`             | API route definitions                             |
| │   └── `auth.routes.ts`  | Routes for auth-related endpoints                 |
| │   └── `user.routes.ts`  | Routes for user-related endpoints                 |
| │   └── `training.routes.ts` | Routes for training-related endpoints             |
| ├── `services/`           | Business logic not tied to HTTP requests          |
| │   └── `userService.ts`  | Service for user business logic                   |
| ├── `middlewares/`        | Middleware functions for request handling         |
| │   └── `authMiddleware.ts` | Middleware for user authentication                |
| ├── `utils/`              | Utility and helper functions                      |
| │   └── `passwordUtils.ts` | Function for password hashing                     |
| │   └── `handleError.ts`  | Function for password hashing                     |
| ├── `interfaces/`         | TypeScript interfaces                             |
| │   └── `userInterface.ts` | User interface                                    |
| ├── `app.ts`              | Main application file (server initialization)     |
| └── `server.ts`           | File to start the server                          |
| `.eslintrc.json`          | ESLint configuration                              |
| `.prettierrc`             | Prettier configuration                            |
| `.gitignore`              | Git ignore file                                   |
| `package.json`            | Node.js dependencies file                         |
| `README.md`               | Project documentation                             |
## Technologies

- **Node.js**
- **Express**
- **MySQL**
- **Sequelize**
- **Bcrypt**
- **JWT**
- **Dotenv**
- **Nodemon**
- **Cors**


