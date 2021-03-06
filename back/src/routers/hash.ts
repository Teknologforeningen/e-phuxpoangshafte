import express, { Request, Response } from 'express';

const hashRouter = require('express').Router();
import cors from 'cors';
import hashGenerator from '../utils.ts/hashGenerator';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//credits to https://github.com/Hajoppi for the implementation of this and hashGenerator

const generateKey = (eventId: string) => {
  return hashGenerator(eventId);
};

const validateKey = (eventId: string, hash: string) => {
  const eventHash = hashGenerator(eventId);
  const encodedHash = encodeURIComponent(eventHash);
  const hashFromURL = encodeURIComponent(hash);
  const valid = hashFromURL === encodedHash;
  return valid;
};

hashRouter.get('/generate/:eventId', (req: Request, res: Response) => {
  const { eventId } = req.params;
  const key = generateKey(eventId);
  const encodedKey = encodeURIComponent(key);
  return res.send({ hash: `${eventId}-${encodedKey}` });
});

hashRouter.get('/validate/:hash', (req: Request, res: Response) => {
  const { hash } = req.params;
  const [eventId, key] = hash.split('-');
  const keyIsValid = validateKey(eventId, key);
  return res.send({ eventId, valid: keyIsValid });
});

export default hashRouter;
