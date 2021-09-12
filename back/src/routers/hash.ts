import express, { Request, Response } from 'express';

const hashRouter = require('express').Router();
import cors from 'cors';
import hashGenerator from '../utils.ts/hashGenerator';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//credits to https://github.com/Hajoppi for the implementation of this and hashGenerator

const TIME_STEP = 1000;

const generateKey = (eventId: string) => {
  return hashGenerator(eventId, { timeStep: TIME_STEP });
};

const validateKey = (eventId: string, hash: string) => {
  const hashNow = hashGenerator(eventId, { timeStep: TIME_STEP });
  const hashOld = hashGenerator(eventId, {
    timeStep: TIME_STEP,
    timeOffset: TIME_STEP,
  });
  const valid = hash === hashNow || hash === hashOld;
  return valid;
};

hashRouter.get('/generate/:eventId', (req: Request, res: Response) => {
  const { eventId } = req.params;
  const key = generateKey(eventId);
  return res.send({ hash: `${eventId}-${key}` });
});

hashRouter.get('/validate/:hash', (req: Request, res: Response) => {
  const { hash } = req.params;
  const [eventId, key] = hash.split('-');
  const keyIsValid = validateKey(eventId, key);
  return res.send({ eventId, valid: keyIsValid });
});

export default hashRouter;
