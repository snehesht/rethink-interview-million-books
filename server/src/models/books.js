const { Sequelize } = require('sequelize');
const db = require('./db');

const { DB_URI } = process.env;
if (!DB_URI) {
  throw new Error('Missing DB_URI env var');
}

/*
CREATE TABLE books (
  id SERIAL,
  authors TEXT[],
  description TEXT,
  edition TEXT,
  format TEXT,
  isbn BIGINT,
  pages INTEGER,
  rating NUMERIC,
  ratingcount BIGINT,
  reviewcount BIGINT,
  title TEXT,
  image_url TEXT,
  genres TEXT[],
  PRIMARY KEY (id)
)
 */

const Books = db.define('books', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
  },
  authors: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    allowNull: false,
    defaultValue: [],
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  edition: {
    type: Sequelize.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  format: {
    type: Sequelize.TEXT,
    allowNull: false,
    defaultValue: '',
  },
  isbn: {
    type: Sequelize.BIGINT,
    allowNull: true,
  },
  pages: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  rating: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  ratingcount: {
    type: Sequelize.BIGINT,
    allowNull: true,
  },
  reviewcount: {
    type: Sequelize.BIGINT,
    allowNull: true,
  },
  title: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  thumbnail: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  genres: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    allowNull: false,
    defaultValue: [],
  },
}, {
  timestamps: true,
  createdAt: 'created',
  updatedAt: 'updated',
});

module.exports = Books;