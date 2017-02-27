(function(){

  var Mingo = require('mingo');
  var Transform = require('stream').Transform;
  var util = require('util');

  var VERSION = '0.0.1';

  Mingo.Query.prototype.stream = function (options) {
    return new Mingo.Stream(this, options);
  };

  /**
   * Create a Transform class
   * @param query
   * @param options
   * @returns {Mingo.Stream}
   * @constructor
   */
  Mingo.Stream = function (query, options) {

    if (!(this instanceof Mingo.Stream))
      return new Mingo.Stream(query, options);

    options = options || {};
    Object.assign(options, { objectMode: true });
    Transform.call(this, options);
    // query for this stream
    this._query = query;
  };
  // extend Transform
  util.inherits(Mingo.Stream, Transform);

  Mingo.Stream.prototype._transform = function (chunk, encoding, done) {
    if (isObject(chunk) && this._query.test(chunk)) {
      if (isEmpty(this._query._projection)) {
        this.push(chunk);
      } else {
        var cursor = new Mingo.Cursor([chunk], this._query);
        if (cursor.hasNext()) {
          this.push(cursor.next());
        }
      }
    }
    done();
  };

  Mingo.Stream.VERSION = VERSION;

  var isNodeJS = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  // Export Mingo.Stream directly for Node.js
  if (isNodeJS) {
    module.exports = Mingo.Stream;
  }

}(this));