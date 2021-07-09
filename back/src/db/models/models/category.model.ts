'use strict';
import { Optional } from 'sequelize/types';
import { Category as CategoryType } from 'types';
import { Table, Column, Model, CreatedAt, HasMany } from 'sequelize-typescript';
import Event from './event.model'


interface CategoryTypeCreation extends Optional<CategoryType, 'id'> {}

@Table({
  timestamps: true,
})
class Category extends Model<CategoryType, CategoryTypeCreation> {
  @CreatedAt
  creationDate: Date;

  @Column({ unique: true, allowNull: false })
  name: string;

  @Column
  description: string;

  @Column({ allowNull: true })
  minPoints: number;

  @HasMany(() => Event)
  events: Event[]
}

export default Category;