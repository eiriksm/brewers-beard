var Brew = require('./models/brew');

// Temp data-store.
var database = {
  '1': new Brew()
};

var db = {
  list: [],
  get: function(id, callback) {
    if (!id) {
      callback(null, db.list);
      return;
    }
    if (!database[id]) {
      callback(new Error(404));
      return;
    }
    callback(null, database[id]);
  },
  put: function(data, callback) {
    database[data.id] = data;
    callback(null, data.id);
  },
  del: function(id, callback) {
    if (!id) {
      callback(new Error(400));
      return;
    }
    if (!database[id]) {
      callback(new Error(404));
      return;
    }
    delete database[id];
    callback(null);
  }
};


module.exports = db;
