import express from 'express';
import cors from 'cors';
require('dotenv').config();
const path = require('path');

import userRouter from './routers/user';
import categoryRouter from './routers/category';
import eventRouter from './routers/event';
import authRouter from './routers/auth';
import hashRouter from './routers/hash';
import { tokenExtractor } from './utils.ts/middleware';

const app: express.Application = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(tokenExtractor);

app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/events', eventRouter);
app.use('/api/auth', authRouter);
app.use('/api/hash', hashRouter);

app.use(express.static(path.resolve(__dirname, '../../front/build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../front/build', 'index.html'));
});

export default app;
