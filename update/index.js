#!/usr/bin/env node
'use strict';

const path = require('path');

console.info('[INFO] Installing necessary NPM modules...');
const cldrDataDir = require('./fetch-npm-modules')();

console.info('[INFO] Generating Positioning Functions...');
require('./generate-position-functions')(cldrDataDir, path.join(__dirname, '..', 'data', 'positions.js'));

console.info('[INFO] Generating Number Separator Map...');
require('./generate-number-separators')(cldrDataDir, path.join(__dirname, '..', 'data', 'separators.js'));

console.info('[INFO] Generating Currency Symbol Map...');
require('./generate-currency-symbol-map')(cldrDataDir, path.join(__dirname, '..', 'data', 'symbol-map.js'));

console.info('[INFO] Generating Country Information...');
require('./generate-country-information')(cldrDataDir, path.join(__dirname, '..', 'data', 'country-info.js'));
