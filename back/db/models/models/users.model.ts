'use strict';
import { Table, Column, Model, CreatedAt } from 'sequelize-typescript';

@Table({
  timestamps: true,
})
class User extends Model {
  @CreatedAt
  creationDate: Date;

  @Column
  first_name: string;

  @Column
  last_name: string;
}

export default User;
