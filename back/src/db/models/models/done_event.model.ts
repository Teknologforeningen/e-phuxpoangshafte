'use strict';
import { Optional } from 'sequelize';
import { Table, Column, Model, CreatedAt, BelongsToMany, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { DoneEvents as DoneEventsType, EventStatus } from '../../../types';
import Event from './event.model';
import User from './users.model';

interface DoneEventsTypeCreation extends Optional<DoneEventsType, 'id'> {}

@Table({
  timestamps: true,
})
class DoneEvents extends Model<DoneEventsTypeCreation> {
  @CreatedAt
  creationDate: Date;

  @Column
  status: EventStatus;

  @Column
  timeOfSignup: Date;

  @Column
  timeOfCompletion: Date | null

  @ForeignKey(() => User)
  userID: User

  @ForeignKey(() => Event)
  eventID: Event
}

export default DoneEvents;
