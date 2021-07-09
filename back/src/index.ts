import express from 'express';
import cors from 'cors';
require('dotenv').config();
var models = require('./db/models');

import userRouter from './routers/user'
import categoryRouter from './routers/category'
import eventRouter from './routers/event';

const app: express.Application = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/users', userRouter)
app.use('/categories', categoryRouter)
app.use('/events', eventRouter)

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
  app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });
});
