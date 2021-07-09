import express from 'express';

const userRouter = require('express').Router()
import User from '../db/models/models/users.model';

import { User as UserType } from '../types'


userRouter.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users)
})

userRouter.post('/', async (req, res) => {
  const body = req.body
  const userToAdd: Omit<UserType, 'id' > = {
    role: body.role,
    username: body.username,
    password: body.password,
    firstName: body.firstName,
    lastName: body.lastName,
    fieldOfStudy: body.fieldOfStudy,
    events: [],
    capWithTF: body.capWithTF
  }
  const user/*: UserType*/ = await User.create(userToAdd)
  res.json(user)
})

export default userRouter