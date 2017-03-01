'use strict'

var Mingo = require('mingo')
var Transform = require('stream').Transform
var util = require('util')
var _ = Mingo._internal()

var VERSION = '0.0.1'

/**
 * Create a Transform class
 * @param query
 * @param options
 * @returns {Mingo.Stream}
 * @constructor
 */
function Stream (query, options) {
  if (!(this instanceof Stream)) {
    return new Stream(query, options)
  }

  options = options || {}
  Object.assign(options, { objectMode: true })
  Transform.call(this, options)
  // query for this stream
  this._query = query
}
// extend Transform
util.inherits(Stream, Transform)
Stream.VERSION = VERSION // version

Stream.prototype._transform = function (chunk, encoding, done) {
  if (_.isObject(chunk) && this._query.test(chunk)) {
    if (_.isEmpty(this._query._projection)) {
      this.push(chunk)
    } else {
      var cursor = new Mingo.Cursor([chunk], this._query)
      if (cursor.hasNext()) {
        this.push(cursor.next())
      }
    }
  }
  done()
}

Mingo.Query.prototype.stream = function (options) {
  return new Mingo.Stream(this, options)
}

module.exports = Mingo.Stream = Stream
