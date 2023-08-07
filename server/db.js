'use strict';

const sqlite = require('sqlite3');

// open the database
exports.db = new sqlite.Database('db.sqlite', (err) => {
  if (err) throw err;
});