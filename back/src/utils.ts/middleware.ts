import jwt from 'jsonwebtoken'
import User from '../db/models/models/users.model'

export const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  req.token = (authorization && authorization.toLowerCase().startsWith('bearer '))
    ? authorization.substring(7)
    : null
  next()
}

export const userExtractor = async (req, res, next) => {
  const token = req.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if(!token || !decodedToken.id){
    req.user = null
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  req.user = await User.findByPk(decodedToken.id)
  next()
}