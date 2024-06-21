# Slidely Windows App Backend Server

This project is a backend server built with Express.js and TypeScript. It manages form submissions, stores them in a JSON file, and provides API endpoints for CRUD operations.

## Setup

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/anwarmusthafa/slidely-form-backend.git
   cd slidely-form-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```
  **Install TypeScript Globally (if not already installed)**

  ```bash
   npm install -g typescript
   ```


### Running the Server

Start the server:

```bash
npx ts-node src/index.ts
```

The server will run at `http://localhost:3000`.

## API Endpoints

#### GET /ping : Always return true.
#### POST /submit : Create a new form submission.
#### GET /read : Read a submission by index.
#### PUT /update/:id : Update a submission by ID.
#### DELETE /delete/:id : Delete a submission by ID.
#### GET /search : Search submissions by email.





## Project Structure

- `src/index.ts`: Entry point of the server.
- `db.json`: JSON file for storing submissions(make sure db.json is available in the root folder).
