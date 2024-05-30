import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
const authRouter = require('express').Router()
import User from '../db/models/models/users.model'
import DoneEvents from '../db/models/models/doneEvent.model'

authRouter.post('/', async (req,res) => {
  const body = req.body
  const email = req.body.email.toLowerCase()
  const user = await User.scope('full').findOne({where: { email }, include: [DoneEvents] })
  const passwordCorrect: boolean | undefined = user === null ? false : await bcrypt.compare(body.password, user.password)

  if(!(user && passwordCorrect)){
    return res
      .status(401)
      .json({
        error: 'Invalid username or password'
      })
  }

  const userFields = user.get()
  delete userFields.password;

  const userForToken = {
    email: userFields.email,
    id: userFields.id
  }
  const token = jwt.sign(userForToken, process.env.SECRET)

  res
    .status(200)
    .send({ token, ...userFields})
})

export default authRouter