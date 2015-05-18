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
is already supported by other tools.

## Install

Refify uses a universal module definition, this means you can load it using whatever module system you like: CommonJS, AMD, or none at all.

If there is no module loader detected (e.g. you just have a plain `<script src="refify.js"></script>` in your HTML), `refify` will be defined globally.

## License

MIT

[json_ref]: http://tools.ietf.org/id/draft-pbryan-zyp-json-ref-03.html
