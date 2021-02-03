const db = require('./db');
const { Books, initBooksFullTextSearch } = require('./books');
const logger = require('../lib/logger');

const initDatabase = async () => {
  try {
    await db.sync();
    await initBooksFullTextSearch();
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