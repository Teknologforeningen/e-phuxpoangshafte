import express from 'express';

const userRouter = require('express').Router()
import bcrypt from 'bcrypt';
import User from '../db/models/models/users.model';
import DoneEvents from '../db/models/models/done_event.model';
import { User as UserType, DoneEvents as DoneEventType, EventStatus } from '../types'
import { userExtractor } from '../utils.ts/middleware';


userRouter.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users)
})


userRouter.post('/', async (req, res) => {
  const body = req.body
  if(!body.password){
    return res.status(400).json("No password was provided").end()
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const userToAdd: Omit<UserType, 'id' > = {
    role: body.role,
    email: body.email,
    password: passwordHash,
    firstName: body.firstName,
    lastName: body.lastName,
    fieldOfStudy: body.fieldOfStudy,
    events: [],
    capWithTF: body.capWithTF
  }
  const user/*: UserType*/ = await User.create(userToAdd)
  res.status(201).json(user)
})

userRouter.put('/:userID',userExtractor, async (req, res) => {
  const authUser = req.user
  const body = req.body
  const userID = req.params.userID
  if(authUser.id !== userID ||authUser.role !== "admin"){
    return res.status(401).json({error: 'You are not authorized for this page'})
  }
  const user = await User.findByPk(userID)
  if(!user){
    return res.status(404).json({error: 'No user found with that ID'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)
  
  const updatedUser: UserType= {
    id: user.id,
    role: body.role,
    email: body.email,
    password: passwordHash,
    firstName: body.firstName,
    lastName: body.lastName,
    fieldOfStudy: body.fieldOfStudy,
    events: body.events,
    capWithTF: body.capWithTF
  }
  user.update(updatedUser)
  return res.status(200).json(updatedUser)
})

userRouter.delete('/:userID', userExtractor, async (req, res) => {
  const authUser = req.user
  const user = await User.findByPk(req.params.userID)
  if(authUser.role !== "admin"){
    return res.status(401).json({error: 'You are not authorized for this page'})
  }
  user.$remove
  return res.status(204)
})

userRouter.get('/:userID/done_events/', userExtractor, async (req, res) => {
  const authUser = req.user
  const userID = req.params.userid
  if(authUser.id !== userID ||authUser.role !== "admin"){
    return res.status(401).json({error: 'You are not authorized for this page'})
  }
  const done_events = await DoneEvents.findAll({where : {userID}});
  res.status(200).json(done_events)
})

userRouter.post('/:userid/done_events/:eventid', async (req, res) => {
  const doneEvent: Omit<DoneEventType, 'id'> = {
    status: EventStatus.Pending,
    timeOfSignup: new Date(),
    timeOfCompletion: null,
    userID: req.params.userid,
    eventID: req.params.eventid
  }
  const addedDoneEvent = await DoneEvents.create(doneEvent)
  res.status(200).json(addedDoneEvent)
})

userRouter.put('/:userid/done_events/:eventid', userExtractor, async (req, res) => {
  const authUser = req.user
  const newStatus = req.body.status
  const userID = req.params.userid
  const eventID =  req.params.eventid
  const event = await DoneEvents.findOne( { where: {userID, eventID }})

  if(!event){
    res.status(404).send({error: "Couldn't find the event for this user"})
  }
  switch (newStatus) {
    case "cancelled":
      event.update({ status: newStatus })
      break;
    case "confirmed":
      if(authUser.role !== "admin"){
        return res.status(401).send({error: "You don't have permission to do that"})
      }else{
        event.update({ status: newStatus })
      }
    case "completed":
      if(authUser.role !== "admin"){
        return res.status(401).send({error: "You don't have permission to do that"})
      }else{
        event.update({ status: newStatus, timeOfCompletion: new Date() })
      }
    default:
      break;
  }
  return res.status(200).json(event)
})



export default userRouter