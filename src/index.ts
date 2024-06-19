import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get('/ping', (req: Request, res: Response) => {
  res.json(true);
});

app.post('/submit', (req: Request, res: Response) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;
  const newSubmission = { name, email, phone, github_link, stopwatch_time };

  let db = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
  db.submissions.push(newSubmission);
  fs.writeFileSync('db.json', JSON.stringify(db));

  res.status(201).json(newSubmission);
});

app.get('/read', (req: Request, res: Response) => {
  const index = parseInt(req.query.index as string, 10);
  let db = JSON.parse(fs.readFileSync('db.json', 'utf-8'));

  if (index >= 0 && index < db.submissions.length) {
    res.json(db.submissions[index]);
  } else {
    res.status(404).json({ error: 'Submission not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
