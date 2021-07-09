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
  /*  id: number
  type: EventStatus
  timeOfsignup: Date
  timeOfComplition: Date
  EventID: number
  UserID: number*/
  @CreatedAt
  creationDate: Date;

  @Column
  type: EventStatus;

  @Column
  timeOfsignup: Date;

  @Column
  timeOfCompletion: Date

  @ForeignKey(() => User)
  user: User

  @ForeignKey(()=> Event)
  event: Event
}

export default DoneEvents;
