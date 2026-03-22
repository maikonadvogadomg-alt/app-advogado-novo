# Live Code Runner

A web application that allows users to write and execute JavaScript code in real-time, with the ability to save and retrieve code snippets from a PostgreSQL database.

## Features

- Real-time JavaScript code execution
- Code snippet saving and retrieval
- Clean, responsive user interface
- PostgreSQL database integration

## Technologies Used

- React (Frontend)
- Express.js (Backend)
- PostgreSQL (Database)
- Node.js (Runtime Environment)

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v10 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd live-code-runner
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your database connection

4. Set up the PostgreSQL database:
   - Create a new PostgreSQL database
   - Run the database initialization script:
     ```
     npm run init-db
     ```
   This will create the necessary tables and insert sample data.

5. Build the React application:
   ```
   npm run build
   ```

6. Start the application:
   ```
   npm start
   ```

### Alternative Setup (Automated)

You can also run the automated setup script which will perform steps 2-5 for you:

```
npm run setup-dev
```

After running this script, you can start the application with:

```
npm start
```
├── package.json        # Project dependencies and scripts
└── README.md           # This file
```

## API Endpoints

- `POST /api/run-code` - Execute JavaScript code
- `POST /api/save-code` - Save a code snippet to the database
- `GET /api/code-snippets` - Retrieve all saved code snippets

## Security Measures

The application implements several security measures to prevent malicious code execution:

- Code validation to prevent use of Node.js modules
- Code length limitations
- Execution timeout (5 seconds)
- Temporary file cleanup

## Development

For development, you can run the client and server separately:

- Client: `npm run start:client`
- Server: `npm run start:server`

## Testing

You can test the application endpoints with the test script:

```
npm run test-app
```