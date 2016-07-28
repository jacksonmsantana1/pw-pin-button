'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _data = require('data.maybe');

var _data2 = _interopRequireDefault(_data);

var _data3 = require('data.either');

var _data4 = _interopRequireDefault(_data3);

var _typesafety = require('typesafety');

var _typesafety2 = _interopRequireDefault(_typesafety);

var _ioMonad = require('io-monad');

var _ioMonad2 = _interopRequireDefault(_ioMonad);

var _helpersPatchwork = require('helpers-patchwork');

var _helpersPatchwork2 = _interopRequireDefault(_helpersPatchwork);

var _cssClassList = require('css-class-list');

var _cssClassList2 = _interopRequireDefault(_cssClassList);

var _htmlFunctional = require('html-functional');

var _htmlFunctional2 = _interopRequireDefault(_htmlFunctional);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * A Component like a Pinterest 'Pin' button
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**************************Helpers****************************/

// Ramda.js
var compose = _ramda2.default.compose;
var get = _ramda2.default.prop;
var isNil = _ramda2.default.isNil;
var isEmpty = _ramda2.default.isEmpty;
var contain = _ramda2.default.contains;

// TypeSafety
var str = _typesafety2.default.str;

// Helpers
var map = _helpersPatchwork2.default.map;
var chain = _helpersPatchwork2.default.chain;
var eventClick = _helpersPatchwork2.default.eventClick;
var head = _helpersPatchwork2.default.head;
var second = _helpersPatchwork2.default.second;
var emitCustomEvent = _helpersPatchwork2.default.emitCustomEvent;
var createCustomEvent = _helpersPatchwork2.default.createCustomEvent;

// HTMLFunctional
var toggleAttr = _htmlFunctional2.default.toggleAttr;
var toggleStyle = _htmlFunctional2.default.toggleStyle;
var getShadowRoot = _htmlFunctional2.default.getShadowRoot;
var getChildNodes = _htmlFunctional2.default.getChildNodes;
var setInnerHTML = _htmlFunctional2.default.setInnerHTML;
var createShadowDom = _htmlFunctional2.default.createShadowDom;
var getPwProjectInfo = _htmlFunctional2.default.getPwProjectInfo;
var getPwUserInfo = _htmlFunctional2.default.getPwUserInfo;

/*********************************Class Helpers*******************************/

var VISIBLE_ATTR = ['false', 'true'];
var STATUS_ATTR = ['checked', 'not-checked'];

var projectId = Symbol('projectId');
var visible = Symbol('visible');
var status = Symbol('status');

var throwError = function throwError(msn) {
  throw new Error(msn);
};

// getDivLike :: PwPinButton -> Maybe(HTMLDivElement)
var getDivLike = compose(chain(second), chain(getChildNodes), chain(head), chain(getChildNodes), chain(getShadowRoot), _data2.default.fromNullable);

// toggleActive :: HTMLElement -> Maybe(IO)
var _toggleActive = compose(map(toggleStyle('active')), map(_cssClassList2.default), getDivLike);

var _this = void 0;
var pwUserInfo = void 0;
var pwProjectInfo = void 0;

var PwPinButton = function (_HTMLButtonElement) {
  _inherits(PwPinButton, _HTMLButtonElement);

  function PwPinButton() {
    _classCallCheck(this, PwPinButton);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PwPinButton).apply(this, arguments));
  }

  _createClass(PwPinButton, [{
    key: 'createdCallback',


    /*********************Inherited Methods****************************/

    /*
     * Initial function called when the pwPinButton is created
     */
    value: function createdCallback() {

      //Init
      /*eslint no-underscore-dangle:0*/
      _this = this;

      // Attributes declaration
      this[projectId] = 'VAITOMARNOCU';
      this[visible] = 'true';
      this[status] = 'not-checked';

      /*********************Pure Functions**********************/

      // template :: String
      var templateStyle = this.getTemplateHtml() + this.getTemplateStyle();

      /********************Impure Functions*********************/

      var impure = _ioMonad2.default.of(_this).map(createShadowDom).map(setInnerHTML(templateStyle));

      impure.runIO();
    }

    /*
     * Function called when the pwPinButton is attached to the DOM
     */

  }, {
    key: 'attachedCallback',
    value: function attachedCallback() {

      /********************Pure Functions*********************/

      // checkElement :: HTMLElement -> IO(_)
      var checkElement = function checkElement(elem) {
        return _ioMonad2.default.of(_this.toggleStatus());
      };

      // updateElement :: _ -> Promise
      //const updateElement = () => pwUserInfo.map(_this.isPinned)
      //  .orElse(throwError('PwUserInfo Component not found'));

      // setStatus :: String -> IO
      //const setStatus = IO.of(HTMLFunctional.setAttr(_this, 'checked'));

      // whenClicked :: HTMLElement -> ClickStreamEvent
      var whenClicked = compose(map(checkElement), map(get('target')), eventClick);

      /*********************Impure Functions**********************/

      // pwProjectInfo :: Either(PwProjectInfo, Error)
      pwProjectInfo = getPwProjectInfo(_this.projectId).runIO();

      // pwUserInfo :: Either(PwUserInfo, Error)
      pwUserInfo = getPwUserInfo.runIO();

      // Setting attributes
      _this.projectId = this[projectId];
      _this.visible = this[visible];

      // Updates the status attribute
      //updateElement
      //  .then(R.cond([
      //    [R.equal(true), setStatus('checked')],
      //    [R.equal(false), setStatus('not-checked')],
      //  ]))
      //  .runIO();

      whenClicked(_this).subscribe(function (elem) {
        if (_this.status === 'checked') {
          _this.pin(pwProjectInfo.get(), pwUserInfo.get());
        } else {
          _this.despin(pwProjectInfo.get(), pwUserInfo.get());
        }

        elem.runIO();
      });
    }

    /*
     * Function called when some attribute from the pwPinButton is changed
     */
    /*eslint no-unused-vars: 0*/

  }, {
    key: 'attributeChangedCallback',
    value: function attributeChangedCallback(attrName, oldValue, newValue) {
      if (attrName === 'status') {
        this.toggleActive().runIO();
      } else if (attrName === 'visible') {
        _this.style.display = newValue === 'false' ? 'none' : '';
      } else if (attrName === 'projectId') {
        _this.projectId = str(newValue);
      }
    }

    /*****************************Toggles*******************************/

    /**
     * This function toggles the pwPinButton attribute visible
     */

  }, {
    key: 'toggleVisible',
    value: function toggleVisible() {
      toggleAttr(_this, 'visible', VISIBLE_ATTR);
    }

    /**
     * This function toggles the pwPinButton attribute status
     */

  }, {
    key: 'toggleStatus',
    value: function toggleStatus() {
      toggleAttr(_this, 'status', STATUS_ATTR);
    }

    /**
     * This function toggles the class active style
     */

  }, {
    key: 'toggleActive',
    value: function toggleActive() {
      return _toggleActive(_this).get();
    }

    /*****************************Main Methods***************************/

    /**
     * Warn the other components when it's 'pin' (clicked)
     */

  }, {
    key: 'pin',
    value: function pin(_pwProjectInfo, _pwUserInfo) {
      var events = [];

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

      var evt1 = compose(_ioMonad2.default.of, emitCustomEvent(_pwProjectInfo), createCustomEvent('pin', { projectId: _this.projectId }));
      events.push(evt1(false, true));

      var evt2 = compose(_ioMonad2.default.of, emitCustomEvent(_pwUserInfo), createCustomEvent('pin', { projectId: _this.projectId }));
      events.push(evt2(false, true));

      return events;
    }

    /**
     * Warn the others components when it's 'des' pin
     */

  }, {
    key: 'despin',
    value: function despin(_pwProjectInfo, _pwUserInfo) {
      var events = [];

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

      var evt1 = compose(_ioMonad2.default.of, emitCustomEvent(_pwProjectInfo), createCustomEvent('despin', { projectId: _this.projectId }));
      events.push(evt1(false, true));

      var evt2 = compose(_ioMonad2.default.of, emitCustomEvent(_pwUserInfo), createCustomEvent('despin', { projectId: _this.projectId }));
      events.push(evt2(false, true));

      return events;
    }

    /**
     * Check the pwPinButton status
     */

  }, {
    key: 'isPinned',
    value: function isPinned(_pwUserInfo) {
      var pId = _this.projectId;
      return new Promise(function (resolve, reject) {
        if (isNil(_pwUserInfo)) {
          reject(new Error('pwUserInfo argument is null'));
        } else if (isEmpty(_pwUserInfo)) {
          reject(new Error('pwUserInfo argument is an empty object'));
        } else if (_pwUserInfo.constructor.name !== 'pw-user-info') {
          reject(new Error('pwUserInfo argument is from an invalid class'));
        }

        _pwUserInfo.isPinned(pId).then(resolve).catch(function (err) {
          return throwError(err.message);
        });
      });
    }

    /*************************Html and CSS*************************/

    // getTemplateHtml :: _ -> String

  }, {
    key: 'getTemplateHtml',
    value: function getTemplateHtml() {
      return str('<div class="like">\n              <button class="like-toggle">❤</button>\n            </div>');
    }

    // getTemplateStyle :: _ -> String

  }, {
    key: 'getTemplateStyle',
    value: function getTemplateStyle() {
      return str('<style>\n      *{transition: all 0.3s linear;}\n\n      .like {\n        font-family: \'Open Sans\';\n        display:inline-block;\n      }\n\n      .like-toggle {\n        outline:none;\n        box-shadow:none;\n        border: none;\n        width: 70px;\n        height: 100%;\n        font-size: 1em;\n        border-radius: 10px;\n        background: #eee;\n        color: #666;\n      }\n\n      .like-toggle:hover {\n        background: #ddd;\n      }\n\n      .active {\n        width: 95px;\n        background: #eee;\n        color: #F26D7D;\n      }\n\n      .active:hover {\n        background: #ddd;\n      }\n\n      .like-toggle.basic:not(.like-active):hover {\n        background: #ddd;\n      }\n    </style>');
    }

    /*************************Getters and Setters*************************/

    // GET projectId :: String

  }, {
    key: 'projectId',
    get: function get() {
      return str(this[projectId]);
    }

    // SET projectId :: String
    ,
    set: function set(pId) {
      this[projectId] = str(pId);
      this.setAttribute('projectId', str(pId));
    }

    // GET visible :: String

  }, {
    key: 'visible',
    get: function get() {
      return str(this[visible]);
    }

    // SET visible :: String
    ,
    set: function set(v) {
      if (!contain(v, VISIBLE_ATTR)) {
        throw new TypeError('Invalid values for the visible attribute');
      }

      this[visible] = str(v);
      this.setAttribute('visible', str(v));
    }

    // GET status :: String

  }, {
    key: 'status',
    get: function get() {
      return this[status];
    }

    // SET status :: String
    ,
    set: function set(st) {
      if (!contain(st, STATUS_ATTR)) {
        throw new TypeError('Invalid values for the status attribute');
      }

      this[status] = str(st);
      this.setAttribute('status', str(st));
    }
  }]);

  return PwPinButton;
}(HTMLButtonElement);

document.registerElement('pw-pin-button', PwPinButton);
exports.default = PwPinButton;
