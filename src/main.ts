// const Scheme = require('./blocks/scheme');
// const Base = require('./blocks/simpleUnits');
import { Scheme } from './blocks/scheme';
import { Base } from './blocks/simpleUnits';
import { Sets } from './settings';


let scheme = new Scheme(0);
let schemeDiv = scheme.getDiv();

let schemeCnt = document.createElement('div');
schemeCnt.className = 'container';
schemeCnt.style.width = (Sets.client.WIDTH * Sets.container.X_PERC / 100) + 'px';
schemeCnt.style.height = (Sets.client.HEIGHT * Sets.container.Y_PERC / 100) + 'px';

schemeCnt.style.margin = '0 auto';
Sets.container.MARGIN_X = schemeCnt.offsetLeft;
Sets.container.MARGIN_Y = schemeCnt.offsetTop;


schemeCnt.appendChild(schemeDiv);
document.body.appendChild(schemeCnt);

console.log(Sets)