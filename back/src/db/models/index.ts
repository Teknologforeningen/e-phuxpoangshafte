import { Sequelize } from 'sequelize-typescript';
const db: any = {};

const commonConfig = {
  dialect: 'postgres' as const,
  models: [__dirname + '/models'],
  retry: {
    max: 10,
    match: [
      /ECONNRESET/i,
      /ECONNREFUSED/i,
      /ETIMEDOUT/i,
      /SequelizeConnectionError/i,
    ],
  },
};

const sequelize = new Sequelize(
  process.env.NODE_ENV !== 'production'
    ? {
        ...commonConfig,
        database: process.env.DEV_DB,
        username: process.env.DEV_USERNAME,
        password: process.env.DEV_PASSWORD,
        host: process.env.DEV_HOST,
      }
    : {
        ...commonConfig,
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
      },
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
