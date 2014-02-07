// Temp data-store.
var database = {

};

var db = {
  get: function(id, callback) {
    callback(null, database[id]);
  },
  put: function(data, callback) {
    database[data.id] = data;
    callback(null);
  }
};


module.exports = db;
