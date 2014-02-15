var Brew = require('./models/brew');
var Temp = require('./models/temp');

// Temp data-store.
var database = {
  brew: {
    '1': new Brew('super brew', 1)
  },
  temp: {
    '1': new Temp()
  }

};

var db = {
  get: function(type, id, callback) {
    if (!id) {
      callback(null, database[type]);
      return;
    }
    if (!database[type] || !database[type][id]) {
      callback(new Error(404));
      return;
    }
    callback(null, database[type][id]);
  },
  put: function(type, data, callback) {
    if (!database[type]) {
      database[type] = {};
    }
    database[type][data.id] = data;
    callback(null, data.id);
  },
  del: function(type, id, callback) {
    if (!id) {
      callback(new Error(400));
      return;
    }
    if (!database[type] || !database[type][id]) {
      callback(new Error(404));
      return;
    }
    delete database[type][id];
    callback(null);
  }
};


module.exports = db;
