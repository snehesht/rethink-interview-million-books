const { Sequelize } = require('sequelize');
const db = require('./db');
const logger = require('../lib/logger')

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

Books.search = async function (query = '', limit = 25, offset = 0) {
  let sqlQuery = `SELECT * FROM books LIMIT ${limit} OFFSET ${offset}`;
  if (query.length >= 1) {
    sqlQuery = `SELECT * FROM (SELECT * FROM books WHERE fts_tsv @@ plainto_tsquery('english', '${query}')) AS fts ORDER BY ts_rank_cd(fts.fts_tsv, plainto_tsquery('english', '${query}')) DESC LIMIT ${limit} OFFSET ${offset}`;
  }
  logger.debug(sqlQuery);
  return db.query(sqlQuery, { type: Sequelize.QueryTypes.SELECT });
}

const initBooksFullTextSearch = async () => {
  try {
    const result = await db.query('SELECT EXISTS(SELECT * FROM pg_trigger WHERE tgname = \'books_fts_update_trigger\') as exists', { type: Sequelize.QueryTypes.SELECT });
    if (!result[0].exists) {
      await db.query('ALTER TABLE books ADD COLUMN IF NOT EXISTS fts_tsv tsvector;')
      await db.query('CREATE INDEX IF NOT EXISTS fts_tsv_idx ON books USING GIN(fts_tsv);')
      await db.query(`UPDATE "books" SET "fts_tsv" =
        setweight(to_tsvector(coalesce(title,'')), 'A') ||
        setweight(to_tsvector(coalesce(description,'')), 'D') ||
        setweight(to_tsvector(coalesce(array_to_string(authors, ''),'')), 'A');`);
      await db.query(`CREATE OR REPLACE FUNCTION books_fts_trigger() RETURNS trigger AS $$
  begin
    new.fts_tsv :=
      setweight(to_tsvector(coalesce(new.title,'')), 'A') ||
      setweight(to_tsvector(coalesce(new.description,'')), 'B') ||
      setweight(to_tsvector(coalesce(array_to_string(new.authors, ''),'')), 'A');
    return new;
  end
  $$ LANGUAGE plpgsql;`)
      await db.query('CREATE TRIGGER books_fts_update_trigger BEFORE INSERT OR UPDATE ON books FOR EACH ROW EXECUTE PROCEDURE books_fts_trigger();')
      logger.info('Setting Full text search on Books model')
    } else {
      logger.info('Full text search is available')
    }
    
  } catch (error) {
    logger.error(`Error setting up full text search, ${error.message}`);
    throw error;
  }
}

module.exports = {
  Books,
  initBooksFullTextSearch,
};