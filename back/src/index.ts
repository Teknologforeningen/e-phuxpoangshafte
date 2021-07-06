import express from 'express';
import cors from 'cors';
require('dotenv').config();
var models = require('../db/models');
import User from '../db/models/models/users.model';

const app: express.Application = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

const PORT = process.env.API_PORT || 8000;
models.sequelize.sync().then(() => {
  const user = new User({ first_name: 'John', last_name: 'Doe' });
  user.save();
  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
});
