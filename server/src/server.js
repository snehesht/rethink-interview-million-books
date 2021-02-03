const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./lib/logger');
const { initDatabase } = require('./models');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());


let server;
const startServer = async (port = 8000) => {
  try {
    await initDatabase();
    server = app.listen(port, () => logger.info(`Starting api-server on port ${port}`));
  } catch (error) {
    logger.error(`Error starting express server, ${error.message}`);
    logger.errorStack(error);
    throw error;
  }
}

const stopServer = async () => {
  if (server) {
    await server.close();
  }
}

module.exports = {
  startServer,
  stopServer,
};