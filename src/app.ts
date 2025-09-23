import express from 'express';

const app = express();
const port: number = 3000;

app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hot reloading with tsx is working!');
});

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});