import { DataTypes } from 'sequelize';
import type { Migration } from '../migrate';

export const up: Migration = async ({ context: queryInterface }) => {
  const tables = await queryInterface.showAllTables();
  if (!tables.includes('SiteSettings')) {
    await queryInterface.createTable('SiteSettings', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      totalMinPoints: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 300,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  }
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('SiteSettings');
};
