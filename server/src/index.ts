import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const apiPort = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(apiPort, () => {
  console.info(`Server running on port ${apiPort}`);
});
