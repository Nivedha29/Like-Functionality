## RealWorld Blog App

A full-featured blog platform built with React, React Router v6, and React Hook Form, following the RealWorld API specification
.
This app supports authentication, article creation, profiles, and Markdown rendering — all connected to a live backend.

## Live Deployment

Live Demo: https://like-functionality-five.vercel.app/


## Tech Stack

⚛️ React (v18+)

🧭 React Router v6

📝 React Hook Form for validation

🔐 JWT-based authentication

💾 Context API for global state management

🧰 Axios for API communication

🖋️ Markdown Rendering using react-markdown

## Dependencies

| Package              | Version | Description                                                |
| -------------------- | ------- | ---------------------------------------------------------- |
| **react**            | ^18.x   | Core React library                                         |
| **react-dom**        | ^18.x   | React DOM renderer                                         |
| **react-router-dom** | ^6.x    | Routing and navigation                                     |
| **react-hook-form**  | ^7.x    | Form management and validation                             |
| **axios**            | ^1.x    | HTTP client for API communication                          |
| **react-markdown**   | ^9.x    | Render Markdown content as HTML                            |
| **classnames**       | ^2.x    | Utility for conditionally joining class names              |
| **jwt-decode**       | ^4.x    | Decode JWT tokens for authentication                       |
| **date-fns**         | ^3.x    | Formatting and manipulating dates (for article timestamps) |
| **prop-types**       | ^15.x   | Runtime type checking for React props                      |
| **dotenv**           | ^16.x   | Environment variable management (for .env setup)           |



# Set environment variables

Create a .env file in the project root:

REACT_APP_API_URL=https://realworld.habsida.net/api


# Build for production

To create an optimized production build:

npm run build
or
yarn build


# Example Credentials

You can register a new user and login with Email and Password

# Routes Overview
Route	Description
/	Global article feed
/sign-in	Login page
/sign-up	Registration page
/profile	User profile & settings
/article/:slug	View a single article
/editor	Create a new article
/editor/:slug	Edit an existing article

# Scripts
Command	Description
npm start	run - Dev server
npm run build	- Build for production
npm run lint - Run ESLint checks
npm run format - Format with Prettier
