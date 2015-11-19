'use strict';

const path = require('path');
const childProcess = require('child_process');
const ROOT_DIR = path.normalize(path.join(__dirname, '..'));
const CLDR_DATA_DIR = path.join(ROOT_DIR, 'node_modules', 'cldr-data', 'main');

module.exports = function () {
    childProcess.execSync('npm i cldr-data --progress false', { cwd: ROOT_DIR });
    return CLDR_DATA_DIR;
};
