module.exports = refify

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
    var copy = initCopy(it);
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
  if (typeof it !== 'object') it = JSON.parse(it);

  var keyStack = [];
  var copy = initCopy(it);

  walk(it);

  return copy;

  function walk(obj) {
    if (typeof obj !== 'object') {
      set(copy, keyStack.slice(), obj);
      return;
    }
    for (var k in obj) {
      keyStack.push(k);
      var current = obj[k];
      var objPath = parseRef(current);
      while (objPath) {
        current = get(copy, objPath);
        objPath = parseRef(current);
      }
      if (current === obj[k]) {
        // We did *not* follow a reference
        set(copy, keyStack.slice(), initCopy(current));
        walk(current);
      } else {
        // We *did* follow a reference
        set(copy, keyStack.slice(), current);
      }
      keyStack.pop();
    }
  }
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

function get(obj, path) {
  if (!path.length) return obj;
  if (typeof obj !== 'object') return;
  var next = obj[path.shift()];
  return get(next, path);
}

refify.set = set;
function set(obj, path, value) {
  if (path.length === 0) throw new Error("Cannot replace root object");
  var key = path.shift();
  if (!path.length) {
    obj[key] = value;
    return;
  }
  switch (typeof obj[key]) {
  case 'undefined':
    obj[key] = isNaN(parseInt(key, 10)) ? {} : [];
    break;
  case 'object':
    break;
  default:
    throw new Error("Tried to set property " + key + " of non-object " + obj[key]);
  }
  set(obj[key], path, value);
}

function initCopy(obj) {
  if (typeof obj !== 'object') return obj;
  return Array.isArray(obj) ? [] : {}
}
