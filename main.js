// const Scheme = require('./blocks/scheme');
// const Base = require('./blocks/simpleUnits');
import { Scheme } from './blocks/scheme.js';
import { Base } from './blocks/simpleUnits.js';

let scheme = new Scheme(0);

let schemeDiv = scheme.getDiv();
let schemeCnt = document.createElement('div');
schemeCnt.className = 'scheme-container';

schemeCnt.appendChild(schemeDiv);
document.body.appendChild(schemeCnt);