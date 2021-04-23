import mongoose from 'mongoose';
require('dotenv').config();
export const connectDb = () => {
  console.log('connecting to', 'mongodb://mongo:27017');
  return mongoose.connect('mongodb://mongo:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};
