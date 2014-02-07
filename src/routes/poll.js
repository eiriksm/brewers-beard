var poll = function*(id) {
  if (!id) {
    this.throw(400);
  }
  this.body = 'test' + id;
};

module.exports = poll;
