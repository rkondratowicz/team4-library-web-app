import express, { type Request, type Response } from 'express';

const app = express();
const port: number = 3000;

app.get('/', (req: Request, res: Response): void => {
  res.send('Changed hi');
});

app.listen(port, (): void => {
  console.log(`Example app listening on https://localhost:${port}`);
});