#!/usr/bin/env node
'use strict';

const path = require('path');

console.info('[INFO] Fetching Unicode Locale Data...');
const cldrDataDir = require('./fetch-cldr')();

console.info('[INFO] Generating Positioning Functions...');
require('./generate-position-functions')(cldrDataDir, path.join(__dirname, '..', 'data', 'positions.js'));

console.info('[INFO] Generating Currency Symbol Map...');
require('./generate-currency-symbol-map')(cldrDataDir, path.join(__dirname, '..', 'data', 'symbol-map.js'));
