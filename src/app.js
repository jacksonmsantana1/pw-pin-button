import debug from 'debug';
/*eslint no-unused-vars:0*/
import PwPinButton from './pw-pin-button/pw-pin-button';

const log = debug('PwPinButton://');

log('creating pwPinButton');
const pwPinButton = document.createElement('pw-pin-button');

log('adding it to the body');
document.body.appendChild(pwPinButton);

log('pwPinButton created!');

