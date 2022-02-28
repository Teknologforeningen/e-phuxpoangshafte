'use strict';
import { Optional } from 'sequelize';
import {
  Table,
  Column,
  Model,
  CreatedAt,
  HasMany,
  DefaultScope,
} from 'sequelize-typescript';
import { Servi as ServiType } from 'types';
import DoneServi from './DoneServi.model';

interface ServiTypeCreation extends Optional<ServiType, 'id'> {}

@DefaultScope(() => ({
  attributes: [
    'id',
    'name',
    'description',
    'startTime',
    'endTime',
    'points',
    'userLimit',
  ],
}))
@Table({
  timestamps: true,
})
class Servi extends Model<ServiType, ServiTypeCreation> {
  @CreatedAt
  creationDate: Date;

  @Column({ allowNull: false })
  name: string;

  @Column
  description: string;

  @Column({ allowNull: false })
  startTime: Date;

  @Column({ allowNull: false })
  endTime: Date;

  @Column
  points: number;

  @Column
  userLimit: number | null;

  @HasMany(() => DoneServi)
  servis: DoneServi[];
}

export default Servi;
