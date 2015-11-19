'use strict';

const path = require('path');
const fs = require('fs');

const LEFT_TO_RIGHT_MARK = '\u200e';
const CURRENCY_SYMBOL_VAR_NAME = 'symbol';
const AMOUNT_VAR_NAME = 'amount';
const MINUS_VAR_NAME = 'minus';

function transformPatternIntoJsExpression(pattern, patternType) {
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
    if (!hasCustomMinusPosition && patternType === 'implicitMinus') {
        parts.unshift(MINUS_VAR_NAME);
    }
    if (hasLeftToRightMark) {
        parts.unshift('\'' + LEFT_TO_RIGHT_MARK + '\'');
    }
    return parts.join(' + ');
}

function generateFunctionBody(positive, negative) {
    if (negative) {
        return 'return ' + MINUS_VAR_NAME + ' ? (' +
            transformPatternIntoJsExpression(positive) + ') : (' +
            transformPatternIntoJsExpression(negative, 'implicitMinus') + ');';
    } else {
        return 'return ' + transformPatternIntoJsExpression(positive, 'implicitMinus') + ';';
    }
}

module.exports = function (dataDir, outputFileName) {

    const functionCache = {};
    fs.readdirSync(dataDir).forEach(function (locale) {
        const info = require(path.join(dataDir, locale, 'numbers.json'));
        const pattern = info.main[locale].numbers['currencyFormats-numberSystem-latn'].standard;
        const positiveAndNegative = pattern.split(';');
        const functionBody = generateFunctionBody.apply(undefined, positiveAndNegative);

        if (functionCache[functionBody]) {
            functionCache[functionBody].push(locale);
        } else {
            functionCache[functionBody] = [locale];
        }


    });

    var result = '\'use strict\';\n\nvar positions = {};\n\n';

    Object.keys(functionCache).forEach(function (functionBody) {
        const locales = functionCache[functionBody];
        const exports = locales.map(function (locale) {
            return 'positions[\'' + locale + '\']';
        }).join(' = \n');
        result += exports +
            ' = function (' + CURRENCY_SYMBOL_VAR_NAME + ', ' + AMOUNT_VAR_NAME + ', ' + MINUS_VAR_NAME + ') {\n' +
            '    ' + functionBody + '\n};\n\n';
    });

    result += 'module.exports = locales;\n';

    fs.writeFileSync(outputFileName, result);
};
