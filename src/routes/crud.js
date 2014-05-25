var requireDir = require('require-dir');
var resources = requireDir('./resources');
var app = require('../app');

var index = function*() {
  var ctx = this;
  // Since koa-route started to pass in next as argument, we need to get rid
  // of it.
  for (var prop in arguments) {
    if (typeof(arguments[prop]) === 'object' && ctx.req.method === 'GET') {
      delete arguments[prop];
    }
  }
  var resource = arguments[0];
  if (!resources[resource]) {
    ctx.throw(404);
  }
  try {
    ctx.body = yield resources[resource](ctx.req.method, ctx, arguments[1], arguments[2], arguments[3]);
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
