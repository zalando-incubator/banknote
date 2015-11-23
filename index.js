/*!
 Copyright (c) 2015 Zalando SE

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

'use strict';

var countryCurrencyMap = require('./data/country-currency');
var currencySymbolMap = require('./data/symbol-map');
var localeSeparatorsMap = require('./data/separators');
var localePositionersMap = require('./data/positions');

var THOUSAND_MATCHER = /\B(?=(\d{3})+(?!\d))/g;
var LOCALE_MATCHER = /^\s*([a-zA-Z]{2,4})(?:[-_][a-zA-Z]{4})?(?:[-_]([a-zA-Z]{2}|\d{3}))?\s*(?:$|[-_])/;
var LOCALE_LANGUAGE = 1;
var LOCALE_REGION = 2;

function error(message) {
    throw new Error(message);
}

/**
 * @param {string} locale
 * @param {Array<string>} localeParts
 * @returns {string}
 */
function findEffectiveLocale(locale, localeParts) {
    if (locale in localePositionersMap) {
        return locale;
    } else if ((locale = localeParts[LOCALE_LANGUAGE] + '-' + localeParts[LOCALE_REGION]) in localePositionersMap) {
        return locale;
    } else if ((locale = localeParts[LOCALE_LANGUAGE]) in localePositionersMap) {
        return locale;
    } else {
        error('Could not find info for locale "' + locale + '"');
    }
}

/**
 * @param {string} region
 * @returns {string}
 */
function getCurrencyFromRegion(region) {
    var currencyCode = countryCurrencyMap[region];
    if (!currencyCode) {
        error('Could not find default currency for locale region "' + region + '". Please provide explicit currency.');
    }
    return currencyCode;
}

/**
 * @typedef {{
 *     showDecimalIfWhole: boolean,
 *     subunitsPerUnit: number,
 *     effectiveLocale: string,
 *     currencyCode: string,
 *     currencySymbol: string,
 *     currencyFormatter: function,
 *     thousandSeparator: string,
 *     decimalSeparator: string
 * }} BanknoteFormatting
 */

/**
 * This function tries hard to figure out full set formatting options necessary to format money.
 * If the locale is valid and contains are territory that is also a valid ISO3166-1-Alpha-2 country
 * code (e.g. en-US), then the default currency for that country is taken. Otherwise you have to
 * provide an explicit currency code.
 * @throws Error thrown if the lookup of formatting rules has failed.
 * @param {string} locale a BCP47 locale string
 * @param {string=} currencyCode explicit currency code for for the currency symbol lookup
 * @returns {BanknoteFormatting}
 */
exports.formattingForLocale = function (locale, currencyCode) {
    var localeParts = locale.match(LOCALE_MATCHER);

    if (!localeParts) {
        error('Locale provided does not conform to BCP47.');
    }

    currencyCode = currencyCode || getCurrencyFromRegion(localeParts[LOCALE_REGION]);
    var effectiveLocale = findEffectiveLocale(locale, localeParts);
    var separators = localeSeparatorsMap[effectiveLocale];

    return {
        showDecimalIfWhole: true,
        subunitsPerUnit: 100, // TODO change 100 with real information
        currencyCode: currencyCode,
        currencySymbol: currencySymbolMap[currencyCode] || currencyCode,
        effectiveLocale: effectiveLocale,
        currencyFormatter: localePositionersMap[effectiveLocale],
        decimalSeparator: separators.charAt(0),
        thousandSeparator: separators.charAt(1)
    };
};

/**
 * This function accepts an amount in subunits (which are called "cents" in currencies like EUR or USD),
 * and also a formatting options object, that can be either constructed manually or created from locale
 * using `banknote.formattingForLocale()` method. This function doesn't provide any defaults for formatting.
 * @param {Number} subunitAmount
 * @param {BanknoteFormatting} formatting
 * @returns {string}
 */
exports.formatSubunitAmount = function (subunitAmount, formatting) {
    var minus = subunitAmount < 0 ? '-' : '';
    var mainPart = Math.abs(subunitAmount / formatting.subunitsPerUnit) | 0; // | 0 cuts of the decimal part
    var decimalPart = String(Math.abs(subunitAmount % formatting.subunitsPerUnit) | 0);
    var formattedAmount = String(mainPart);

    if (formatting.thousandSeparator) {
        formattedAmount = formattedAmount.replace(THOUSAND_MATCHER, formatting.thousandSeparator);
    }

    if (!(!formatting.showDecimalIfWhole && decimalPart === '0')) {
        var centsZeroFill = String(formatting.subunitsPerUnit).length - 1;
        while (decimalPart.length < centsZeroFill) {
            decimalPart = '0' + decimalPart;
        }
        formattedAmount += formatting.decimalSeparator + decimalPart;
    }

    return formatting.currencyFormatter(formatting.currencySymbol, formattedAmount, minus);
};
