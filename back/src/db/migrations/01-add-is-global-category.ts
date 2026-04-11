import { DataTypes } from 'sequelize';
import type { Migration } from '../migrate';

export const up: Migration = async ({ context: queryInterface }) => {
  const tableDescription = await queryInterface.describeTable('Categories');
  if (!tableDescription['isGlobalCategory']) {
    await queryInterface.addColumn('Categories', 'isGlobalCategory', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  }
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('Categories', 'isGlobalCategory');
};
