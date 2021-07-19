'use strict';
import { Optional } from 'sequelize';
import { Table, Column, Model, CreatedAt, HasMany,DefaultScope,Scopes } from 'sequelize-typescript';
import { User as UserType, userRole } from '../../../types';

import DoneEvent from './done_event.model'

interface UserTypeCreation extends Optional<UserType, 'id'> {}

@DefaultScope(() => ({
  attributes: ['id', 'email', 'role', 'fieldOfStudy', 'capWithTF', 'firstName', 'lastName']
}))

@Scopes(() => ({
  full: {
    attributes: ['password','id', 'email', 'role', 'fieldOfStudy', 'capWithTF', 'firstName', 'lastName']
  }
}))

@Table({
  timestamps: true,
})
class User extends Model<UserTypeCreation> {
  @CreatedAt
  creationDate: Date;

  @Column({ unique: true, allowNull: false})
  email: string;

  @Column({ allowNull: false})
  password: string

  @Column({ allowNull: false})
  role: userRole

  @Column({ allowNull: false})
  fieldOfStudy: string

  @Column({ allowNull: false})
  capWithTF: boolean

  @Column({ allowNull: false})
  firstName: string;

  @Column({ allowNull: false})
  lastName: string;

  @HasMany(() => DoneEvent)
  events: DoneEvent[]
}

export default User;
