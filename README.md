# TrainTribeServer

## Description

TrainTribeServer is a server-side REST API designed to handle requests from the client side, managing users and training events. The application is built on `Node.js` using the `Express` framework and supports both `MongoDB` and `MySQL` databases.

This project includes **Swagger** documentation, which provides an interactive user interface for exploring and testing API endpoints. It simplifies understanding and debugging the API for developers and external teams.

## Functionality

- Handles requests from the client side to facilitate communication between users and training events.
- Manages a MongoDB database to store data about users, events, and reviews.
- CRUD operations for users: creating, editing, and deleting user accounts.
- CRUD operations for training events: creating, editing, sorting, and deleting training sessions.
- **Review system**: Users can leave reviews for completed trainings with ratings and comments.
- **Points system**: Users earn points for organizing trainings and receiving positive reviews.
- **Leaderboard system**: A monthly leaderboard is available, ranking users by their points.

## Installation and Setup Instructions

### Prerequisites

- **Node.js** `>=18`
- **npm** `>=9`

### Quick Start for Developers

1. **Clone & install**

   ```bash
   git clone https://github.com/rokokos97/TrainTribeServer.git
   cd TrainTribeServer
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` (or create `.env`) and fill in the values listed below. At minimum provide MongoDB credentials, the Firebase service account, your Sentry DSN, and `CRON_SECRET`.

3. **Run local server**

   ```bash
   npm run dev         # ts-node with auto-reload
   npm run typecheck   # TypeScript static analysis
   npm run lint        # ESLint + Prettier
   npm run test        # Jest (exits 0 even with no tests)
   ```

   For production builds run `npm run build && npm run start` (tsup outputs to `dist/`).

4. **Swagger**

   Once the backend is running open `http://localhost:<SERVER_PORT>/api-docs` to inspect the documented API.

### Environment Variables

| Variable | Description |
| --- | --- |
| `SERVER_PORT` | HTTP port (defaults to `666`). |
| `NODE_ENV` | `development` / `staging` / `production`. Used by Sentry. |
| `APP_URL` | Comma-separated list of allowed CORS origins (also used as referer for geocoding). |
| `DB_NAME`, `MONGODB_URI`, `DB_TYPE` | MongoDB configuration. |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Firebase Admin service account. The private key string must keep `\n` escaped. |
| `CRON_SECRET` | Token used to authenticate cron/initialization requests (`Authorization: Bearer <CRON_SECRET>`). |
| `CLOUDINARY_BASE_FOLDER_UPLOAD` | Folder used by the Cloudinary upload service. |
| `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_TRACES_SAMPLE_RATE`, `SENTRY_PROFILES_SAMPLE_RATE` | Sentry configuration and sampling rates. |
| `FETCH_CITY_ON_STARTUP` | If `true`, the server triggers the city initialization during startup. |

> All variables are required both locally and in production. Prefer secret managers/CI variables for sensitive values.

### Initial Data & Cron Jobs

- **City seed** – to populate the city catalog call `GET /cron-job/city-inizialize` (or the internal `/api/city/inizialize`) with header `Authorization: Bearer <CRON_SECRET>`. The job downloads ISTAT data, enriches with Wikidata coordinates, and syncs MongoDB.
- **Notifications cron** – `GET /cron-job/notification` (also protected via `CRON_SECRET`) generates notification events.
- **Auto seed via env** – when `FETCH_CITY_ON_STARTUP=true`, the seed runs automatically on server start. For production schedule a cron job/Cloud Scheduler that calls `/cron-job/*` with the secret.

### Error Handling Guidelines

- Always throw domain-specific errors from `src/errors` (e.g., `NotFoundError`, `BadRequestError`, `ForbiddenError`).
- Avoid `throw new Error()` directly; controllers rely on `handleError` to map custom errors to proper HTTP codes.
- Unexpected 5xx errors are automatically logged to Sentry by `handleError`, together with request metadata.

## Architecture

The application is built on the `MVC` architecture pattern, where the `Model` represents the data, the `View` represents the user interface, and the `Controller` manages the communication between the `Model` and the `View`.

## Project Structure

| Directory / File                     | Description                                         |
| ------------------------------------ | --------------------------------------------------- |
| `instrument.js`                      | Preloads Sentry (dotenv, integrations, sampling)    |
| `src/`                               | Main code directory                                 |
| ├── `config/`                        | Configuration files (e.g., database, environment)   |
| │ ├── `app.config.ts`                | Centralized application configuration               |
| │ ├── `firebase.ts`                  | Firebase client setup                               |
| │ └── `firebaseAdmin.ts`             | Initializes Firebase Admin SDK for auth             |
| ├── `controllers/`                   | Controllers for handling requests                   |
| │ └── `base.controller.ts`           | Base controller with common functionality           |
| │ └── `city.controller.ts`           | Logic for handling city-related API requests        |
| │ └── `cronJob.controller.ts`        | Logic for cron job APIs                             |
| │ └── `leaderboard.controller.ts`    | Handlers for leaderboard endpoints                  |
| │ └── `notification.controller.ts`   | Handlers for notification endpoints                 |
| │ └── `review.controller.ts`         | Logic for handling review-related API requests      |
| │ └── `training.controller.ts`       | Logic for handling training-related API requests    |
| │ └── `upload.controller.ts`         | Logic for handling file uploads                     |
| │ └── `user.controller.ts`           | Logic for handling user-related API requests        |
| ├── `errors/`                        | Error handling classes and utilities                |
| ├── `interfaces/`                    | TypeScript interfaces for strict type definitions   |
| │ └── `geoLocation.interface.ts`     | Interface for geolocation data                      |
| │ └── `notification.interface.ts`    | Interface for notification entities                 |
| │ └── `trainingParticipant.interface.ts` | Interface for participant attendance entities |
| │ └── `userLeaderboard.interface.ts` | Interface for leaderboard users                     |
| ├── `middlewares/`                   | Middleware functions                                |
| │ └── `auth.middleware.ts`           | Verifies Firebase tokens                            |
| │ └── `authContainer.middleware.ts`  | Injects scoped container into requests              |
| │ └── `cronJob.middleware.ts`        | Protects cron job endpoints                         |
| │ └── `upload.middleware.ts`         | Middleware for handling file uploads                |
| │ └── `validation.middleware.ts`     | Middleware for request validation                   |
| ├── `models/`                        | Database structure definitions (Models)             |
| │ └── `MongoDB/`                     | MongoDB models for application                      |
| │ │ └── `notification.model.ts`      | MongoDB model for notifications                     |
| │ │ └── `userLeaderboard.model.ts`   | MongoDB model for leaderboard entities              |
| ├── `routes/`                        | API route definitions                               |
| │ └── `city.routes.ts`               | Routes for city-related endpoints                   |
| │ └── `cronJob.routes.ts`            | Routes for cron-job endpoints                       |
| │ └── `leaderboard.routes.ts`        | Routes for leaderboard endpoints                    |
| │ └── `notification.route.ts`        | Routes for notification endpoints                   |
| │ └── `index.ts`                     | Main router combining all routes                    |
| ├── `services/`                      | Business logic layer                                |
| │ └── `cronJob.service.ts`           | Cron job orchestration                              |
| │ └── `leaderboard.service.ts`       | Leaderboard data layer                              |
| │ └── `notification.service.ts`      | Notifications logic                                 |
| ├── `types/`                         | Global TypeScript type definitions                  |
| │ └── `express.d.ts`                 | Express typings (Awilix scope, Firebase auth)       |
| ├── `utils/`                         | Utility and helper functions                        |
| │ └── `sentry.ts`                    | Shared helpers for Sentry Express middleware        |
| ├── `validators/`                    | Request validation schemas                          |
| `public/`                            | Static files directory                              |
| `uploads/`                           | Uploads directory for storing user files            |
| `.eslintrc.json` / `eslint.config.js`| ESLint configuration                                |
| `package.json`                       | Node.js dependencies file                           |
| `README.md`                          | Project documentation                               |
| `tsconfig.json`                      | TypeScript configuration (includes tests directory) |
| `tests/`                             | Jest test suite, mocks, and helpers                  |
| `.github/workflows/ci.yml`           | GitHub Actions pipeline (lint/typecheck/tests)      |

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
| POST   | `/api/city`      | Get all cities   |
| GET    | `/api/city/id`   | Get city by ID   |
| GET    | `/api/city/name` | Get city by name |

### **Upload**

| Method | Endpoint      | Description   |
| ------ | ------------- | ------------- |
| POST   | `/api/upload` | Upload images |

### **Training**

| Method | Endpoint                        | Description                           | Access              |
| ------ | ------------------------------- | ------------------------------------- | ------------------- |
| GET    | `/api/training`                 | Get all trainings                     | All users           |
| GET    | `/api/training/:id`             | Get training by ID                    | All users           |
| POST   | `/api/training`                 | Create new training                   | Authenticated users |
| PUT    | `/api/training/:id`             | Update training by ID                 | Training creator    |
| DELETE | `/api/training/:id`             | Delete training by ID                 | Training creator    |
| POST   | `/api/training/:id/like`        | Add a like to training                | Authenticated users |
| POST   | `/api/training/:id/participant` | Add current user as participant       | Authenticated users |
| DELETE | `/api/training/:id/participant` | Remove current user from participants | Authenticated users |
| POST   | `/api/training/:id/comment`     | Add a comment to training             | Authenticated users |
| PATCH  | `/api/training/:id/status`      | Change training status                | Training creator    |

### **Reviews**

| Method | Endpoint                            | Description                         | Access                |
| ------ | ----------------------------------- | ----------------------------------- | --------------------- |
| POST   | `/api/reviews`                      | Create a new review                 | Training participants |
| GET    | `/api/reviews/user/:userId`         | Get reviews for a specific user     | Authenticated users   |
| GET    | `/api/reviews/reviewer/:userId`     | Get reviews written by a user       | Authenticated users   |
| GET    | `/api/reviews/training/:trainingId` | Get reviews for a specific training | Authenticated users   |
| PUT    | `/api/reviews/:id`                  | Update a review                     | Review author         |
| DELETE | `/api/reviews/:id`                  | Delete a review                     | Review author         |

### **Notifications**

| Method | Endpoint                      | Description                              | Access              |
| ------ | ----------------------------- | ---------------------------------------- | ------------------- |
| POST   | `/api/notification/list`      | Paginated list of notifications          | Authenticated users |
| GET    | `/api/notification/count-unread` | Get unread counter                    | Authenticated users |
| PUT    | `/api/notification/mark-all-as-read` | Mark all as read                   | Authenticated users |
| DELETE | `/api/notification/delete-all` | Remove all notifications for the user | Authenticated users |

### **Cron Jobs / Internal automation**

| Method | Endpoint                        | Description                                         | Access |
| ------ | ------------------------------- | --------------------------------------------------- | ------ |
| GET    | `/cron-job/city-inizialize`     | Runs the ISTAT/Wikidata sync (same as manual seed)   | `CRON_SECRET` |
| GET    | `/cron-job/notification`        | Triggers the notification scheduler                  | `CRON_SECRET` |

> Cron endpoints always require the header `Authorization: Bearer <CRON_SECRET>` and are not intended for public clients.

### **Leaderboard**

| Method | Endpoint                | Description                                       | Access              |
| ------ | ----------------------- | ------------------------------------------------- | ------------------- |
| GET    | `/api/leaderboard/list` | Get the monthly leaderboard, with optional search | Authenticated users |

## Models

### User

| Field                       | Type       | Required | Unique | Description                                                                   |
| --------------------------- | ---------- | -------- | ------ | ----------------------------------------------------------------------------- |
| `_id`                       | `ObjectId` | Yes      | Yes    | User's id.                                                                    |
| `firstName`                 | `String`   | No       | No     | User's first name.                                                            |
| `lastName`                  | `String`   | No       | No     | User's last name.                                                             |
| `email`                     | `String`   | Yes      | Yes    | User's email address (used for authentication and communication).             |
| `sports`                    | `String[]` | Yes      | No     | Array of sports types from SportsEnum (e.g., RUNNING, CYCLING, SWIMMING)      |
| `image`                     | `Object`   | No       | No     | Object to cloudinary upload api picture.                                      |
| `city`                      | `ObjectId` | No       | No     | Reference to the user's city.                                                 |
| `athleteBio`                | `String`   | No       | No     | User's athletic biography and background information.                         |
| `authId`                    | `String`   | Yes      | Yes    | Unique authentication ID from the auth provider.                              |
| `lastOnboardingStep`        | `String`   | No       | No     | Indicates the last completed onboarding step.                                 |
| `hasCompletedOnboarding`    | `Boolean`  | No       | No     | Indicates if user has completed onboarding.                                   |
| `privacySettings`           | `Boolean`  | No       | No     | User's privacy preference. Default is false.                                  |
| `dateOfBirth`               | `Date`     | No       | No     | User's date of birth.                                                         |
| `rangeOfAction`             | `Number`   | No       | No     | Range of action for the user (in kilometers).                                 |
| `trainingGoal`              | `String[]` | No       | No     | Array of training goals from TrainingGoalEnum.                                |
| `trainingLevel`             | `String`   | No       | No     | User's training level from TrainingLevelEnum.                                 |
| `trainingFrequency`         | `String`   | No       | No     | User's training frequency from TrainingFrequencyEnum.                         |
| `trainingPartnerPreference` | `String`   | No       | No     | User's preference for training partners.                                      |
| `countTrainingOrganized`    | `Number`   | No       | No     | The number of trainings organized by the user. Default is 0.                  |
| `countTrainingJoined`       | `Number`   | No       | No     | The number of trainings the user has joined and attended. Default is 0.       |
| `countTrainingMissed`       | `Number`   | No       | No     | The number of trainings the user was registered for but missed. Default is 0. |
| `trainingTimeSlot`          | `Object[]` | No       | No     | Array of preferred training time slots with day and time range.               |
| `language`                  | `String`   | No       | No     | User's preferred language. Default is 'it'.                                   |
| `trainingPoints`            | `Number`   | No       | No     | Points earned for creating (5 pts) or participating (1 pt) in trainings.      |
| `reviewPoints`              | `Number`   | No       | No     | Sum of stars received as a training creator from reviews.                     |
| `averageReviews`            | `Number`   | Auto     | No     | Average of reviews                                                            |
| `createdAt`                 | `Date`     | Auto     | No     | Timestamp when the user document was created.                                 |
| `updatedAt`                 | `Date`     | Auto     | No     | Timestamp when the user document was last updated.                            |

### UserLeaderboard

| Field       | Type       | Required | Description                                     |
| ----------- | ---------- | -------- | ----------------------------------------------- |
| `_id`       | `ObjectId` | Yes      | The auto-generated ID of the leaderboard entry. |
| `userId`    | `ObjectId` | Yes      | Reference to the `User` who earned the points.  |
| `points`    | `Number`   | Yes      | The number of points awarded in this entry.     |
| `createdAt` | `Date`     | Auto     | Timestamp when the points entry was created.    |

### City

| Field        | Type       | Required | Unique | Description                                        |
| ------------ | ---------- | -------- | ------ | -------------------------------------------------- |
| `_id`        | `ObjectId` | Yes      | Yes    | City's id.                                         |
| `id`         | `Number`   | Yes      | No     | City's numeric identifier.                         |
| `name`       | `String`   | No       | No     | Name of the city.                                  |
| `latitude`   | `Number`   | No       | No     | Geographical latitude of the city's location.      |
| `longitude`  | `Number`   | No       | No     | Geographical longitude of the city's location.     |
| `province`   | `String`   | No       | No     | Province or state where the city is located.       |
| `population` | `Number`   | No       | No     | Population of the city.                            |
| `createdAt`  | `Date`     | Auto     | No     | Timestamp when the city document was created.      |
| `updatedAt`  | `Date`     | Auto     | No     | Timestamp when the city document was last updated. |

### Training

| Field             | Type         | Required | Unique | Description                                                                                                                                           |
| ----------------- | ------------ | -------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| `_id`             | `ObjectId`   | Yes      | Yes    | Training's id.                                                                                                                                        |
| `title`           | `String`     | Yes      | No     | The title or name of the training event.                                                                                                              |
| `description`     | `String`     | No       | No     | Additional details about the training event.                                                                                                          |
| `date`            | `Date`       | Yes      | No     | The date and time of the training event.                                                                                                              |
| `latitude`        | `String`     | Yes      | No     | The geographical latitude where the training event will take place.                                                                                   |
| `longitude`       | `String`     | Yes      | No     | The geographical longitude where the training event will take place.                                                                                  |
| `sport`           | `String[]`   | Yes      | No     | Array of sports types from SportsEnum for this training.                                                                                              |
| `creator`         | `ObjectId`   | Yes      | No     | Reference to the `User` collection, identifying the creator of the event.                                                                             |
| `participants`    | `Object[]`   | No       | No     | Array of objects tracking participant attendance. Each object contains `participant` (ObjectId), `attended` (Boolean), and `hasLeftReview` (Boolean). |
| `difficultyLevel` | `String`     | No       | No     | Difficulty level from TrainingLevelEnum.                                                                                                              |
| `duration`        | `Number`     | No       | No     | Duration of the training in minutes.                                                                                                                  |
| `likes`           | `[ObjectId]` | No       | No     | Array of references to the `User` collection for users who liked the event.                                                                           |
| `comments`        | `Object`     | No       | No     | Comments on the training with user reference, text, and timestamp.                                                                                    |     |
| `status`          | `String`     | Yes      | No     | Status of the training: 'scheduled', 'completed', or 'cancelled'.                                                                                     |
| `createdAt`       | `Date`       | Auto     | No     | Timestamp when the training document was created.                                                                                                     |
| `updatedAt`       | `Date`       | Auto     | No     | Timestamp when the training document was last updated.                                                                                                |

### Review

| Field          | Type       | Required | Unique | Description                                                              |
| -------------- | ---------- | -------- | ------ | ------------------------------------------------------------------------ |
| `_id`          | `ObjectId` | Yes      | Yes    | Review's id.                                                             |
| `training`     | `ObjectId` | Yes      | No     | Reference to the `Training` collection, identifying the reviewed event.  |
| `reviewer`     | `ObjectId` | Yes      | No     | Reference to the `User` collection, identifying the reviewer.            |
| `reviewedUser` | `ObjectId` | Yes      | No     | Reference to the `User` collection, identifying who receives the review. |
| `stars`        | `Number`   | Yes      | No     | Star rating (1-5) given by the reviewer.                                 |
| `comment`      | `String`   | Yes      | No     | Text comment provided with the review.                                   |
| `images`       | `Object[]` | No       | No     | Optional array of image objects attached to the review.                  |
| `createdAt`    | `Date`     | Auto     | No     | Timestamp when the review was created.                                   |
| `updatedAt`    | `Date`     | Auto     | No     | Timestamp when the review was last updated.                              |

## Points and Statistics System

The application implements a system to reward users and track their activity:

### 1. User Statistics

The `User` model includes several fields to track training-related statistics:

- `countTrainingOrganized`: Incremented when a user creates a training. Decremented if the training is cancelled or deleted.
- `countTrainingJoined`: Incremented when a user attends a training they were registered for (status `completed` and `attended: true`).
- `countTrainingMissed`: Incremented when a user is registered for a training but does not attend (status `completed` and `attended: false`).

### 2. Points System

- **Training Points** (`trainingPoints` field in `User` model):

  - **Creators**: Receive 5 points when their training is marked as `completed`.
  - **Participants**: Receive 1 point when a training they were part of is marked as `completed`.
  - Each point transaction is logged as a separate entry in the `UserLeaderboard` collection.

- **Review Points** (`reviewPoints` field in `User` model):
  - **Training Creators**: Receive points equal to the star rating value (1-5) whenever another user leaves a review about them.
  - Points are automatically added when a review is created and adjusted when reviews are updated or deleted.
  - Each point transaction (positive or negative) is logged in the `UserLeaderboard` collection.

### 3. Leaderboard System

- A monthly leaderboard is available via the `GET /api/leaderboard/list` endpoint.
- It aggregates all points from the `UserLeaderboard` collection for the current month, groups them by user, and sorts them in descending order.
- The endpoint supports a `search` query parameter to filter users by their first or last name.

### 4. Review System

**Review Creation Requirements:**

- Only participants of **completed** trainings can leave reviews
- Each participant can leave only **one review per training** (enforced by unique compound index)
- Reviews must include a star rating (1-5) and can include text comments and images
- The `hasLeftReview` field in `participants` tracks review status for each participant

**Review Management:**

- Only the review author can update or delete their reviews
- Review points are automatically calculated and added to the reviewed user's account
- Users's `averageRating` is automatically recalculated when reviews are created, updated, or deleted
- All review operations are handled through the dedicated `/api/reviews` endpoints

**Points Distribution:**

- Review points are awarded to the **training creator** (not the reviewer)
- Points equal the star rating value (1-5 stars = 1-5 points)
- Points are automatically adjusted when reviews are updated or removed
