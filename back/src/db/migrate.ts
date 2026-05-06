import { Umzug, SequelizeStorage } from 'umzug';
import models = require('./models');
import logger from '../utils.ts/logger';

const sequelize = models.sequelize;

export const umzug = new Umzug({
  migrations: {
    glob: ['migrations/*.{js,ts}', { cwd: __dirname }],
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger,
});

export type Migration = typeof umzug._types.migration;
