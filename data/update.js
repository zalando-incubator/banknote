#!/usr/bin/env node
'use strict';

const path = require('path');
const childProcess = require('child_process');
const fs = require('fs');

const LEFT_TO_RIGHT_MARK = '\u200e';
const ROOT_DIR = path.normalize(path.join(__dirname, '..'));
const CLDR_DATA_DIR = path.join(ROOT_DIR, 'node_modules', 'cldr-data', 'main');
const CURRENCY_SYMBOL_VAR_NAME = 'symbol';
const AMOUNT_VAR_NAME = 'amount';
const MINUS_VAR_NAME = 'minus';

function transformPatternIntoJsExpression(pattern) {
    var hasCustomMinusPosition = false;
    var hasLeftToRightMark = false;
    var parts = [];
    pattern.replace(/(\u00a4)|(-)|([#0.,]+)|([^\u00a4#0.,-]+)/g, function (part, symbol, minus, amount, rest) {
        if (symbol) {
            parts.push(CURRENCY_SYMBOL_VAR_NAME);
        } else if (minus) {
            hasCustomMinusPosition = true;
            parts.push(MINUS_VAR_NAME);
        } else if (amount) {
            parts.push(AMOUNT_VAR_NAME);
        } else if (rest && rest.length) {
            if (rest === LEFT_TO_RIGHT_MARK) {
                hasLeftToRightMark = true;
            } else {
                parts.push('\'' + rest + '\'');
            }
        }
        return parts;
    });
    if (!hasCustomMinusPosition) {
        parts.unshift(MINUS_VAR_NAME);
    }
    if (hasLeftToRightMark) {
        parts.unshift('\'' + LEFT_TO_RIGHT_MARK + '\'');
    }
    return parts.join(' + ');
    //var code;
    //if (pattern.match(REGEX_START_SPACE)) {
    //    const match = pattern.match(REGEX_START_SPACE);
    //    const leftToRightMark = (match[1] ? '\'\\u200e\' + ' : '');
    //    const possibleSpaceAndMinus = match[2] ? ' + \'' + match[2] + '\'' : '';
    //    code = leftToRightMark + CURRENCY_SYMBOL_VAR_NAME + possibleSpaceAndMinus + ' + ' + AMOUNT_VAR_NAME;
    //} else {
    //    const match = pattern.match(REGEX_END_SPACE);
    //    const possibleSpace = match[1] ? '\'' + match[1] + '\' + ' : '';
    //    code = AMOUNT_VAR_NAME + ' + ' + possibleSpace + CURRENCY_SYMBOL_VAR_NAME;
    //}
    //if (code.indexOf('-') > 0) {
    //    return code.replace('-', '\' + ' + MINUS_VAR_NAME + ' + \'');
    //} else {
    //    return MINUS_VAR_NAME + ' + ' + code;
    //}
}

function generateFunctionBody(positive, negative) {
    if (negative) {
        return 'return ' + MINUS_VAR_NAME + ' ? (' +
            transformPatternIntoJsExpression(positive) + ') : (' +
            transformPatternIntoJsExpression(negative) + ');';
    } else {
        return 'return ' + transformPatternIntoJsExpression(positive) + ';';
    }
}


console.info('[INFO] Fetching Unicode Locale Data...');
//childProcess.execSync('npm i cldr-data --progress false', { cwd: ROOT_DIR });

console.info('[INFO] Transforming Locale Data...');
const functionCache = {};
fs.readdirSync(CLDR_DATA_DIR).forEach(function (locale) {
    const info = require(path.join(CLDR_DATA_DIR, locale, 'numbers.json'));
    const pattern = info.main[locale].numbers['currencyFormats-numberSystem-latn'].standard;
    const positiveAndNegative = pattern.split(';');
    const functionBody = generateFunctionBody.apply(undefined, positiveAndNegative);

    if (functionCache[functionBody]) {
        functionCache[functionBody].push(locale);
    } else {
        functionCache[functionBody] = [locale];
    }


});

var result = '\'use strict\';\n\nvar locales = {};\n\n';

Object.keys(functionCache).forEach(function (functionBody) {
    const locales = functionCache[functionBody];
    const exports = locales.map(function (locale) {
        return 'locales[\'' + locale + '\']';
    }).join(' = \n');
    result += exports +
        ' = function (' + CURRENCY_SYMBOL_VAR_NAME + ', ' + AMOUNT_VAR_NAME + ', ' + MINUS_VAR_NAME + ') {\n' +
        '    ' + functionBody + '\n};\n\n';
});

result += 'module.exports = locales;\n';

fs.writeFileSync(path.join(__dirname, 'locale.js'), result);
