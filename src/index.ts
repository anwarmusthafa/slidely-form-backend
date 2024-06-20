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

app.use((req: Request, res: Response, next: () => void) => {
  initializeDatabase();
  next();
});


function validateSubmission(req: Request, res: Response, next: () => void) {
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  if (!name || !email || !phone || !github_link || !stopwatch_time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
}

app.post('/submit', validateSubmission, (req: Request, res: Response) => {
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

app.put('/update/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, email, phone, github_link, stopwatch_time } = req.body;

  let db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  const index = db.submissions.findIndex((submission: any) => submission.id === id);

  if (index !== -1) {
    db.submissions[index].name = name;
    db.submissions[index].email = email;
    db.submissions[index].phone = phone;
    db.submissions[index].github_link = github_link;
    db.submissions[index].stopwatch_time = stopwatch_time;

    fs.writeFileSync(DB_FILE, JSON.stringify(db));
    res.status(200).json({ message: 'Submission updated successfully' });
  } else {
    res.status(404).json({ error: 'Submission not found' });
  }
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
