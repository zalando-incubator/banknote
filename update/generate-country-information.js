'use strict';

const fs = require('fs');
const path = require('path');

module.exports = function (dataDir, outputFileName) {
    const map = {};
    require('country-data').countries.all.map(function (country) {
        // Since this data is used only when explicit currency is not set in
        // a formatting function, it's ok to use the first one as the default.
        map[country.alpha2] = country.currencies[0];
    });
    var output = '\'use strict\';\n\nmodule.exports = ' + JSON.stringify(map, null, 4).replace(/"/g, '\'') + ';\n';
    fs.writeFileSync(outputFileName, output);
};

