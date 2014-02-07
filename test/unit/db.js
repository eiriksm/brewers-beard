var db = require('../../src/lib/db.js');

var assert = require('assert');
var should = require('should');
var testdata = {
  name: 'testname',
  somethingElse: 'something'
};

describe('Database', function() {
  it('Should not return something on GET when we have an empty db', function(done) {
    db.get('a', function(err, data) {
      if (err) {
        done(err);
        return;
      }
      assert.equal(data, undefined);
      done();
    });
  });

  it('Should be possible to add something to db', function(done) {
    db.put({id: 'a', data: testdata}, function(err) {
      if (err) {
        done(err);
        return;
      }
      done();
    });
  });

  it('Should be possible to retrieve test data after it is added.', function(done) {
    db.get('a', function(err, data) {
      if (err) {
        done(err);
        return;
      }
      data.data.should.equal(testdata);
      done();
    });
  });
});
