const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser')
const { db, Books } = require('../models');
const logger = require('./logger')
const { default:PQueue } = require('p-queue');

const insertQueue = new PQueue({ concurrency: 12 });

const normalizeString = function (field) {
  if (typeof (field) === 'string' && field !== 'NA') {
    return field.trim().replace(/"/g, '');
  }
  return null;
}

const normalizeInt = function (field) {
  if (typeof (field) === 'string' && field !== 'NA') {
    const parsedNum = parseInt(field.trim(), 10);
    if (!Number.isNaN(parsedNum)) {
      return parsedNum
    }
  }
  return null;
}
const normalizeFloat = function (field) {
  if (typeof (field) === 'string' && field !== 'NA') {
    const parsedNum = parseFloat(field.trim(), 10);
    if (!Number.isNaN(parsedNum)) {
      return parsedNum
    }
  }
  return null;
}

const normalizeBook = function(book) {
  return {
    id: uuid.v4(),
    authors: book.authors.split('|').map(author => normalizeString(author)),
    description: normalizeString(book.description),
    edition: normalizeString(book.edition),
    format: normalizeString(book.format),
    isbn: normalizeInt(book.isbn),
    pages: normalizeInt(book.pages.replace('pages', '').trim()),
    rating: normalizeFloat(book.rating),
    ratingcount: normalizeInt(book.ratingcount),
    reviewcount: normalizeInt(book.reviewcount),
    title: normalizeString(book.title),
    genres: book.genres.split('|').map(genre => normalizeString(genre)),
    thumbnail: normalizeString(book.thumbnail),
  }
}

const createBooks = async (books) => {
  try {
    for (let book of books) {
      try {
        await Books.create(book)
      } catch(error) {
        if (error.message === 'Validation error') {
          return createBooks([Object.assign({}, book, { id: uuid.v4() })])
        }
        logger.error(`Error inserting books ${error.message}`)
      }
    }
    // await Books.bulkCreate(books)
  } catch(error) {
    logger.error(`Error creating books, ${error.message}`)
  }
}

const loadBooks = async function () {
  try {
    const availableBook = await db.query('SELECT COUNT(ID) AS count FROM books;')
    let bookCount = 0;
    if (Array.isArray(availableBook) && Array.isArray(availableBook[0]) && availableBook[0][0].count) {
      bookCount = availableBook[0][0].count || '0';
    } 
    if (bookCount === 0) {
      await new Promise((resolve) => {
        let count = 0;
        let books = [];
        fs.createReadStream(path.resolve(__dirname, 'books.csv'))
          .pipe(csv())
          .on('data', (data) => {
            books.push(normalizeBook(data))
            if (books.length > 25) {
              insertQueue.add(async () => createBooks(books))
              books = [];
            }
            count += 1
          })
          .on('end', () => {
            if (books.length > 0) {
              insertQueue.add(async () => createBooks(books))
            }
            logger.info(`Inserting ${count} books`)
            resolve();
          })
      });
    }
    await insertQueue.onIdle();
  } catch (error) {
    console.error(`Error loading books data into postgres, ${error.message}`, error);
    throw error;
  }
}

module.exports = loadBooks;