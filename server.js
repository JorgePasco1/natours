/* eslint-disable no-console */
const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log(`UNCAUGHT EXCEPTION! 💥 Shutting down...`);
  console.log(err.name, ':', err.message);
  process.exit(1); // don't need to shut down server, since they're not going to happen asynchronously, so no need to wait for it to finish processes.
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const app = require('./app');

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'))
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, ':', err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
    // give time to the server to handle the request still being processed, before shutting down the process
    process.exit(1);
  });
});

// Heroku specific
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting sown down gracefully.');
  server.close(() => {
    console.log('🚨 Process terminated!');
  });
});
