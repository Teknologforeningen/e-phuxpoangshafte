import express from 'express';
import { EventStatus } from 'types';

const doneEventRouter = require('express').Router()
import DoneEvent from '../db/models/models/doneEvent.model';
import { userExtractor } from '../utils.ts/middleware';

doneEventRouter.put('/:userID/:eventID',userExtractor, async (req, res) => {
  const userID: number = req.params.userID
  const eventID: number = req.params.eventID
  const status: EventStatus = req.body.status

  const foundEvent = await DoneEvent.findOne({where: {userID, eventID}})
  if(foundEvent === null){
    return res.status(400)
  }
  const updatedDoneEvent = {
    ...foundEvent,
    status
  }

  foundEvent.update(updatedUser)

  res.status(200).json(updatedDoneEvent)
}


export default doneEventRouter