import mongoose from 'mongoose';
require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;
export const connectDb = () => {
  console.log('connecting to', MONGODB_URI);
  return mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};
