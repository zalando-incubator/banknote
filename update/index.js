#!/usr/bin/env node
'use strict';

const path = require('path');

console.info('[INFO] Fetching Unicode Locale Data...');
const cldrDataDir = require('./fetch-cldr')();

console.info('[INFO] Transforming Locale Data...');
require('./generate-position-functions')(cldrDataDir, path.join(__dirname, '..', 'data', 'positions.js'));

