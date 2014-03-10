var Brew = require('./models/brew');
var Temp = require('./models/temp');
var app = require('../app');
var dbconfig = app.config.database;
var nano = require('nano')('http://' + dbconfig.host + ':' + dbconfig.port);

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
  init: function(cb) {
    // Try to create a database.
    nano.db.create(dbconfig.name, function(err, res) {
      /* istanbul ignore next */
      if (err) {
        if (err.error === 'file_exists') {
          // Just assuming file exists is good.
        }
        else {
          throw new Error(err);
        }
      }
      app.db = nano.use(dbconfig.name);
      cb(null);
    });
  },
  get: function(type, id, callback) {
    if (!id) {
      app.db.list({startkey: type + ':0', endkey: type + ':z'}, function(err, body) {
        /* istanbul ignore next */
        if (err) {
          if (err.statusCode) {
            callback(new Error(parseInt(err.status_code, 10)));
            return;
          }
        }
        callback(err, body.rows);
      });
    }
    else {
      app.db.get(id, function(err, body) {
        if (err && err.status_code) {
          callback(new Error(parseInt(err.status_code, 10)));
          return;
        }
        callback(err, body);
      });
    }
  },
  put: function(type, data, callback) {
    app.db.insert(data, data.id, function(err, body) {
      /* istanbul ignore next */
      if (err) {
        if (err.statusCode) {
          callback(new Error(parseInt(err.status_code, 10)));
          return;
        }
      }
      callback(err, body);
    });
  },
  del: function(id, rev, callback) {
    if (!id) {
      callback(new Error(400));
      return;
    }
    if (!rev) {
      callback(new Error(400));
      return;
    }
    app.db.destroy(id, rev, function(err, body) {
      if (err && err.status_code) {
        callback(new Error(parseInt(err.status_code, 10)));
        return;
      }
      callback(err, body);
    });
  }
};


module.exports = db;
