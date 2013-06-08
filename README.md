# refify

## Synopsis

```javascript
var refify = require('refify');

var o = {};
o.circular = o;

refify(o)                           //=> {circular: {$ref: "#/"}}
refify.stringify(o)                 //=> '{"circular":{"$ref":"#/"}}'
refify.parse('{"o":{"$ref":"#/"}}') //=> {circular: [Circular]}
```

## Description

This module allows you to safely `JSON.stringify` objects with circular
references. Circular references are replaced with document-relative
[JSON references][json_ref]. This provides a clear and unambiguous encoding that
is already supported by other tools. A simple example:

## Install

    npm install refify

## License

MIT
