import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = 3000;
const DB_FILE = 'db.json';

app.use(bodyParser.json());

function initializeDatabase() {
  console.log("Initializing database...");
  if (!fs.existsSync(DB_FILE)) {
    console.log(`Creating new database file: ${DB_FILE}`);
    const initialDb = { submissions: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb));
    console.log("Database initialized.");
  } else {
    console.log(`Database file already exists at: ${DB_FILE}`);
  }
}

app.use((req, res, next) => {
  initializeDatabase();
  next();
});

app.get('/ping', (req: Request, res: Response) => {
  console.log("Ping request received.");
  res.json(true);
});

app.post('/submit', (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;
  const newSubmission = { name, email, phone, github_link, stopwatch_time };

  let db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  db.submissions.push(newSubmission);
  fs.writeFileSync(DB_FILE, JSON.stringify(db));

  console.log(`New submission added: ${JSON.stringify(newSubmission)}`);
  res.status(201).json(newSubmission);
});

app.get('/read', (req: Request, res: Response) => {
  console.log("Fetching submissions...");
  let db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));

  res.json(db.submissions);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
