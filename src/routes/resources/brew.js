var db = require('../../lib/db');
var Brew = require('../../lib/models/brew');
var Temp = require('../../lib/models/temp');

var subresources = {
  temp: Temp
};

// Parent CRUD functions.
var getBrew = function(id, callback) {
  // If no id, return whole list.
  if (!id) {
    db.get('brew', null, callback);
    return;
  }

  db.get('brew', id, function(err, val) {
    callback(err, val);
  });
};

var postBrew = function(data, callback) {
  // Generate id. But here?
  data.id = Date.now();
  db.put('brew', data, callback);
};

var deleteBrew = function(id, callback) {
  db.del('brew', id, function(err) {
    callback(err);
  });
};

var updateBrew = function(id, data, callback) {
  data.id = id;
  db.put('brew', data, callback);
};

// Generic subresource CRUD functions.
var getSubResource = function(resource, id, callback) {
  if (!id) {
    // User is requesting a list.
    db.get(resource, null, callback);
    return;
  }
  db.get(resource, id, callback);
};

var createSubresource = function(resource, data, callback) {
  data.id = Date.now();
  db.put(resource, data, callback);
};

var updateSubresource = function(resource, data, callback) {
  db.put(resource, data, callback);
};

var deleteSubresource = function(resource, id, callback) {
  db.del(resource, id, callback);
};

var answer = function(verb, ctx, id, subresource, sid) {
  return function(callback) {
    /* istanbul ignore else */
    if (verb === 'GET') {
      // See if we are calling a subreasource.
      if (subresource && subresources[subresource]) {
        getSubResource(subresource, sid, function(err, res) {
          callback(err, res);
        });
      }
      getBrew(id, function(err, res) {
        callback(err, res);
        return;
      });
    }
    if (verb === 'POST') {
      if (subresource && subresources[subresource]) {
        createSubresource(subresource, ctx.postbody, callback);
        return;
      }
      postBrew(ctx.postbody, function(err, res) {
        callback(err, res);
        return;
      });
    }
    if (verb === 'DELETE') {
      if (subresource && subresources[subresource]) {
        deleteSubresource(subresource, sid, callback);
        return;
      }
      deleteBrew(id, function(err) {
        callback(err);
        return;
      });
    }
    if (verb === 'PATCH') {
      if (subresource && subresources[subresource]) {
        updateSubresource(subresource, ctx.postbody, callback);
        return;
      }
      updateBrew(id, ctx.postbody, callback);
    }
  };
};

module.exports = answer;
