import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const authRouter = require('express').Router()
import User from '../db/models/models/users.model'

authRouter.post('/', async (req,res) => {
  const body = req.body

  const user = await User.findOne({where: { email: body.email }})
  const passwordCorrect: string | undefined = user === null ? false : await bcrypt.compare(body.password, user.password)

  if(!(user && passwordCorrect)){
    return res.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const userForToken = {
    email: user.email,
    id: user.id
  }
  const token = jwt.sign(userForToken, process.env.SECRET)

  res
    .status(200)
    .send({ token, userMail: user.email, id: user.id })
})

export default authRouter