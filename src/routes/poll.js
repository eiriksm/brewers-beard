var socket = function*(id) {
  // Just some placeholder code.
  var reply = function() {
    return function(cb) {
      cb(null, 'hello');
    };
  };
  this.body = yield reply();
};

module.exports = socket;
