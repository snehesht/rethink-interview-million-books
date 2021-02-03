require('dotenv').config() // loads .env file in root dir
const { startServer, stopServer } = require('./server');
const logger = require('./lib/logger')

const PORT = process.env.HTTP_PORT || '8000';
const serverPort = parseInt(PORT, 10);

startServer(serverPort)
  .then(() => logger.info('Started Books API server'))
  .catch(err => {
    logger.error(`Unable to start server, Error: ${err.message}`)
    exitHandler()
  });

process.stdin.resume();

const exitHandler = async () => {
  await stopServer();
  logger.info('Stopped server');
  process.exit(0);
};

//do something when app is closing
process.on('exit', exitHandler);

//catches ctrl+c event
process.on('SIGINT', exitHandler);

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler);
process.on('SIGUSR2', exitHandler);

//catches uncaught exceptions
process.on('uncaughtException', exitHandler);
process.on('unhandledRejection', exitHandler);