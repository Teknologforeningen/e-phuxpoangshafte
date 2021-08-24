import express from 'express';

const eventRouter = require('express').Router();
import Event from '../db/models/models/event.model';
import { userExtractor } from '../utils.ts/middleware';
import { Event as EventType, userRole } from '../types';

eventRouter.get('/', async (req, res) => {
  const events = await Event.findAll();
  res.json(events);
});

eventRouter.post('/', userExtractor, async (req, res) => {
  const authUser = req.user;
  if (authUser.role !== userRole.ADMIN) {
    return res
      .status(401)
      .json({ error: 'You are not authorized for this page' });
  }
  const body = req.body;
  const eventToAdd: Omit<EventType, 'id'> = {
    name: body.name,
    description: body.description,
    startTime: body.startTime,
    endTime: body.endTime,
    points: body.points,
    userLimit: body.userLimit,
    categoryId: body.categoryId,
    mandatory: body.mandatory,
  };
  const event: Event = await Event.create(eventToAdd);
  res.json(event);
});

export default eventRouter;
