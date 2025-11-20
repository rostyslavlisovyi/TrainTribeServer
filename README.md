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

| Directory / File                  | Description                                       |
| --------------------------------- | ------------------------------------------------- |
| `instrument.js`                   | Preloads Sentry (dotenv, integrations, sampling)  |
| `src/`                            | Main code directory                               |
| ├── `config/`                     | Configuration files (e.g., database, environment) |
| ├── `controllers/`                | Controllers for handling requests                 |
| │ └── `base.controller.ts`        | Base controller with common functionality         |
| │ └── `city.controller.ts`        | Logic for handling city-related API requests      |
| │ └── `review.controller.ts`      | Logic for handling review-related API requests    |
| │ └── `training.controller.ts`    | Logic for handling training-related API requests  |
| │ └── `upload.controller.ts`      | Logic for handling file uploads                   |
| │ └── `user.controller.ts`        | Logic for handling user-related API requests      |
| ├── `errors/`                     | Error handling classes and utilities              |
| │ └── `baseError.ts`              | Base error class for custom error handling        |
| │ └── `clientErrors.ts`           | Client-side error definitions                     |
| │ └── `mongoErrors.ts`            | MongoDB-specific error handling                   |
| │ └── `networkErrors.ts`          | Network-related error definitions                 |
| │ └── `serverError.ts`            | Server-side error definitions                     |
| ├── `interfaces/`                 | TypeScript interfaces for strict type definitions |
| │ └── `city.interface.ts`         | Interface for city entities                       |
| │ └── `comment.interface.ts`      | Interface for comment entities                    |
| │ └── `participants.interface.ts` | Interface for participant attendance entities     |
| │ └── `review.interface.ts`       | Interface for review entities                     |
| │ └── `timeSlot.interface.ts`     | Interface for time slot entities                  |
| │ └── `training.interface.ts`     | Interface for training entities                   |
| │ └── `user.interface.ts`         | Interface for user entities                       |
| ├── `middlewares/`                | Middleware functions                              |
| │ └── `auth.middleware.ts`        | Middleware for handling user authentication       |
| │ └── `upload.middleware.ts`      | Middleware for handling file uploads              |
| │ └── `validation.middleware.ts`  | Middleware for request validation                 |
| ├── `mock/`                       | Mock data for testing and development             |
| ├── `models/`                     | Database structure definitions (Models)           |
| │ └── `MongoDB/`                  | MongoDB models for application                    |
| │ │ └── `city.model.ts`           | MongoDB model for city entities                   |
| │ │ └── `comment.model.ts`        | MongoDB model for comment entities                |
| │ │ └── `review.model.ts`         | MongoDB model for review entities                 |
| │ │ └── `training.model.ts`       | MongoDB model for training entities               |
| │ │ └── `user.model.ts`           | MongoDB model for user entities                   |
| ├── `routes/`                     | API route definitions                             |
| │ └── `city.routes.ts`            | Routes for city-related endpoints                 |
| │ └── `index.ts`                  | Main router combining all routes                  |
| │ └── `review.routes.ts`          | Routes for review-related endpoints               |
| │ └── `user.routes.ts`            | Routes for user-related endpoints                 |
| │ └── `training.routes.ts`        | Routes for training-related endpoints             |
| │ └── `upload.route.ts`           | Routes for file upload endpoints                  |
| ├── `services/`                   | Business logic layer                              |
| │ └── `base.service.ts`           | Base service with common functionality            |
| │ └── `city.service.ts`           | Service for city-related operations               |
| │ └── `review.service.ts`         | Service for review-related operations             |
| │ └── `training.service.ts`       | Service for training-related operations           |
| │ └── `user.service.ts`           | Service for user-related operations               |
| ├── `types/`                      | Global TypeScript type definitions                |
| ├── `utils/`                      | Utility and helper functions                      |
| │ └── `sentry.ts`                 | Shared helpers for Sentry Express middleware      |
| ├── `validators/`                 | Request validation schemas                        |
| │ └── `user.validator.ts`         | Validation schemas for user-related requests      |
| `dist/`                           | Compiled JavaScript output directory              |
| `public/`                         | Static files directory                            |
| `uploads/`                        | Uploads directory for storing user files          |
| `.eslintrc.json`                  | ESLint configuration                              |
| `eslint.config.js`                | ESLint configuration                              |
| `.gitignore`                      | Git ignore file                                   |
| `package.json`                    | Node.js dependencies file                         |
| `README.md`                       | Project documentation                             |
| `jest.config.ts`                  | Jest configuration file for testing setup         |
| `nodemon.json`                    | Nodemon configuration file for automatic restarts |
| `tsconfig.json`                   | TypeScript configuration                          |
| `vercel.json`                     | Vercel deployment configuration                   |

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
  - **Participants**: Receive 1 point when a training they were part of is marked as `completed`, regardless of their attendance status.

- **Review Points** (`reviewPoints` field in `User` model):
  - **Training Creators**: Receive points equal to the star rating value (1-5) whenever another user leaves a review about them.
  - Points are automatically added when a review is created and adjusted when reviews are updated or deleted.

### 3. Review System

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
