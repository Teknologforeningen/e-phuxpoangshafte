import jwt from 'jsonwebtoken';
import User from '../db/models/models/users.model';

export const tokenExtractor = (req, _res, next) => {
  const authorization = req.get('authorization');
  req.token =
    authorization && authorization.toLowerCase().startsWith('bearer ')
      ? authorization.substring(7)
      : null;
  next();
};

export const userExtractor = async (req, res, next) => {
  const token = req.token;
  if (!token) {
    req.user = null;
    return res.status(401).json({ error: 'Token missing' });
  }
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!decodedToken.id) {
    req.user = null;
    return res.status(401).json({ error: 'Token invalid' });
  }
  req.user = await User.findByPk(decodedToken.id);
  next();
};
