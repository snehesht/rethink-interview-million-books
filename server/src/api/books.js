const { Router } = require('express');
const logger = require('../lib/logger');
const { Books } = require('../models');

const booksRouter = Router();

booksRouter.get('/', async (req, res) => {
  try {
    console.log(req.query)
    const query = req.query.query || '';
    const limit = parseInt(req.query.limit, 10) || 25;
    const offset = parseInt(req.query.offset, 10) || 0;
    const books = await Books.search(query, limit, offset);
    const normalizedBooks = [];
    books.forEach(book => normalizedBooks.push({
      title: book.title,
      description: book.description,
      id: book.id,
      pages: book.pages,
      rating: book.rating,
      authors: book.authors,
      genres: book.genres,
    }))
    logger.info(`Querying Books with query '${query}' got ${books.length} results`)
    return res.send(normalizedBooks)
  } catch (error) {
    logger.error(`Failed to search books, ${error.message}`);
    return res.status(400).send({ error: 'Failed to search for books' })
  }
})

module.exports = booksRouter;