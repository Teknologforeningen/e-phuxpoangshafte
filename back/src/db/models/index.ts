import { Sequelize } from 'sequelize-typescript';
var db: any = {};

/*
Kommentera in dehä då man devar
var config = require('../../config.json')[env];
  const sequelize = new Sequelize({
    database: config.database,
    dialect: config.dialect,
    username: config.username,
    password: config.password,
    models: [__dirname + '/models'],
  });
*/

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: 'postgres',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  models: [__dirname + '/models'],
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
