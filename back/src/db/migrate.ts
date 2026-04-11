import path from 'path';
import { Umzug, SequelizeStorage } from 'umzug';
var models = require('./models');

const sequelize = models.sequelize;

export const umzug = new Umzug({
  migrations: {
    glob: ['migrations/*.{js,ts}', { cwd: __dirname }],
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export type Migration = typeof umzug._types.migration;
