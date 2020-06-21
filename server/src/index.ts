import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

// routes
import userRoutes, { userBaseUrl } from 'src/routes/userRoutes';

// this should be a config value
const apiPort = 3000;

// setup the application
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// add the routes
app.use(userBaseUrl, userRoutes);

// these are for debugging
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(apiPort, () => {
  console.info(`Server running on port ${apiPort}`);
});
