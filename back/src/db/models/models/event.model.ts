'use strict';
import { Optional } from 'sequelize';
import { Table, Column, Model, CreatedAt, ForeignKey, BelongsTo, HasMany, DefaultScope } from 'sequelize-typescript';
import { Event as EventType } from 'types';
import Category from './category.model';
import DoneEvent from './doneEvent.model';

interface EventTypeCreation extends Optional<EventType, 'id'> {}


@DefaultScope(() => ({
  attributes: ['id', 'name', 'description', 'startTime', 'endTime', 'points','userLimit', 'mandatory', 'categoryId']
}))

@Table({
  timestamps: true,
})
class Event extends Model<EventType, EventTypeCreation> {
  @CreatedAt
  creationDate: Date;

  @Column({ allowNull: false})
  name: string;

  @Column
  description: string;

  @Column({ allowNull: false})
  startTime: Date

  @Column({ allowNull: false})
  endTime: Date

  @Column
  points: number | null

  @Column
  userLimit: number | null

  @Column({ allowNull: false})
  mandatory: boolean

  @ForeignKey(()=> Category)
  @Column({ allowNull: false})
  categoryId: number

  @BelongsTo(() => Category)
  category: Category

  @HasMany(() => DoneEvent)
  events: DoneEvent[]
}

export default Event;
