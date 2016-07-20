import { expect } from 'chai';
import 'babel-polyfill';
import '../src/pw-pin-button/pw-pin-button.js';

describe('pw-pin-button => ', () => {
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
