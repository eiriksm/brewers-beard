var app = require('../src/app');
var brew = require('../src/routes/resources/brew');
var Brew = require('../src/lib/models/brew');
var request = require('supertest');
var assert = require('assert');
var should = require('should');

// Override app log.
app.log = function() {
};
app.log.info = app.log;
app.log.error = app.log;

describe('Routes', function() {
  var firstid, firsttempid;
  before(function(done) {
    // Allow 10 seconds to start up if we are creating the database.
    this.timeout(10000);
    // Just start by inserting some docs.
    var setUp = function() {
      if (!app.server) {
        setTimeout(setUp, 200);
        return;
      }
      request(app.server)
      .post('/api/brew')
      .send(JSON.stringify({name: 'super brew'}))
      .end(function(err, res) {
        if (err) {
          console.log(err);
          throw new Error(err);
        }
        try {
          firstid = JSON.parse(res.text).id;
        }
        catch (e) {
          console.log(e);
          console.log(res.text);
          throw new Error (e);
        }
        done(err);
      });
    };
    // Since we don't start the server before we have the db, let's wait a
    // little.
    setTimeout(setUp, 200);
  });
  before(function(done) {
    // Just start by inserting some docs.
    request(app.server)
    .post('/api/brew/1/temp')
    .send(JSON.stringify({name: 'super temp'}))
    .end(function(err, res) {
      firsttempid = JSON.parse(res.text).id;
      done(err);
    });
  });
  describe('Index file', function() {

    it('Should return something, when doing GET /', function(done) {
      request(app.server)
      .get('/')
      .end(function(err, res) {
        if (err) {
          done(err);
          return;
        }
        res.status.should.equal(200);
        done();
      });
    });
  });
  describe('API paths', function() {
    it('Should return something on /api', function(done) {
      request(app.server)
      .get('/api/brew')
      .end(function(err, res) {
        if (err) {
          done(err);
          return;
        }
        res.status.should.equal(200);
        done();
      });
    });

    it('Should return 404 when path is stupid', function(done) {
      request(app.server)
      .get('/api/WHATASTUPIDPATHTHISIS/1')
      .end(function(err, res) {
        if (err) {
          done(err);
          return;
        }
        res.status.should.equal(404);
        done();
      });
    });

    it('Should return 404 when resource id does not exist', function(done) {
      request(app.server)
      .get('/api/brew/doesnotexist')
      .end(function(err, res) {
        if (err) {
          done(err);
          return;
        }
        res.status.should.equal(404);
        done();
      });
    });

  });

  describe('Brew', function() {
    it('Should return a list when not specifying id on GET', function(done) {
      request(app.server)
      .get('/api/brew')
      .expect(200)
      .end(function(err, res) {
        JSON.parse(res.text).should.be.instanceof(Array);
        done();
      });
    });

    it('Should return a brew when specifying id on GET', function(done) {
      request(app.server)
      .get('/api/brew/' + firstid)
      .expect(200, done);
    });

    var newid;

    it('Should create a brew when POSTing', function(done) {
      request(app.server)
      .post('/api/brew')
      .send(JSON.stringify({name: 'super brew'}))
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res) {
        newid = JSON.parse(res.text).id;
        done(err);
      });
    });

    it('Should return same brew on GET now', function(done) {
      request(app.server)
      .get('/api/brew/' + newid)
      .end(function(err, res) {
        var data = JSON.parse(res.text);
        data.name.should.equal('super brew');
        done();
      });
    });

    it('Should update a brew when PATCHing', function(done) {
      request(app.server)
      .patch('/api/brew/' + newid)
      .send({name: 'super brew updated'})
      .expect(200, done);
    });

    it('Should not update a brew that does not exist when PATCHing', function(done) {
      request(app.server)
      .patch('/api/brew/' + newid + newid + 'doesnotexist' + Date.now())
      .send({name: 'super brew updated'})
      .expect(404, done);
    });

    it('Should show updated brew on GET now', function(done) {
      request(app.server)
      .get('/api/brew/' + newid)
      .end(function(err, res) {
        var data = JSON.parse(res.text);
        data.name.should.equal('super brew updated');
        done();
      });
    });

    it('Should delete a brew when DELETEing', function(done) {
      request(app.server)
      .del('/api/brew/' + newid)
      .expect(204)
      .end(function(err, res) {
        done(err);
      });
    });

    it('Should not delete same brew again when DELETEing', function(done) {
      request(app.server)
      .del('/api/brew/' + newid)
      .expect(404, done);
    });

    it('Should not update same brew again when PATCHing', function(done) {
      request(app.server)
      .patch('/api/brew/' + newid)
      .expect(404)
      .end(function(err, res) {
        done();
      });
    });

    it('Should return 404 on GET now', function(done) {
      request(app.server)
      .get('/api/brew/' + newid)
      .expect(404, done);
    });
  });

  describe('Brew temperature', function() {
    it('Should return a list when not specifying id on GET', function(done) {
      request(app.server)
      .get('/api/brew/1/temp')
      .expect(200)
      .end(function(err, res) {
        JSON.parse(res.text).should.be.instanceof(Array);
        done();
      });
    });

    it('Should return a temp when specifying id on GET', function(done) {
      request(app.server)
      .get('/api/brew/1/temp/' + firsttempid)
      .expect(200, done);
    });

    var newid;

    it('Should create a temp when POSTing', function(done) {
      request(app.server)
      .post('/api/brew/1/temp')
      .send(JSON.stringify({name: 'super brew'}))
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res) {
        newid = JSON.parse(res.text).id;
        done(err);
      });
    });

    it('Should return same temp on GET now', function(done) {
      request(app.server)
      .get('/api/brew/1/temp/' + newid)
      .end(function(err, res) {
        var data = JSON.parse(res.text);
        data.name.should.equal('super brew');
        done();
      });
    });

    it('Should update a temp when PATCHing', function(done) {
      request(app.server)
      .patch('/api/brew/1/temp/' + newid)
      .send({name: 'super brew updated', id: newid})
      .expect(200, done);
    });

    it('Should not update a non-existet temp when PATCHing', function(done) {
      request(app.server)
      .patch('/api/brew/1/temp/' + newid)
      .send({name: 'super brew updated', id: newid + 'randm' + Date.now()})
      .expect(404, done);
    });

    it('Should show updated temp on GET now', function(done) {
      request(app.server)
      .get('/api/brew/1/temp/' + newid)
      .end(function(err, res) {
        var data = JSON.parse(res.text);
        data.name.should.equal('super brew updated');
        done();
      });
    });

    it('Should delete a temp when DELETEing', function(done) {
      request(app.server)
      .del('/api/brew/1/temp/' + newid)
      .expect(200)
      .end(function(err, res) {
        done(err);
      });
    });

    it('Should not delete a temp when DELETEing again', function(done) {
      request(app.server)
      .del('/api/brew/1/temp/' + newid)
      .expect(404)
      .end(function(err, res) {
        done(err);
      });
    });

    it('Should return 404 on GET now', function(done) {
      request(app.server)
      .get('/api/brew/1/temp/' + newid)
      .expect(404, done);
    });
  });

  describe('Socket connection', function() {
    it('Should return something on /poll', function(done) {
      request(app.server)
      .get('/poll/myuser')
      .expect(200, done);
    });
  });

});
