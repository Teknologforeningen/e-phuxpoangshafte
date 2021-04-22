import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
});
const User = mongoose.model('User', userSchema);
module.exports = User;
