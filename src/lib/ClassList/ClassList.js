/*
 * Return the classList property of e, if it has one.
 * Otherwise, return an object that simulates the DOMTokenList API for e.
 * The returned object has contains(), add(), remove(), toggle() and toString()
 * methods for testing and altering the set of classes of the element e.
 * If the classList property is natively supported, the returned object is
 * array-like and has length and array index properties. The simulated
 * DOMTokenList is not array-like, but has a toArray() method that returns
 * a true-array snapshot of the element's class names.
 */

// CSSClassList is a JavaScript class that simulates DOMTokenList
function CSSClassList(e) {
  this.e = e;
}

function classList(e) {
  if (e.classList) {
    return e.classList;
  }

  return new CSSClassList(e);
}

// Return true if e.className contains the class c, false otherwise
CSSClassList.prototype.contains = function contains(c) {
  // Check common cases first
  const classes = this.e.className;

  // Check that c is a valid class name
  if (c.length === 0 || c.indexOf(' ') !== -1) {
    throw new Error('Invalid class name: "' + c + '"');
  }

  if (!classes) {
    return false; // e has no classes at all
  }

  if (classes === c) {
    return true; // e has one class that matches exactly
  }

  // Otherwise, use a RegExp to search for c as a word by itself
  // \b in a regular expression requires a match at a word boundary.
  return classes.search('\\b' + c + '\\b') !== -1;
};

// Add c to the e.className if it is not already present
CSSClassList.prototype.add = function add(c) {

  const classes = this.e.className;
  if (this.contains(c)) {
    return; // Do nothing if already present
  }

  if (classes && classes[classes.length - 1] !== ' ') {
    /*eslint no-param-reassign:0*/
    c = ' ' + c; // Add a space if we need one
  }

  this.e.className += c; // Add c to the className
};

// Remove all occurrences of c from e.className
CSSClassList.prototype.remove = function remove(c) {

  // Remove all occurances of c as a word, plus any trailing space
  const pattern = new RegExp('\\b' + c + '\\b\\s*', 'g');

  // Make sure c is a valid class name
  if (c.length === 0 || c.indexOf(' ') !== -1) {
    throw new Error('Invalid class name: "' + c + '"');
  }

  this.e.className = this.e.className.replace(pattern, '');
};

// Add c to e.className if it is not already present and return true.
// Otherwise, remove all occurrences of c from e.className and return false.
CSSClassList.prototype.toggle = function toggle(c) {
  if (this.contains(c)) { // If e.className contains c
    this.remove(c); // then remove it.
    return false;
  }

  this.add(c); // add it.
  return true;

};

// Return e.className itself
CSSClassList.prototype.toString = function toString() {
  return this.e.className;
};

// Return of the names in e.className
CSSClassList.prototype.toArray = function toArray() {
  return this.e.className.match(/\b\w+\b/g) || [];
};

export
default classList;
