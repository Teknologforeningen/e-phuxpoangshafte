import Category from 'db/models/models/category.model';
import express from 'express';

const eventRouter = require('express').Router()
import Event from '../db/models/models/event.model';

import { Event as EventType } from '../types'


eventRouter.get('/', async (req, res) => {
  const events = await Event.findAll();
  res.json(events)
})

eventRouter.post('/', async (req, res) => {
  const body = req.body
  const eventToAdd: Omit<EventType, 'id'> = {
    name: body.name,
    description: body.description,
    startTime: body.startTime,
    endTime: body.endTime,
    points: body.points,
    userLimit: body.userLimit,
    categoryId: body.categoryId,
    mandatory: body.mandatory,
  }
  const event: Event = await Event.create(eventToAdd);
  res.json(event)
})

export default eventRouter