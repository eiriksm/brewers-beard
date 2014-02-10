var requireDir = require('require-dir');
var resources = requireDir('./resources');

var index = function*(resource, id){
  var ctx = this;
  if (!resources[resource]) {
    ctx.throw(404);
  }
  try {
    var resFun = resources[resource](ctx.req.method, id, ctx);
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
      ctx.throw(500);
    }
  }
};

module.exports = index;
