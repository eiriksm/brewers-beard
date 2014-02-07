var requireDir = require('require-dir');
var resources = requireDir('./resources');

function run(genfun){
  // instantiate the generator object
  var gen = genfun();
  // This is the async loop pattern
  function next(err, answer){
    var res;
    /* istanbul ignore if */
    if (err) {
      // if err, throw it into the wormhole
      return gen.throw(err);
    }
    else {
      // if good value, send it
      res = gen.next(answer);
    }
    if (!res.done){
      // if we are not at the end
      // we have an async request to
      // fulfill, we do this by calling
      // `value` as a function
      // and passing it a callback
      // that receives err, answer
      // for which we'll just use `next()`
      res.value(next);
    }
  }
  // Kick off the async loop
  next();
}

var index = function*(resource, id){
  var ctx = this;
  run(function * () {
    if (!resources[resource]) {
      ctx.throw(404);
    }
    var val = yield resources[resource](ctx.req.method, id);
    ctx.body = val;
  });
};

module.exports = index;
