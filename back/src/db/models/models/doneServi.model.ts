'use strict';
import { Optional } from 'sequelize';
import {
  Table,
  Column,
  Model,
  CreatedAt,
  ForeignKey,
  DefaultScope,
} from 'sequelize-typescript';
import { DoneServi as DoneServiType, EventStatus } from '../../../types';
import Servi from './servi.model';
import User from './users.model';

interface DoneServiTypeCreation extends Optional<DoneServiType, 'id'> {}

@DefaultScope(() => ({
  attributes: [
    'id',
    'userID',
    'serviID',
    'status',
    'timeOfSignup',
    'timeOfCompletion',
  ],
}))
@Table({
  timestamps: true,
})
class DoneServi extends Model<DoneServiTypeCreation> {
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

  @ForeignKey(() => Servi)
  @Column
  serviID: number;
}

export default DoneServi;
