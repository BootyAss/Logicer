// const Scheme = require('./blocks/scheme');
// const Base = require('./blocks/simpleUnits');
import { Scheme } from './blocks/scheme.js';
import { Registry } from './blocks/registry.js';
import { Unit } from './blocks/unit.js';
import { Base } from './blocks/simpleUnits.js';
import { Sets } from './settings.js';
let AddUnit = new Unit(0, Base.ADD, 'ADD');
let NotUnit = new Unit(0, Base.NOT, 'NOT');
//      BLOCKS CONTAINER    //
// Create Blocks Container
let blocksCnt = document.createElement('div');
blocksCnt.className = 'container';
// Set Blocks Container Sizes
Sets.container.WIDTH = (Sets.client.WIDTH * Sets.container.X_PERC / 100);
Sets.container.HEIGHT = (Sets.client.HEIGHT * Sets.container.Y_PERC / 100);
blocksCnt.style.width = Sets.container.WIDTH + 'px';
blocksCnt.style.height = Sets.container.HEIGHT + 'px';
// Set Blocks Container Positions
Sets.container.LEFT = (Sets.client.WIDTH - Sets.container.WIDTH) / 2;
Sets.container.TOP = (Sets.client.HEIGHT - Sets.container.HEIGHT) / 2;
blocksCnt.style.left = Sets.container.LEFT + 'px';
blocksCnt.style.top = Sets.container.TOP + 'px';
//      SCHEME              //
// Calculate Scheme Size
Sets.scheme.WIDTH = (Sets.container.WIDTH * Sets.scheme.X_PERC / 100) - Sets.scheme.BORDER_WIDTH * 2;
Sets.scheme.HEIGHT = (Sets.container.HEIGHT * Sets.scheme.Y_PERC / 100) - Sets.scheme.BORDER_WIDTH * 2;
//      SCHEME SVG (lines)  //
let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute('width', Sets.scheme.WIDTH + 'px');
svg.setAttribute('height', Sets.scheme.HEIGHT + 'px');
// Create Scheme
let scheme = new Scheme(0, svg);
let schemeDiv = scheme.getDiv();
scheme.unitToAdd = AddUnit;
//      REGISTRY            //
let registry = new Registry(0);
let registryDiv = registry.getDiv();
// Calculate Registry Size
Sets.registry.WIDTH = (Sets.container.WIDTH * Sets.registry.X_PERC / 100) - Sets.registry.BORDER_WIDTH * 2;
Sets.registry.HEIGHT = (Sets.container.HEIGHT * Sets.registry.Y_PERC / 100) - Sets.registry.BORDER_WIDTH * 2;
registryDiv.style.top = Sets.scheme.HEIGHT + Sets.scheme.BORDER_WIDTH * 2 + 'px';
registryDiv.style.width = Sets.registry.WIDTH + 'px';
registryDiv.style.height = Sets.registry.HEIGHT + 'px';
registryDiv.style.borderWidth = Sets.registry.BORDER_WIDTH + 'px';
registryDiv.style.borderRadius = Sets.registry.BORDER_RADIUS + 'px';
let saveAsUnit = () => {
    let newUnit = scheme.saveAsUnit('temp');
    scheme.unitToAdd = newUnit;
};
let btnSave = document.getElementById('BS');
btnSave.onclick = saveAsUnit;
//  Show all elements
blocksCnt.appendChild(schemeDiv);
blocksCnt.appendChild(registryDiv);
document.body.appendChild(blocksCnt);
