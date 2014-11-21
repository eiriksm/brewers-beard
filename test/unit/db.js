var db = require('../../src/lib/db.js');

var assert = require('assert');
var should = require('should');
var testdata = {
  name: 'testname',
  somethingElse: 'something'
};

describe('Database', function() {
  var testid = 'test' + Date.now();
  var testrev;
  it('Should not return something on GET when we have an empty db', function(done) {
    db.get('bogus', testid, function(err, data) {
      if (err && parseInt(err.statusCode, 10) === 404) {
        done();
      }
      else {
        done('Did not find 404 error');
      }
    });
  });

  it('Should be possible to add something to db', function(done) {
    db.put('test', {id: testid, data: testdata}, function(err) {
      if (err) {
        done(err);
        return;
      }
      done();
    });
  });

  it('Should be possible to retrieve test data after it is added.', function(done) {
    db.get('test', testid, function(err, data) {
      if (err) {
        done(err);
        return;
      }
      testrev = data._rev;
      data.data.name.should.equal(testdata.name);
      data.data.somethingElse.should.equal(testdata.somethingElse);
      done();
    });
  });

  it('Should be possible to delete the test data', function(done) {
    db.del(testid, testrev, function(err) {
      done(err);
    });
  });

  it('Should not be possible to delete without id', function(done) {
    db.del(null, 'something', function(err) {
      err.message.should.equal('400');
      done();
    });
  });

  it('Should not be possible to delete without rev', function(done) {
    db.del('something', null, function(err) {
      err.message.should.equal('400');
      done();
    });
  });

  it('Should not be possible to delete invalid id', function(done) {
    db.del('test', 'a', function(err) {
      err.statusCode.should.equal(404);
      done();
    });
  });
});
