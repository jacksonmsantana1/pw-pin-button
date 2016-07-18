import R from 'ramda';
import Helpers from '../Helpers/Helpers';
import IO from '../IO/IO';
import Maybe from 'data.maybe';

/******************************Helpers*******************************/

// ramda
const curry = R.curry;
const compose = R.compose;
const map = R.map;
const get = R.prop;
const nth = R.nth;
const equals = R.equals;

// Helpers
const compareId = Helpers.compareId;
const isArrayEmpty = Helpers.isArrayEmpty;

/*******************************Constructor**************************/

const HTMLFunctional = function HTMLFunctional() {};

// createShadowDom :: HTMLElement -> ShadowRoot
const createShadowDom = (elem) => (elem.createShadowRoot());

/****************************Setters*********************************/

// setInnerHTML :: String -> HTMLElement -> HTMLElement
const setInnerHTML = curry((strHtml, elem) => {
  /*eslint no-param-reassign:0*/
  elem.innerHTML = strHtml;
});

// setAttr :: HTMLElement -> String -> String -> _
const setAttr = curry((obj, attr, val) => {
  const clone = Object.assign({}, obj);
  clone[attr] = val;
  return clone;
});

/*****************************Getters********************************/

// getDOM :: _ -> IO(Document)
const getDOM = IO.of(window.document);

// getElementsByTagName :: String -> IO([HTMLElement])
const getElementsByTagName = (tag) => getDOM.map((doc) => (doc.getElementsByTagName(tag)));

// getElementByTagName :: String -> IO(HTMLElement)
const getElementByTagName = (tag) => getDOM.map((doc) => (doc.getElementsByTagName(tag)));

// getShadowRoot :: PwPinButton -> Maybe(ShadowRoot)
const getShadowRoot = compose(Maybe.fromNullable, get('shadowRoot'));

// getChildNodes :: HTMLElement -> Maybe(Array)
const getChildNodes = compose(Maybe.fromNullable, get('childNodes'));

// getPwProjectInfo :: String -> Either(PwProjectInfo, Error)
const getPwProjectInfo = (pId) => getElementsByTagName('pw-project-info')
  .map(R.filter(compareId(pId)))
  .map(isArrayEmpty)
  .map(map(nth(0)));

// getPwUserInfo :: _ -> Either(PwUserInfo, Error)
const getPwUserInfo = getElementsByTagName('pw-user-info')
  .map(isArrayEmpty)
  .map(map(nth(0)));

/*********************************Toggles*********************************/

// toggleAttr :: HTMLElement -> String -> [String] -> Boolean -> HTMLElement
const toggleAttr = (comp, attrName, attrValues) => {
  const attr = get(attrName);
  const checkAttr = compose(equals(attrValues[0]), attr);

  if (checkAttr(comp)) {
    setAttr(comp, attrName, attrValues[1]);
  } else {
    setAttr(comp, attrName, attrValues[0]);
  }

  return comp;
};

//toggleStyle :: String -> DOMTokenList -> IO
const toggleStyle = curry((styleAttr, classList) =>
  (new IO(() => { classList.toggle(styleAttr); })));

/**********************************************************************/

HTMLFunctional.prototype.setInnerHTML = setInnerHTML;
HTMLFunctional.setInnerHTML = HTMLFunctional.prototype.setInnerHTML;

HTMLFunctional.prototype.setAttr = setAttr;
HTMLFunctional.setAttr = HTMLFunctional.prototype.setAttr;

HTMLFunctional.prototype.createShadowDom = createShadowDom;
HTMLFunctional.createShadowDom = HTMLFunctional.prototype.createShadowDom;

HTMLFunctional.prototype.getElementByTagName = getElementByTagName;
HTMLFunctional.getElementByTagName = HTMLFunctional.prototype.getElementByTagName;

HTMLFunctional.prototype.getElementsByTagName = getElementsByTagName;
HTMLFunctional.getElementsByTagName = HTMLFunctional.prototype.getElementsByTagName;

HTMLFunctional.prototype.getShadowRoot = getShadowRoot;
HTMLFunctional.getShadowRoot = HTMLFunctional.prototype.getShadowRoot;

HTMLFunctional.prototype.getChildNodes = getChildNodes;
HTMLFunctional.getChildNodes = HTMLFunctional.prototype.getChildNodes;

HTMLFunctional.prototype.getProjectInfo = getPwProjectInfo;
HTMLFunctional.getProjectInfo = HTMLFunctional.prototype.getProjectInfo;

HTMLFunctional.prototype.getPwUserInfo = getPwUserInfo;
HTMLFunctional.getPwUserInfo = HTMLFunctional.prototype.getPwUserInfo;

HTMLFunctional.prototype.toggleStyle = toggleStyle;
HTMLFunctional.toggleStyle = HTMLFunctional.prototype.toggleStyle;

HTMLFunctional.prototype.toggleAttr = toggleAttr;
HTMLFunctional.toggleAttr = HTMLFunctional.prototype.toggleAttr;

export
  default HTMLFunctional;
