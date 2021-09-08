var fs = require('fs');
import { Sequelize } from 'sequelize-typescript';
var env = process.env.NODE_ENV || 'development';
var config = require('../../config.json')[env];
var db: any = {};

/*
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  var sequelize = new Sequelize({
    database: config.database,
    username: config.username,
    password: config.password,
    models: [__dirname + '/models'],
  });
}
*/

const sequelize = new Sequelize({
  database: config.database,
  dialect: config.dialect,
  username: config.username,
  password: config.password,
  models: [__dirname + '/models'],
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
