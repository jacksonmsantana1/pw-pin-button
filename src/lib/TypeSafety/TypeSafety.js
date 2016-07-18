import R from 'ramda';

const map = R.map;

/**
 * TypeSafety
 * @constructor
 */
const TypeSafety = function TypeSafety() {};

/**
 * typeOf
 * @param type
 * @returns {Function}
 */
TypeSafety.prototype.typeOf = function typeOf(type) {
  return function typeOfX(x) {
    if (typeof x === type) {
      return x;
    }

    throw new TypeError(`Error: ${type} expected, ${typeof x} given.`);
  };
};

TypeSafety.typeOf = TypeSafety.prototype.typeOf;

// Types
TypeSafety.str = TypeSafety.typeOf('string');
TypeSafety.num = TypeSafety.typeOf('number');
TypeSafety.bool = TypeSafety.typeOf('boolean');
TypeSafety.func = TypeSafety.typeOf('function');

/**
 * objectTypeOf
 * @param name
 * @returns {Function}
 */
TypeSafety.prototype.objectTypeOf = function objectTypeOf(name) {
  return function objTypeOfO(o) {
    if (Object.prototype.toString.call(o) === `[object ${name}]`) {
      return o;
    }

    throw new TypeError(`Error: ${name} expected, something else given.`);
  };
};

TypeSafety.objectTypeOf = TypeSafety.prototype.objectTypeOf;

//Objects Types
TypeSafety.obj = TypeSafety.objectTypeOf('Object');
TypeSafety.arr = TypeSafety.objectTypeOf('Array');

/**
 * arrayOf
 * @param f
 * @returns {Function}
 */
TypeSafety.prototype.arrayOf = function arrayOf(f) {
  return function arrayOfA(a) {
    return map(TypeSafety.func(f), TypeSafety.arr(a));
  };
};

TypeSafety.arrayOf = TypeSafety.prototype.arrayOf;

export
  default TypeSafety;
