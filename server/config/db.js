/**
 * eslint no-console: 0
 */
(() => {
  'use strict';

  let mongoose = require('mongoose');
  // load .env only in dev mode
  if (process.env.NODE_ENV === 'development') {
    require('dotenv').load();
  }

  // Use bluebird for Mongoose promises
  mongoose.Promise = require('bluebird');

  // Enable Promises for the native MongoDB Driver
  var options = {
    promiseLibrary: require('bluebird')
  };

  if (process.env.DB_1_PORT_27017_TCP_ADDR) {
    // Check if running in docker and set the DB address
    var address = process.env.DB_1_PORT_27017_TCP_ADDR;
    var port = process.env.DB_PORT_27017_TCP_PORT;
    mongoose.connect(`mongodb://${address}:${port}/dms`, options);
  } else if (process.env.NODE_ENV === 'test') {
    mongoose.connect(process.env.MONGO_TEST_URL, options);
  } else {
    // MONGOLAB_URI is the MongoDB url config in Heroku
    mongoose.connect(process.env.MONGODB_URL || process.env.MONGOLAB_URI,
      options);
  }

  let db = mongoose.connection;

  db.on('error', console.error.bind(console, 'Connection Error : '));
  db.once('open', () => {
    console.log('Connection ok!');
  });

  module.exports = mongoose;

})();
