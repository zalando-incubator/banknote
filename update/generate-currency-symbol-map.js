'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function (dataDir, outputFileName) {
    const map = {};
    const info = require(path.join(dataDir, 'en', 'currencies.json'));
    const data = info.main.en.numbers.currencies;
    Object.keys(data).forEach(function (currencyCode) {
        map[currencyCode] = data[currencyCode]['symbol-alt-narrow'];
    });

    var output = '\'use strict\';\n\nmodule.exports = ' + JSON.stringify(map, null, 4).replace(/"/g, '\'') + ';\n';
    fs.writeFileSync(outputFileName, output);
};
