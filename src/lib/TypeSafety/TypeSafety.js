import R from 'ramda';
import Either from 'data.either';

const map = R.map;
const isNil = R.isNil;

/**
 * TypeSafety
 * @constructor
 */
const TypeSafety = function TypeSafety() {};

/**
 * Return an Either.Left if value is null
 * otherwise return an Either.Right(a)
 * @param a
 */
TypeSafety.prototype.nil = function nil(a) {
  if (isNil(a)) {
    return Either.Left('Null value');
  }

  return Either.Right(a);
};

TypeSafety.nil = TypeSafety.prototype.nil;

/**
 * Return an Either.Left if value is undefined
 * otherwise return an Either.Right(a)
 * @param a
 */
TypeSafety.prototype.undef = function undef(a) {
  if (a === void 0) {
    return Either.Left('Undefined value');
  }

  return Either.Right(a);
};

TypeSafety.undef = TypeSafety.prototype.undef;

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

/**
 * a -> Either(Array, String)
 * @param arr
 */
TypeSafety.prototype.arrTypeOf = function arrTypeOf(arr) {
  if (Object.prototype.toString.call(arr) === '[object Array]') {
    return Either.Right(arr);
  } else if (isNil(arr)) {
    return Either.Left('Null value');
  } else if (arr === void 0) {
    return Either.Left('Undefined value');
  }

  return Either.Left('Error: Array expected, something else given.');
};

TypeSafety.arrTypeOf = TypeSafety.prototype.arrTypeOf;

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
