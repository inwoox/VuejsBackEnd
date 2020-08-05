const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development'
const config = require('../config/config.json')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Usertable = require('./usertable')(sequelize, Sequelize);
db.Content = require('./content')(sequelize, Sequelize);

module.exports = db;