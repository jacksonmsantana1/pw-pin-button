import R from 'ramda';
import Maybe from 'data.maybe';
import Either from 'data.either';
import Rx from 'rx';

const isEmpty = R.isEmpty;
const curry = R.curry;
const compose = R.compose;
const equals = R.equals;
const nth = R.nth;

/**
 *  Helpers Functions
 *
 *  ps: Don't need unit test.Functions already
 *  tested in others projects
 */

/*********************************Constructor********************************/

const Helpers = function Helpers() {};

// compareId :: String -> Object -> Boolean
const compareId = curry((id, obj) => equals(id, obj.id));

/************************Functors******************************/

// map :: (ObjectA -> ObjectB), M -> M[ObjectB]
const map = R.curry((f, container) => (container.map(f)));

// chain :: (ObjectA -> ObjectB), M -> ObjectB
const chain = R.curry((f, container) => (container.chain(f)));

// join :: M -> M[M[ObjectA]] -> M[ObjectA]
const join = function join(container) {
  return container.join();
};

/***************************Loggers*****************************/

// trace :: String -> Object -> Object
const trace = R.curry((tag, x) => {
  /*eslint no-console:0*/
  console.log(tag, x);
  return x;
});

/*****************************Events******************************/

// event :: String -> HTLMElement -> StreamEvent
const event = R.curry((evt, el) => (Rx.Observable.fromEvent(el, evt)));

// eventClick :: HTMLElement -> StreamClickEvent
const eventClick = event('click');

// createCustomEvent :: String -> Object -> Boolean -> Boolean -> CustomEvent
const createCustomEvent = curry((_name, _detail, _bubbles, _cancelable) =>
  new CustomEvent(_name, {
    detail: _detail,
    bubbles: _bubbles,
    cancelable: _cancelable,
  }));

// emitCustomEvent :: Component -> Event -> _
const emitCustomEvent = curry((obj, evt) => {
  obj.dispatchEvent(evt);
});

/*********************************Arrays***********************************/

// head :: Array -> Maybe
const head = compose(Maybe.fromNullable, nth(0));

// second :: Array -> Maybe
const second = compose(Maybe.fromNullable, nth(1));

// isArrayEmpty :: Array -> Either
const isArrayEmpty = (arr) => (isEmpty(arr) ?
  Either.Left('No pwPinButton was found') :
  Either.Right(arr));

/****************************************************************************/

Helpers.prototype.createCustomEvent = createCustomEvent;
Helpers.createCustomEvent = Helpers.prototype.createCustomEvent;

Helpers.prototype.emitCustomEvent = emitCustomEvent;
Helpers.emitCustomEvent = Helpers.prototype.emitCustomEvent;

Helpers.prototype.chain = chain;
Helpers.chain = Helpers.prototype.chain;

Helpers.prototype.map = map;
Helpers.map = Helpers.prototype.map;

Helpers.prototype.join = join;
Helpers.join = Helpers.prototype.join;

Helpers.prototype.trace = trace;
Helpers.trace = Helpers.prototype.trace;

Helpers.prototype.event = event;
Helpers.event = Helpers.prototype.event;

Helpers.prototype.eventClick = eventClick;
Helpers.eventClick = Helpers.prototype.eventClick;

Helpers.prototype.head = head;
Helpers.head = Helpers.prototype.head;

Helpers.prototype.second = second;
Helpers.second = Helpers.prototype.second;

Helpers.prototype.isArrayEmpty = isArrayEmpty;
Helpers.isArrayEmpty = Helpers.prototype.isArrayEmpty;

Helpers.prototype.compareId = compareId;
Helpers.compareId = Helpers.prototype.compareId;

export
default Helpers;
