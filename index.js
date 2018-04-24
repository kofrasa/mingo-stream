'use strict'

var mingo = require('mingo')
var Transform = require('stream').Transform
var util = require('util')
var _ = mingo._internal()

var VERSION = '0.0.2'

/**
 * Create a Transform class
 * @param query
 * @param options
 * @returns {mingo.Stream}
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
  this.__query = query
}
// extend Transform
util.inherits(Stream, Transform)
Stream.VERSION = VERSION // version

Stream.prototype._transform = function (chunk, encoding, done) {
  if (_.isObject(chunk) && this.__query.test(chunk)) {
    if (_.isEmpty(this.__query.__projection)) {
      this.push(chunk)
    } else {
      var cursor = new mingo.Cursor([chunk], this.__query)
      if (cursor.hasNext()) {
        this.push(cursor.next())
      }
    }
  }
  done()
}

mingo.Query.prototype.stream = function (options) {
  return new mingo.Stream(this, options)
}

module.exports = mingo.Stream = Stream
