var test = require('tape');
var refify = require('./');

test('Simple stringify', function (t) {
  var o = {};
  o.o = o;
  t.equal('{"o":{"$ref":"#/"}}', refify.stringify(o));
  t.end();
})

test('Simple parse', function (t) {
  var o = refify.parse('{"o":{"$ref":"#/"}}');
  t.equal(o, o.o)
  t.end();
})

test('deep set', function (t) {
  var o = {};
  var p = ['blah', 0, 'ok'];
  refify.set(o, p, 12);
  t.deepEqual(o, {blah: [{ok: 12}]})
  t.end()
})

test('Indirect references', function (t) {
  var o = {
    a: [],
    o2: {}
  }

  o.a[0] = o.o2;
  o.o2.o = o;

  t.deepEqual(refify(o), {a: [{o: {$ref: "#/"}}], o2: {$ref: "#/a/0"}});
  var c = refify.parse(refify(o));
  t.equal(c.o2.o, c);
  t.equal(c.a[0], c.o2);
  t.end();
})

test('Nulls', function (t) {
  var o = { x: null }
  t.equal(refify.stringify(o), '{"x":null}')
})
