'use strict';
import { Optional } from 'sequelize';
import {
  Table,
  Column,
  Model,
  CreatedAt,
  BelongsToMany,
  BelongsTo,
  ForeignKey,
  DefaultScope,
} from 'sequelize-typescript';
import { DoneEvents as DoneEventsType, EventStatus } from '../../../types';
import Event from './event.model';
import User from './users.model';

interface DoneEventsTypeCreation extends Optional<DoneEventsType, 'id'> {}

@DefaultScope(() => ({
  attributes: [
    'id',
    'userID',
    'eventID',
    'status',
    'timeOfSignup',
    'timeOfCompletion',
  ],
}))
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
  timeOfCompletion: Date | null;

  @ForeignKey(() => User)
  @Column
  userID: number;

  @ForeignKey(() => Event)
  @Column
  eventID: number;

  //@BelongsTo(() => User)
  //user: User;

  //@BelongsTo(() => Event)
  //event: Event;
}

export default DoneEvents;
