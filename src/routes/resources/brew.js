var db = require('../../lib/db');

var getBrew = function(id) {
  // If no id, return whole list.
  if (!id) {
    return 'LIST VIEW';
  }
  return 'brew';
}

var answer = function(verb, id) {
  return function(callback) {
    /* istanbul ignore else */
    if (verb === 'GET') {
      var value = getBrew(id);
      callback(null, value);
      return;
    }
    // Feeling pretty safe this is the right thing to do.
    else {
      callback(new Error('Problems'));
    }
  };
};

module.exports = answer;
