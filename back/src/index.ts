import express from 'express';
import bodyParser from 'body-parser';
// rest of the code remains same
import cors from 'cors';
import { connectDb } from './connection';
require('dotenv').config();
const app: express.Application = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/auth', async (req, res) => {
  console.log(req);
  const username = req.body.username;
  const password = req.body.password;
});

app.get('/', async (req, res) => {
  res.send({
    status: true,
    message: 'Stuff happened',
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  connectDb()
    .then(() => {
      console.log('MongoDb connected');
    })
    .catch(error => {
      console.log('error connection to MongoDB:', error.message);
    });
});
