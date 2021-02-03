const { Sequelize } = require('sequelize');

const { DB_URI } = process.env;
if (!DB_URI) {
  throw new Error('Missing Database URI env variable');
}

const db = new Sequelize(DB_URI, {
  pool: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000
  },
  logging: false,
});

module.exports = db;