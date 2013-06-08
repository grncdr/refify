module.exports = refify

var traverse = require('traverse');

function refify(obj) {
  var objs = [];
  var paths = []

  var keyStack = [];
  var objStack  = [];

  return walk(obj);

  function walk(it) {
    if (typeof it !== 'object') {
      return it;
    }
    objs.push(it);
    paths.push(keyStack.slice())
    objStack.push(it)
    var copy = Array.isArray(it) ? [] : {}
    for (var k in it) {
      keyStack.push(k);
      var v = it[k];
      var i = objs.indexOf(v);
      if (i == -1) {
        copy[k] = walk(v)
      } else {
        var $ref = '#/' + paths[i].join('/');
        copy[k] = {$ref: $ref};
      }
      keyStack.pop();
    }
    objStack.pop();
    return copy;
  }
}

refify.parse = function (it) {
  if (typeof it !== 'object') it = JSON.parse(it)
  if (typeof it !== 'object') return it;

  var copy = traverse(it).clone();
  var t = traverse(copy);
  t.forEach(function () {
    var current = this.node;
    var objPath = parseRef(current);
    while (objPath) {
      current = t.get(objPath);
      objPath = parseRef(current);
    }
    if (current !== this.node) {
      this.update(current, true);
    }
  })
  return copy;
}

refify.stringify = function (obj, replacer, spaces) {
  return JSON.stringify(refify(obj), replacer, spaces)
}

function parseRef(value) {
  if (typeof value !== 'object') return false;
  if (!value.$ref) return false;
  var path = value.$ref == '#/' ? [] : value.$ref.split('/').slice(1);
  return path
}
