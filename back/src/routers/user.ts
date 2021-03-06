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
import { Op } from 'sequelize';

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
  if (!(authUser.id !== userID || authUser.role !== userRole.ADMIN)) {
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

  const updatedUser: Omit<UserType, 'role' | 'id' | 'events'> = {
    email: body.email,
    password: passwordHash,
    firstName: body.firstName,
    lastName: body.lastName,
    fieldOfStudy: body.fieldOfStudy,
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
  const userId = req.params.userid;
  if (!(authUser.id !== userId || authUser.role !== userRole.ADMIN)) {
    return res
      .status(401)
      .json({ error: 'You are not authorized for this page' });
  }
  const done_events = await DoneEvents.findAll({ where: { userID: userId } });
  res.status(200).json(done_events);
});

userRouter.post(
  '/:userid/done_events/:eventid',
  userExtractor,
  async (req, res) => {
    const authUser = req.user as User;
    const userId = Number(req.params.userid);
    const eventId = Number(req.params.eventid);
    if (!(authUser.id !== userId || authUser.role !== userRole.ADMIN)) {
      return res
        .status(401)
        .json({ error: 'You are not authorized for this page' });
    }
    const allDoneEvents = await DoneEvents.findAll({
      where: { status: { [Op.not]: String(EventStatus.CANCELLED) } },
    });
    if (allDoneEvents) {
      const completed = allDoneEvents
        .filter(doneEvent => doneEvent.userID === userId)
        .map(doneEvent => doneEvent.eventID)
        .includes(eventId);
      if (completed) {
        return res.status(400).json({
          error: 'You have already requested or completed that event',
        });
      }
    }
    const doneEvent: Omit<DoneEventType, 'id'> = {
      status: EventStatus.PENDING,
      timeOfSignup: new Date(),
      timeOfCompletion: null,
      userID: userId,
      eventID: eventId,
    };
    console.log(doneEvent);
    const addedDoneEvent = await DoneEvents.create(doneEvent);
    res.status(200).json(addedDoneEvent);
  },
);

userRouter.put(
  '/:userID/done_events/:eventID',
  userExtractor,
  async (req, res) => {
    const authUser = req.user as User;
    const newStatus = req.body.status as EventStatus;
    const userId: number = Number(req.params.userID);
    const eventId: number = Number(req.params.eventID);
    const event = await DoneEvents.findOne({
      where: { userID: userId, eventID: eventId },
    });

    console.log('UserID:', userId);
    console.log('EventID:', eventId);
    if (!event) {
      res.status(404).send({ error: "Couldn't find the event for this user" });
    }

    switch (newStatus) {
      case EventStatus.CANCELLED: {
        if (!(authUser.id !== userId || authUser.role !== userRole.ADMIN)) {
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
        if (!(authUser.id !== userId || authUser.role !== userRole.ADMIN)) {
          //TODO: currently possible to complete points for yourself
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

userRouter.delete(
  '/done_events/duplicates',
  userExtractor,
  async (req, res) => {
    console.log('Running removal of duplicates');
    const authUser = req.user;
    if (authUser.role !== userRole.ADMIN) {
      return res
        .status(401)
        .json({ error: 'You are not authorized for this page' });
    }
    let doneEvents = await DoneEvents.findAll({
      where: { status: { [Op.not]: String(EventStatus.CANCELLED) } },
    });
    let ids_to_remove = <number[]>[];
    for (const currentEvent of doneEvents) {
      const doneEventClone = doneEvents.filter(
        doneEvent => !ids_to_remove.includes(doneEvent.id),
      );
      let duplicates = doneEventClone.filter(
        doneEvent =>
          doneEvent.eventID === currentEvent.eventID &&
          doneEvent.userID === currentEvent.userID,
      );
      const eventCompleted = duplicates.find(
        doneEvent => doneEvent.status === EventStatus.COMPLETED,
      );
      if (duplicates.length > 0) {
        if (eventCompleted) {
          duplicates = duplicates.filter(
            doneEvent => doneEvent.id !== eventCompleted.id,
          );
        } else {
          duplicates.shift();
        }
        duplicates.forEach(duplicate => ids_to_remove.push(duplicate.id));
      }
    }
    if (ids_to_remove.length > 0) {
      ids_to_remove.forEach(async (id: number) => {
        const doneEventToDelete = await DoneEvents.findByPk(id);
        const deleted = await doneEventToDelete.destroy();
        Promise.resolve(deleted);
      });
      // Unclear if this row does anything or if the for loop is generated at init and this only slows it down
      doneEvents = doneEvents.filter(
        doneEvent => !ids_to_remove.includes(doneEvent.id),
      );
    }
    return res
      .status(200)
      .json({ removedAmount: ids_to_remove.length, removed: ids_to_remove });
  },
);

export default userRouter;
