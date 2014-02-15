var requireDir = require('require-dir');
var resources = requireDir('./resources');
var app = require('../app');

var index = function*(resource, id, subresource, sid) {
  var ctx = this;
  if (!resources[resource]) {
    ctx.throw(404);
  }
  try {
    var resFun = resources[resource](ctx.req.method, ctx, id, subresource, sid);
    var lock = false;
    resFun(function(err, val) {
      if (lock) {
        return;
      }
      lock = true;
      if (err) throw(err);
      ctx.body = val;
    });
  }
  catch(err) {
    // Ignoring else, because I can not see why it should ever be run.
    /* istanbul ignore else */
    if (!isNaN(parseInt(err.message, 10))) {
      // I am going to assume this is a status code.
      ctx.throw(parseInt(err.message));
    }
    else {
      app.log.error(err);
      app.log.error(err.stack);
      ctx.throw(500);
    }
  }
};

module.exports = index;
