import express from 'express';

const userRouter = require('express').Router();
import bcrypt from 'bcrypt';
import User from '../db/models/models/users.model';
import DoneEvents from '../db/models/models/doneEvent.model';
import {
  User as UserType,
  DoneEvents as DoneEventType,
  EventStatus,
  userRole,
} from '../types';
import { userExtractor } from '../utils.ts/middleware';

userRouter.get('/', userExtractor, async (req, res) => {
  const authUser = req.user;
  if (authUser.role !== userRole.ADMIN) {
    return res
      .status(401)
      .json({ error: 'You are not authorized for this page' });
  }
  const users = await User.findAll({ include: [DoneEvents] });
  res.json(users);
});

userRouter.get('/:userID', userExtractor, async (req, res) => {
  const authUser = req.user;
  const userID: number = Number(req.params.userID);
  if (authUser.id !== userID && authUser.role !== userRole.ADMIN) {

    return res
      .status(401)
      .json({ error: 'You are not authorized for this page' });
  }
  const users = await User.findByPk(userID, { include: [DoneEvents] });
  res.json(users);
});

userRouter.post('/', async (req, res) => {
  const body = req.body;
  if (!body.password) {
    return res.status(400).json('No password was provided').end();
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const userToAdd: Omit<UserType, 'id'> = {
    role: body.role,
    email: body.email.toLowerCase(),
    password: passwordHash,
    firstName: body.firstName,
    lastName: body.lastName,
    fieldOfStudy: body.fieldOfStudy,
    events: [],
    capWithTF: body.capWithTF,
  };
  const user /*: UserType*/ = await User.create(userToAdd);
  res.status(201).json(user);
});

userRouter.put('/:userID', userExtractor, async (req, res) => {
  const authUser = req.user;
  const body = req.body;
  const userID = req.params.userID;
  if (authUser.id !== userID || authUser.role !== userRole.ADMIN) {
    return res
      .status(401)
      .json({ error: 'You are not authorized for this page' });
  }
  const user = await User.findByPk(userID);
  if (!user) {
    return res.status(404).json({ error: 'No user found with that ID' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const updatedUser: UserType = {
    id: user.id,
    role: body.role,
    email: body.email,
    password: passwordHash,
    firstName: body.firstName,
    lastName: body.lastName,
    fieldOfStudy: body.fieldOfStudy,
    events: body.events,
    capWithTF: body.capWithTF,
  };
  user.update(updatedUser);
  return res.status(200).json(updatedUser);
});

userRouter.delete('/:userID', userExtractor, async (req, res) => {
  const authUser = req.user;
  const user = await User.findByPk(req.params.userID);
  if (authUser.role !== userRole.ADMIN) {
    return res
      .status(401)
      .json({ error: 'You are not authorized for this page' });
  }
  user.$remove;
  return res.status(204);
});

userRouter.get('/:userID/done_events/', userExtractor, async (req, res) => {
  const authUser = req.user;
  const userID = req.params.userid;
  if (authUser.id !== userID || authUser.role !== userRole.ADMIN) {
    return res
      .status(401)
      .json({ error: 'You are not authorized for this page' });
  }
  const done_events = await DoneEvents.findAll({ where: { userID } });
  res.status(200).json(done_events);
});

userRouter.post(
  '/:userid/done_events/:eventid',
  userExtractor,
  async (req, res) => {
    const authUser = req.user as User;
    const userID = Number(req.params.userid);
    const eventID = Number(req.params.eventid);
    if (authUser.id !== userID && authUser.role !== userRole.ADMIN) {
      return res
        .status(401)
        .json({ error: 'You are not authorized for this page' });
    }
    const doneEvent: Omit<DoneEventType, 'id'> = {
      status: EventStatus.PENDING,
      timeOfSignup: new Date(),
      timeOfCompletion: null,
      userID,
      eventID,
    };
    const addedDoneEvent = await DoneEvents.create(doneEvent);
    res.status(200).json(addedDoneEvent);
  },
);

userRouter.put(
  '/:userID/done_events/:eventID',
  userExtractor,
  async (req, res) => {
    const authUser = req.user as User;
    const newStatus = req.body.status;
    const userID: number = Number(req.params.userID);
    const eventID: number = Number(req.params.eventID);
    const event = await DoneEvents.findOne({ where: { userID, eventID } });

    if (!event) {
      res.status(404).send({ error: "Couldn't find the event for this user" });
    }

    switch (newStatus) {
      case EventStatus.CANCELLED: {
        if (authUser.role !== userRole.ADMIN && authUser.id !== userID) {
          console.log(
            'User does not have permission to updated the event of this user to cancelled',
          );
          return res
            .status(401)
            .send({ error: "You don't have permission to do that" });
        } else {
          event.update({ status: newStatus });
          break;
        }
      }
      case EventStatus.CONFIRMED: {
        if (authUser.role !== userRole.ADMIN) {
          console.log(
            'User does not have permission to updated the event of this user to confirmed',
          );
          return res
            .status(401)
            .send({ error: "You don't have permission to do that" });
        } else {
          event.update({ status: newStatus });
          break;
        }
      }
      case EventStatus.COMPLETED: {
        if (authUser.role !== userRole.ADMIN) {
          console.log(
            'User does not have permission to updated the event of this user to completed',
          );
          return res
            .status(401)
            .send({ error: "You don't have permission to do that" });
        } else {
          event.update({ status: newStatus, timeOfCompletion: new Date() });
          break;
        }
      }
      default:
        return res.status(400).send({ error: 'No such status available' });
    }
    return res.status(200).json(event);
  },
);

export default userRouter;
