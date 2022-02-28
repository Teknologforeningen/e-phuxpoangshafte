import express from 'express';

const serviRouter = require('express').Router();
import Servi from '../db/models/models/servi.model';
import { userExtractor } from '../utils.ts/middleware';
import { Servi as ServiType, userRole } from '../types';

serviRouter.get('/', async (req, res) => {
  const servis = await Servi.findAll();
  res.json(servis);
});

serviRouter.post('/', userExtractor, async (req, res) => {
  const authUser = req.user;
  if (authUser.role !== userRole.ADMIN) {
    return res
      .status(401)
      .json({ error: 'You are not authorized for this page' });
  }
  const body = req.body;
  const serviToAdd: Omit<ServiType, 'id'> = {
    name: body.name,
    description: body.description,
    startTime: body.startTime,
    endTime: body.endTime,
    points: body.points,
    userLimit: body.userLimit,
  };
  const servi: Servi = await Servi.create(serviToAdd);
  res.json(servi);
});

serviRouter.put('/:id', userExtractor, async (req, res) => {
  const authUser = req.user;
  if (authUser.role !== userRole.ADMIN) {
    return res
      .status(401)
      .json({ error: 'You are not authorized for this page' });
  }
  const serviId = req.params.id;
  const body = req.body;
  const serviToUpdate = await Servi.findByPk(serviId);
  serviToUpdate.name = body.name;
  serviToUpdate.description = body.description;
  serviToUpdate.startTime = body.startTime;
  serviToUpdate.endTime = body.endTime;
  serviToUpdate.points = body.points;
  serviToUpdate.userLimit = body.userLimit;
  const updatedServi = await serviToUpdate.save();
  res.json(updatedServi);
});

export default serviRouter;
