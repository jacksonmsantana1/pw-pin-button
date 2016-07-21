import 'babel-polyfill';
import '../src/pw-pin-button/pw-pin-button.js';

var expect = require('chai').expect;
var sinon = require('sinon');

describe('Attributes => ', () => {
    let pwPinButton;

    beforeEach(() => {
      pwPinButton = document.createElement('pw-pin-button');
      document.body.appendChild(pwPinButton);
    });

    afterEach(() => {
      document.body.removeChild(pwPinButton);
    });

    it('Component must be invisible when the attr visible=false', () => {
      pwPinButton.toggleVisible();

      expect(pwPinButton.visible).to.be.equal('false');
      expect(pwPinButton.style.display).to.be.equal('none');
    });

    it('Component must be visible when the attr visible=true', () => {
      expect(pwPinButton.style.display).to.be.equal('');
      expect(pwPinButton.visible).to.be.equal('true');
    });

    it('Component must have a property status: not-checked', () => {
      expect(pwPinButton.status).to.be.equal('not-checked');
    });

    it('Component must have a property status: checked', () => {
      pwPinButton.toggleStatus();
      expect(pwPinButton.status).to.be.equal('checked');
    });
  });

describe('When the pwPinButton is liked it ', () => {
    let pwPinButton;
    let pwProjectInfo;
    let pwUserInfo;

    let spy;
    let event;

    before(() => {
      document.registerElement('pw-project-info', {
        prototype: Object.create(HTMLElement.prototype)
      });

      document.registerElement('pw-user-info', {
        prototype: Object.create(HTMLElement.prototype)
      });
    });

    beforeEach(() => {
      pwUserInfo = document.createElement('pw-user-info');
      pwProjectInfo = document.createElement('pw-project-info');
      pwPinButton = document.createElement('pw-pin-button');

      pwProjectInfo.id = 'VAITOMARNOCU';

      document.body.appendChild(pwUserInfo);
      document.body.appendChild(pwProjectInfo);
      document.body.appendChild(pwPinButton);
    });

    afterEach(() => {
      document.body.removeChild(pwPinButton);
      document.body.removeChild(pwProjectInfo);
      document.body.removeChild(pwUserInfo);

      sinon.restore();
    });

    it('Should call the pin() method', (done) => {
      spy = sinon.spy(pwPinButton, 'pin');
      event = new MouseEvent('click');

      pwPinButton.dispatchEvent(event);

      setTimeout(() => {
        expect(spy.called).to.be.equal(true);
        expect(spy.args[0][0]).to.be.equal(pwProjectInfo);
        expect(spy.args[0][1]).to.be.equal(pwUserInfo);

        done();
      }, 100);
    });

    it('Should the pin() method receive a not null pw-project-info pwPinButton', () => {
      expect(pwPinButton.pin(null, null).message).to.be.equal('pwProjectInfo argument is null');
    });

    it('Should the pin() method receive a not empty pw-project-info pwPinButton', () => {
      expect(pwPinButton.pin({}, {}).message).to.be.equal('pwProjectInfo argument is an empty object');
    });

    it('Should the pin() method receive a pw-project-info Object', () => {
      expect(pwPinButton.pin('STRING', pwUserInfo).message).to.be.equal('pwProjectInfo argument is from an invalid class');
    });

    it('Should the pin() method receive a pw-project-info with the same ID', () => {
      pwProjectInfo.id = 'WRONG';
      expect(pwPinButton.pin(pwProjectInfo, pwUserInfo).message).to.be.equal('Invalid project id');
    });

    it('Should the pin() method receive a not null pw-user-info pwPinButton', () => {
      expect(pwPinButton.pin(pwProjectInfo, null).message).to.be.equal('pwUserInfo argument is null');
    });

    it('Should the pin() method receive a not empty pw-user-info pwPinButton', () => {
      expect(pwPinButton.pin(pwProjectInfo, {}).message).to.be.equal('pwUserInfo argument is an empty object');
    });

    it('Should the pin() method receive a valid pw-user-info object', () => {
      expect(pwPinButton.pin(pwProjectInfo, 'STRING').message).to.be.equal('pwUserInfo argument is from an invalid class');
    });

    it('Should the pin() method return an Array of IOs', () => {
      expect(pwPinButton.pin(pwProjectInfo, pwUserInfo).constructor.name).to.be.equal('Array');
      expect(pwPinButton.pin(pwProjectInfo, pwUserInfo)[0].constructor.name).to.be.equal('IO');
      expect(pwPinButton.pin(pwProjectInfo, pwUserInfo)[1].constructor.name).to.be.equal('IO');
    });

    it('Should after emit a CustomEvent to the pw-project-info', (done) => {
      event = new MouseEvent('click');

      pwProjectInfo.addEventListener('pin', (evt) => {
        expect(evt.type).to.be.equal('pin');
        expect(evt.detail.projectId).to.be.equal('VAITOMARNOCU');

        done();
      });

      pwPinButton.dispatchEvent(event);
    });

    it('Should after emit a CustomEvent to the pw-user-info', (done) => {
      event = new MouseEvent('click');

      pwUserInfo.addEventListener('pin', (evt) => {
        expect(evt.type).to.be.equal('pin');
        expect(evt.detail.projectId).to.be.equal('VAITOMARNOCU');

        done();
      });

      pwPinButton.dispatchEvent(event);
    });
  });

describe('When the pwPinButton is disliked it ', () => {
  let pwPinButton;
  let pwProjectInfo;
  let pwUserInfo;

  let spy;
  let event;

  beforeEach(() => {
    pwProjectInfo = document.createElement('pw-project-info');
    pwUserInfo = document.createElement('pw-user-info');
    pwPinButton = document.createElement('pw-pin-button');

    pwProjectInfo.status = 'not-checked';
    pwProjectInfo.id = 'VAITOMARNOCU';

    document.body.appendChild(pwProjectInfo);
    document.body.appendChild(pwUserInfo);
    document.body.appendChild(pwPinButton);
  });

  afterEach(() => {
    document.body.removeChild(pwPinButton);
    document.body.removeChild(pwProjectInfo);
    document.body.removeChild(pwUserInfo);

    sinon.restore();
  });

  it('Should call the despin() method', (done) => {
    spy = sinon.spy(pwPinButton, 'despin');
    event = new MouseEvent('click');

    setTimeout(() => {
      expect(spy.called).to.be.equal(true);
      expect(spy.args[0][0]).to.be.equal(pwProjectInfo);
      expect(spy.args[0][1]).to.be.equal(pwUserInfo);

      done();
    }, 200);

    pwPinButton.toggleStatus();
    pwPinButton.dispatchEvent(event);
  });

  it('Should the despin() method receive a not null pw-project-info pwPinButton', () => {
    expect(pwPinButton.despin(null, null).message).to.be.equal('pwProjectInfo argument is null');
  });

  it('Should the despin() method receive a not empty pw-project-info pwPinButton', () => {
    expect(pwPinButton.despin({}, {}).message).to.be.equal('pwProjectInfo argument is an empty object');
  });

  it('Should the despin() method receive a valid pw-project-info object', () => {
    expect(pwPinButton.despin(pwUserInfo, pwProjectInfo).message).to.be.equal('pwProjectInfo argument is from an invalid class');
  });

  it('Should the despin() method receive a valid pw-project-info pwPinButton', () => {
    pwProjectInfo.id = 'WRONG';
    expect(pwPinButton.despin(pwProjectInfo, pwUserInfo).message).to.be.equal('Invalid project id');
  });

  it('Should the despin() method receive a not null pw-user-info pwPinButton', () => {
    expect(pwPinButton.despin(pwProjectInfo, null).message).to.be.equal('pwUserInfo argument is null');
  });

  it('Should the despin() method receive a not empty pw-user-info pwPinButton', () => {
    expect(pwPinButton.despin(pwProjectInfo, {}).message).to.be.equal('pwUserInfo argument is an empty object');
  });

  it('Should the despin() method receive a valid pw-user-info object', () => {
    expect(pwPinButton.despin(pwProjectInfo, pwPinButton).message).to.be.equal('pwUserInfo argument is from an invalid class');
  });

  it('Should the despin() method return an Array of IOs', () => {
    expect(pwPinButton.despin(pwProjectInfo, pwUserInfo).constructor.name).to.be.equal('Array');
    expect(pwPinButton.despin(pwProjectInfo, pwUserInfo)[0].constructor.name).to.be.equal('IO');
    expect(pwPinButton.despin(pwProjectInfo, pwUserInfo)[1].constructor.name).to.be.equal('IO');
  });

  it('Should after emit a CustomEvent to the pw-project-info', (done) => {
    event = new MouseEvent('click');
    pwProjectInfo.addEventListener('despin', (evt) => {
      expect(evt.type).to.be.equal('despin');
      expect(evt.detail.projectId).to.be.equal('VAITOMARNOCU');

      done();
    });

    pwPinButton.toggleStatus();
    pwPinButton.dispatchEvent(event);
  });

  it('Should after emit a CustomEvent to the pw-user-info', (done) => {
    event = new MouseEvent('click');

    pwUserInfo.addEventListener('despin', (evt) => {
      expect(evt.type).to.be.equal('despin');
      expect(evt.detail.projectId).to.be.equal('VAITOMARNOCU');

      done();
    });

    pwPinButton.toggleStatus();
    pwPinButton.dispatchEvent(event);
  });
});