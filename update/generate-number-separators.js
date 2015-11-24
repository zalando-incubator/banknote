'use strict';

const path = require('path');
const fs = require('fs');

module.exports = function (dataDir, outputFileName) {

    const ruleCache = {};
    fs.readdirSync(dataDir).forEach(function (locale) {
        const info = require(path.join(dataDir, locale, 'numbers.json'));
        const rules = info.main[locale].numbers['symbols-numberSystem-latn'];
        const key = rules.decimal + rules.group;
        const language = locale.match(/^([a-zA-Z]{2,4})[-_]?/)[1];
        if (ruleCache[key]) {
            if (ruleCache[key].indexOf(language) === -1) {
                ruleCache[key].push(locale);
            }
        } else {
            ruleCache[key] = [locale];
        }
        if (key.length !== 2) {
            console.warn('[WARN] Locale ' + locale + ' has a number separator bigger than 1 code point');
        }
    });

    var output = '\'use strict\';\n\nvar separators = {};\n\n';

    Object.keys(ruleCache).forEach(function (separatorPair) {
        const locales = ruleCache[separatorPair];
        const exports = locales.map(function (locale) {
            return 'separators[\'' + locale + '\']';
        }).join(' = \n');
        output += exports + ' = \'' + separatorPair.replace('\'', '\\\'') + '\';\n\n';
    });

    output += 'module.exports = separators;\n';
    fs.writeFileSync(outputFileName, output);
};
