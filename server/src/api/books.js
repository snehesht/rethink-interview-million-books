const { Router } = require('express');
const logger = require('../lib/logger');
const { Books } = require('../models');

const booksRouter = Router();

booksRouter.get('/', async (req, res) => {
  try {
    const query = req.query.query || '';
    const limit = req.query.limit || 25;
    const offset = req.query.offset || 0;
    const books = await Books.search(query, limit, offset)
    logger.info(`Querying Books with query '${query}' got ${books.length} results`)
    return res.send(books)
  } catch (error) {
    logger.error(`Failed to search books, ${error.message}`);
    return res.status(400).send({ error: 'Failed to search for books' })
  }
})

module.exports = booksRouter;