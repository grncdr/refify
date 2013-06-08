var test = require('tape');
var refify = require('./');

test('Round trip stringify and parse', function (t) {
  var o = {
    array: [],
    object: {}
  }

  o.array[0] = o
  o.object.circular = o;
  o.object.circular.array[1] = o.object

  var s = refify.stringify(o);
  var c = refify.parse(s);

  t.equal(c, c.array[0], 'Circular reference in array');
  t.equal(c, c.object.circular, 'Circular reference in object');
  t.equal(c.object, c.object.circular.array[1], 'Indirect circular reference');
  t.end()
})
