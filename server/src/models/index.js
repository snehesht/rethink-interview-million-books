const db = require('./db');
const Books = require('./books');
const logger = require('../lib/logger');

const initDatabase = async () => {
  try {
    await db.sync();
  } catch(error) {
    logger.error(`Failed to initialize database, ${error.message}`);
    throw error;
  }
}

module.exports = {
  db,
  initDatabase,
  Books,
};