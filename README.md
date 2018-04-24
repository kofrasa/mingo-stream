# mingo-stream
NodeJS streaming functionality for [mingo](https://github.com/kofrasa/mingo) query library

[![version](https://img.shields.io/npm/v/mingo-stream.svg)](https://www.npmjs.org/package/mingo-stream)
[![build status](https://img.shields.io/travis/kofrasa/mingo-stream.svg)](http://travis-ci.org/kofrasa/mingo-stream)
[![npm](https://img.shields.io/npm/dm/mingo-stream.svg)](https://www.npmjs.org/package/mingo-stream)

## install
```sh
npm install mingo-stream
```

## Stream Filtering
This example uses the [JSONStream](https://www.npmjs.com/package/JSONStream) package
```js
var JSONStream = require('JSONStream')
var fs = require('fs')
var Mingo = require('mingo')

require('mingo-stream')

var query = new Mingo.Query({
  scores: { $elemMatch: {type: "exam", score: {$gt: 90}} }
}, {name: 1})

file = fs.createReadStream('./students.json')

var qs = query.stream();
qs.on('data', function (data) {
    console.log(data); // log filtered outputs
    // ex. { name: 'Dinah Sauve', _id: 49 }
})

// file stream | json stream | query stream
file.pipe(JSONStream.parse("*")).pipe(qs)
```

## License
MIT