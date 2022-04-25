/**
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

const countryCurrencyMap = require('./data/country-currency');
const currencySymbolMap = require('./data/symbol-map');
const localeSeparatorsMap = require('./data/separators');
const localePositionersMap = require('./data/positions');

var LOCALE_MATCHER = /^\s*([a-zA-Z]{2,4})(?:[-_][a-zA-Z]{4})?(?:[-_]([a-zA-Z]{2}|\d{3}))?\s*(?:$|[-_])/;
var LOCALE_LANGUAGE = 1;
var LOCALE_REGION = 2;

function error(message) {
    throw new Error(message);
}

/**
 * @param {Object} map
 * @param {string} locale
 * @param {Array<string>} localeParts
 * @throws {Error}
 * @returns {string | function}
 */
function findWithFallback(map, locale, localeParts) {
    const result = map[locale] ||
        map[localeParts[LOCALE_LANGUAGE] + '-' + localeParts[LOCALE_REGION]] ||
        map[localeParts[LOCALE_LANGUAGE]];
    if (!result) {
        error('Could not find info for locale "' + locale + '"');
    }

    return result;
}

/**
 * @param {string} region
 * @returns {string}
 */
function getCurrencyFromRegion(region) {
    const currencyCode = countryCurrencyMap[region];
    if (!currencyCode) {
        error('Could not find default currency for locale region "' + region + '". Please provide explicit currency.');
    }
    return currencyCode;
}

/**
 * @typedef {{
 *     showDecimalIfWhole: boolean,
 *     subunitsPerUnit: number,
 *     centsZeroFill: number,
 *     effectiveLocale: string,
 *     currencyCode: string,
 *     currencySymbol: string,
 *     currencyFormatter: Function,
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
    const localeParts = locale.match(LOCALE_MATCHER);

    if (!localeParts) {
        error('Locale provided does not conform to BCP47.');
    }

    currencyCode = currencyCode || getCurrencyFromRegion(localeParts[LOCALE_REGION]);
    const separators = findWithFallback(localeSeparatorsMap, locale, localeParts);

    const subunitsPerUnit = 100; // TODO change 100 with real information
    return {
        showDecimalIfWhole: 'HU' !== localeParts[LOCALE_REGION],
        subunitsPerUnit,
        centsZeroFill: String(subunitsPerUnit).length - 1,
        currencyCode: currencyCode,
        currencySymbol: currencySymbolMap[currencyCode] || currencyCode,
        currencyFormatter: findWithFallback(localePositionersMap, locale, localeParts),
        decimalSeparator: separators.charAt(0),
        thousandSeparator: separators.charAt(1)
    };
};

/**
 * Returns a currency code for the given country or `undefined` if nothing found.
 * @param {string} twoCharacterCountryCode
 * @returns {string|undefined}
 */
exports.currencyForCountry = function (twoCharacterCountryCode) {
    return countryCurrencyMap[twoCharacterCountryCode];
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
    const minus = subunitAmount < 0 ? '-' : '';
    const absAmount = Math.abs(subunitAmount);
    const mainPart = absAmount / formatting.subunitsPerUnit | 0; // | 0 cuts of the decimal part
    let decimalPart = '' + (absAmount % formatting.subunitsPerUnit | 0);
    let formattedAmount;
    if (formatting.thousandSeparator) {
        formattedAmount = addThousandSeparator(mainPart, formatting.thousandSeparator);
    } else {
        formattedAmount = '' + mainPart;
    }

    if (!(!formatting.showDecimalIfWhole && decimalPart === '0')) {
        formattedAmount += formatting.decimalSeparator + padLeft(decimalPart, formatting.centsZeroFill);;
    }

    return formatting.currencyFormatter(formatting.currencySymbol, formattedAmount, minus);
};

function addThousandSeparator(number, separator) {
    let mainPart = '' + (number % 1000);
    number = (number / 1000) | 0;
    if (number > 0) {
        mainPart = padLeft(mainPart, 3);
    }
    while (number > 0) {
        let subPart = '' + (number % 1000);
        number = (number / 1000) | 0;
        if (number > 0) {
            subPart = padLeft(subPart, 3);
        }
        mainPart = subPart + separator + mainPart;
    }
    return mainPart;
}

function padLeft(subPart, length) {
    while (subPart.length < length) {
        subPart = '0' + subPart;
    }
    return subPart;
}
