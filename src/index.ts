import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3000;
const DB_FILE = 'db.json';

app.use(bodyParser.json());

function initializeDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const initialDb = { submissions: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb));
  }
}

app.use((req, res, next) => {
  initializeDatabase();
  next();
});

app.get('/ping', (req: Request, res: Response) => {
  res.json(true);
});

app.post('/submit', (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;
  const newSubmission = { id: uuidv4(), name, email, phone, github_link, stopwatch_time };

  let db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  db.submissions.push(newSubmission);
  fs.writeFileSync(DB_FILE, JSON.stringify(db));

  res.status(201).json(newSubmission);
});

app.get('/read', (req: Request, res: Response) => {
  let db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  res.json(db.submissions);
});

app.delete('/delete/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  let db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  
  const newSubmissions = db.submissions.filter((submission: any) => submission.id !== id);

  if (newSubmissions.length === db.submissions.length) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  db.submissions = newSubmissions;
  fs.writeFileSync(DB_FILE, JSON.stringify(db));
  res.status(200).json({ message: 'Submission deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
