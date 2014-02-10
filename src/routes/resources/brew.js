var db = require('../../lib/db');
var Brew = require('../../lib/models/brew');

var getBrew = function(id, callback) {
  // If no id, return whole list.
  if (!id) {
    db.get(null, callback);
    return;
  }

  db.get(id, function(err, val) {
    callback(err, val);
  });
};

var postBrew = function(data, callback) {
  var brew = new Brew('brew');
  // Generate id. But here?
  data.id = Date.now();
  db.put(data, callback);
};

var deleteBrew = function(id, callback) {
  db.del(id, function(err) {
    callback(err);
  });
};

var updateBrew = function(id, data, callback) {
  data.id = id;
  db.put(data, callback);
}

var answer = function(verb, id, ctx) {
  return function(callback) {
    /* istanbul ignore else */
    if (verb === 'GET') {
      getBrew(id, function(err, res) {
        callback(err, res);
        return;
      });
    }
    if (verb === 'POST') {
      postBrew(ctx.postbody, function(err, res) {
        callback(err, res);
        return;
      });
    }
    if (verb === 'DELETE') {
      deleteBrew(id, function(err) {
        callback(err);
        return;
      });
    }
    if (verb === 'PATCH') {
      updateBrew(id, ctx.postbody, callback);
    }
  };
};

module.exports = answer;
