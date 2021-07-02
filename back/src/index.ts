import express from 'express';
import bodyParser from 'body-parser';
// rest of the code remains same
import cors from 'cors';
require('dotenv').config();
const app: express.Application = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/auth', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
});

app.get('/', async (req, res) => {
  res.send({
    status: true,
    message: 'Stuff happened',
  });
});

app.listen(process.env.API_PORT, () => {
  console.log(`API listening on port ${process.env.API_PORT}`);
});
