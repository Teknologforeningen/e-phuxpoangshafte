'use strict';
import { Table, Column, Model, DefaultScope } from 'sequelize-typescript';
import { SiteSettings as SiteSettingsType } from 'types';

@DefaultScope(() => ({
  attributes: ['id', 'totalMinPoints'],
}))
@Table({
  timestamps: true,
})
class SiteSettings extends Model<SiteSettingsType> {
  @Column({ allowNull: false, defaultValue: 300 })
  totalMinPoints!: number;
}

export default SiteSettings;
