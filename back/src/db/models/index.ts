import { Sequelize } from 'sequelize-typescript';
var db: any = {};

const sequelize = new Sequelize(
  process.env.NODE_ENV !== 'production'
    ? {
        database: 'phuxdb',
        dialect: 'postgres',
        username: 'ephuxpoang',
        password: 'ephuxpoang',
        host: 'localhost',
        models: [__dirname + '/models'],
      }
    : {
        database: process.env.DB_NAME,
        dialect: 'postgres',
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        models: [__dirname + '/models'],
      },
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
