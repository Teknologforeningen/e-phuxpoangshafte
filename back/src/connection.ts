import mongoose from 'mongoose';
const connection = 'mongodb://localhost:27017/testdb';
export const connectDb = () => {
  return mongoose.connect(connection);
};
