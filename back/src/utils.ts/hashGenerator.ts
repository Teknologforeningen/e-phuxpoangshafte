import crypto from 'crypto';

const secret = process.env.SECRET || 'very-secret';

type Options = {
  time?: number;
  timeStep?: number;
  timeOffset?: number;
  algorithm?: string;
};

const padZeroes = (value: string, digits = 16) => {
  var fill = '0'.repeat(digits);
  return (fill + value).slice(-digits);
};

const hasGeneratorWithTime = (key: string, options: Options) => {
  const currentTime = options.time || Date.now() / 1000;
  const timeStep = options.timeStep || 30;
  const timeOffset = options.timeOffset || 0;
  const algorithm = options.algorithm || 'sha1';
  const counter = Math.floor((currentTime - timeOffset) / timeStep);
  const buffer = Buffer.from(padZeroes(counter.toString(16)), 'hex');
  const hmac = crypto
    .createHmac('sha1', key + secret)
    .update(buffer)
    .digest();
  return hmac.toString('base64');
};

const hashGenerator = (key: string) => {
  const hmac = crypto.createHmac('sha1', key + secret).digest();
  return hmac.toString('base64');
};

export default hashGenerator;
