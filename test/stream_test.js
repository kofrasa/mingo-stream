var fs = require('fs'),
    Transform = require('stream').Transform,
    util = require('util');
    test = require('tape'),
    Mingo = require('mingo');
    
var _ = Mingo._internal();

test("JSON Stream filtering", function (t) {
  t.plan(2);

  // create a simple fake JSON stream
  var JSONStream = function () {
    if (!(this instanceof JSONStream))
      return new JSONStream();
    Transform.call(this, {objectMode: true});
  };
  util.inherits(JSONStream, Transform);

  JSONStream.prototype._transform = function (chunk, enc, done) {
    var self = this;
    chunk = JSON.parse(chunk);
    _.each(chunk, function (obj) {
      self.push(obj);
    });
    done();
  };

  var found2Keys = true;
  var cursor;
  var query = new Mingo.Query({
    scores: {$elemMatch: {type: "exam", score: {$gt: 90}}}
  }, {name: 1});

  var file = fs.createReadStream(__dirname + '/data/students.json');
  file.on('data', function (data) {
    cursor = query.find(JSON.parse(data));
  });

  var qs = query.stream();
  var count = 0;
  qs.on('data', function (data) {
    // projecting only {name, _id}
    found2Keys = Object.keys(data).length == 2 && found2Keys;
    count++;
  });

  qs.on('end', function () {
    t.ok(count > 0 && count === cursor.count(), "Filtered only matching documents via stream");
    t.ok(found2Keys, "Projected only requested keys via stream");
  });

  // fileStream --> jsonStream --> queryStream
  file.pipe(JSONStream()).pipe(qs);
});