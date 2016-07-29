// jscs:disable
/**
 * A Component like a Pinterest 'Pin' button
 */

import R from 'ramda';
import Maybe from 'data.maybe';
import Either from 'data.either';
import TypeSafety from 'typesafety';
import IO from 'io-monad';
import Helpers from 'helpers-patchwork';
import ClassList from 'css-class-list';
import HTMLFunctional from 'html-functional';
// jscs:disable

/**************************Helpers****************************/

// Ramda.js
const compose = R.compose;
const get = R.prop;
const isNil = R.isNil;
const isEmpty = R.isEmpty;
const contain = R.contains;
const map = R.map;
const chain = R.chain;

// TypeSafety
const str = TypeSafety.str;

// Helpers
const eventClick = Helpers.eventClick;
const head = Helpers.head;
const second = Helpers.second;
const emitCustomEvent = Helpers.emitCustomEvent;
const createCustomEvent = Helpers.createCustomEvent;

// HTMLFunctional
const toggleAttr = HTMLFunctional.toggleAttr;
const toggleStyle = HTMLFunctional.toggleStyle;
const getShadowRoot = HTMLFunctional.getShadowRoot;
const getChildNodes = HTMLFunctional.getChildNodes;
const setInnerHTML = HTMLFunctional.setInnerHTML;
const createShadowDom = HTMLFunctional.createShadowDom;
const getPwProjectInfo = HTMLFunctional.getPwProjectInfo;
const getPwUserInfo = HTMLFunctional.getPwUserInfo;

/*********************************Class Helpers*******************************/

const VISIBLE_ATTR = ['false', 'true'];
const STATUS_ATTR = ['checked', 'not-checked'];

const projectId = Symbol('projectId');
const visible = Symbol('visible');
const status = Symbol('status');

const throwError = (msn) => { throw new Error(msn); };

// getDivLike :: PwPinButton -> Maybe(HTMLDivElement)
const getDivLike = compose(chain(second), chain(getChildNodes),
  chain(head), chain(getChildNodes),
  chain(getShadowRoot), Maybe.fromNullable);

// toggleActive :: HTMLElement -> Maybe(IO)
const toggleActive = compose(map(toggleStyle('active')), map(ClassList), getDivLike);

let _this;
let pwUserInfo;
let pwProjectInfo;

class PwPinButton extends HTMLButtonElement {

  /*********************Inherited Methods****************************/

  /*
   * Initial function called when the pwPinButton is created
   */
  createdCallback() {

    //Init
    /*eslint no-underscore-dangle:0*/
    _this = this;

    // Attributes declaration
    this[projectId] = 'VAITOMARNOCU';
    this[visible] = 'true';
    this[status] = 'not-checked';

    /*********************Pure Functions**********************/

    // template :: String
    const templateStyle = this.getTemplateHtml() + this.getTemplateStyle();

    /********************Impure Functions*********************/

    const impure = IO.of(_this)
      .map(createShadowDom)
      .map(setInnerHTML(templateStyle));

    impure.runIO();
  }

  /*
   * Function called when the pwPinButton is attached to the DOM
   */
  attachedCallback() {

    // pwProjectInfo :: Either(PwProjectInfo, Error)
    pwProjectInfo = getPwProjectInfo(_this.projectId).runIO();

    // pwUserInfo :: Either(PwUserInfo, Error)
    pwUserInfo = getPwUserInfo.runIO();

    // Setting attributes
    _this.projectId = this[projectId];
    _this.visible = this[visible];

    /********************Pure Functions*********************/

    // toggleStatus :: HTMLElement -> IO
    const toggleStatus = (elem) => (IO.of(_this.toggleStatus()));

    // setStatus :: String -> IO
    const setStatus = HTMLFunctional.setAttr(_this, 'status');

    // checkElement :: Boolean -> _
    const checkElement = (isChecked) => R.cond([
      [R.equals(true, isChecked), setStatus('checked').runIO()], //IO
      [R.equals(false, isChecked), setStatus('not-checked').runIO()], //IO
    ]);

    // pinOrDespin :: IO -> _
    const pinOrDespin = (impure) => {
      if (_this.status === 'checked') {
        _this.pin(pwProjectInfo.get(), pwUserInfo.get());
      } else {
        _this.despin(pwProjectInfo.get(), pwUserInfo.get());
      }

      impure.runIO(); //IO
    };

    // onInit :: Either(PwUserInfo) -> Promise(Boolean, Error)
    const onInit = (_pwUserInfo) => _this.isPinned(_pwUserInfo.get());

    // onClick :: HTMLElement -> ClickStreamEvent
    const onClick = compose(map(toggleStatus), map(get('target')), eventClick);

    /*********************Impure Functions**********************/

    // Updates the status attribute
    onInit(pwUserInfo).then(checkElement);

    onClick(_this).subscribe(pinOrDespin);
  }

  /*
   * Function called when some attribute from the pwPinButton is changed
   */
  /*eslint no-unused-vars: 0*/
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'status') {
      this.toggleActive().runIO();
    } else if (attrName === 'visible') {
      _this.style.display = (newValue === 'false') ? 'none' : '';
    } else if (attrName === 'projectId') {
      _this.projectId = str(newValue);
    }
  }

  /*****************************Toggles*******************************/

  /**
   * This function toggles the pwPinButton attribute visible
   */
  toggleVisible() {
    toggleAttr(_this, 'visible', VISIBLE_ATTR);
  }

  /**
   * This function toggles the pwPinButton attribute status
   */
  toggleStatus() {
    toggleAttr(_this, 'status', STATUS_ATTR);
  }

  /**
   * This function toggles the class active style
   */
  toggleActive() {
    return toggleActive(_this).get();
  }

  /*****************************Main Methods***************************/

  /**
   * Warn the other components when it's 'pin' (clicked)
   */
  pin(_pwProjectInfo, _pwUserInfo) {
    const events = [];

    if (isNil(_pwProjectInfo)) {
      return new Error('pwProjectInfo argument is null');
    } else if (isEmpty(_pwProjectInfo)) {
      return new Error('pwProjectInfo argument is an empty object');
    } else if (_pwProjectInfo.constructor.name !== 'pw-project-info') {
      return new Error('pwProjectInfo argument is from an invalid class');
    } else if (_pwProjectInfo.id !== _this.projectId) {
      return new Error('Invalid project id');
    }

    if (isNil(_pwUserInfo)) {
      return new Error('pwUserInfo argument is null');
    } else if (isEmpty(_pwUserInfo)) {
      return new Error('pwUserInfo argument is an empty object');
    } else if (_pwUserInfo.constructor.name !== 'pw-user-info') {
      return new Error('pwUserInfo argument is from an invalid class');
    }

    const evt1 = compose(IO.of, emitCustomEvent(_pwProjectInfo),
      createCustomEvent('pin', { projectId: _this.projectId }));
    events.push(evt1(false, true));

    const evt2 = compose(IO.of, emitCustomEvent(_pwUserInfo),
      createCustomEvent('pin', { projectId: _this.projectId }));
    events.push(evt2(false, true));

    return events;
  }

  /**
   * Warn the others components when it's 'des' pin
   */
  despin(_pwProjectInfo, _pwUserInfo) {
    const events = [];

    if (isNil(_pwProjectInfo)) {
      return new Error('pwProjectInfo argument is null');
    } else if (isEmpty(_pwProjectInfo)) {
      return new Error('pwProjectInfo argument is an empty object');
    } else if (_pwProjectInfo.constructor.name !== 'pw-project-info') {
      return new Error('pwProjectInfo argument is from an invalid class');
    } else if (_pwProjectInfo.id !== _this.projectId) {
      return new Error('Invalid project id');
    }

    if (isNil(_pwUserInfo)) {
      return new Error('pwUserInfo argument is null');
    } else if (isEmpty(_pwUserInfo)) {
      return new Error('pwUserInfo argument is an empty object');
    } else if (_pwUserInfo.constructor.name !== 'pw-user-info') {
      return new Error('pwUserInfo argument is from an invalid class');
    }

    const evt1 = compose(IO.of, emitCustomEvent(_pwProjectInfo),
      createCustomEvent('despin', { projectId: _this.projectId }));
    events.push(evt1(false, true));

    const evt2 = compose(IO.of, emitCustomEvent(_pwUserInfo),
      createCustomEvent('despin', { projectId: _this.projectId }));
    events.push(evt2(false, true));

    return events;
  }

  /**
   * Check the pwPinButton status
   */
  isPinned(_pwUserInfo) {
    const pId = _this.projectId;
    return new Promise((resolve, reject) => {
      if (isNil(_pwUserInfo)) {
        reject(new Error('pwUserInfo argument is null'));
      } else if (isEmpty(_pwUserInfo)) {
        reject(new Error('pwUserInfo argument is an empty object'));
      } else if (_pwUserInfo.constructor.name !== 'pw-user-info') {
        reject(new Error('pwUserInfo argument is from an invalid class'));
      }

      _pwUserInfo.isPinned(pId)
        .then(resolve)
        .catch((err) => throwError(err.message));
    });
  }

  /*************************Html and CSS*************************/

  // getTemplateHtml :: _ -> String
  getTemplateHtml() {
    return str(`<div class="like">
              <button class="like-toggle">❤</button>
            </div>`);
  }

  // getTemplateStyle :: _ -> String
  getTemplateStyle() {
    return str(`<style>
      *{transition: all 0.3s linear;}

      .like {
        font-family: 'Open Sans';
        display:inline-block;
      }

      .like-toggle {
        outline:none;
        box-shadow:none;
        border: none;
        width: 70px;
        height: 100%;
        font-size: 1em;
        border-radius: 10px;
        background: #eee;
        color: #666;
      }

      .like-toggle:hover {
        background: #ddd;
      }

      .active {
        width: 95px;
        background: #eee;
        color: #F26D7D;
      }

      .active:hover {
        background: #ddd;
      }

      .like-toggle.basic:not(.like-active):hover {
        background: #ddd;
      }
    </style>`);
  }

  /*************************Getters and Setters*************************/

  // GET projectId :: String
  get projectId() {
    return str(this[projectId]);
  }

  // SET projectId :: String
  set projectId(pId) {
    this[projectId] = str(pId);
    this.setAttribute('projectId', str(pId));
  }

  // GET visible :: String
  get visible() {
    return str(this[visible]);
  }

  // SET visible :: String
  set visible(v) {
    if (!contain(v, VISIBLE_ATTR)) {
      throw new TypeError('Invalid values for the visible attribute');
    }

    this[visible] = str(v);
    this.setAttribute('visible', str(v));
  }

  // GET status :: String
  get status() {
    return this[status];
  }

  // SET status :: String
  set status(st) {
    if (!contain(st, STATUS_ATTR)) {
      throw new TypeError('Invalid values for the status attribute');
    }

    this[status] = str(st);
    this.setAttribute('status', str(st));
  }
}

document.registerElement('pw-pin-button', PwPinButton);
export
  default PwPinButton;

