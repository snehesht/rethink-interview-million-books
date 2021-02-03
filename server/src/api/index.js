const { Router } = require('express');
const booksRouter = require('./books');

const apiRouter = Router();

apiRouter.use('/books', booksRouter);

module.exports = apiRouter;