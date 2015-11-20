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

var countryCurrency = require('./data/country-currency');
var currencySymbol = require('./data/symbol-map');
var localeSeparators = require('./data/separators');
var localePositioners = require('./data/positions');

var LOCALE_MATCHER = /^\s*([a-zA-Z]{2})(?:[-_][a-zA-Z]{4})?(?:[-_]([a-zA-Z]{2}))\s*(?:$|[-_])/;
var LOCALE_LANGUAGE = 1;
var LOCALE_COUNTRY = 2;
var defaultLocale = 'en-US';

function error(message) {
    throw new Error(message);
}

function findEffectiveLocale(locale, localeParts) {
    if (locale in localePositioners) {
        return locale;
    } else if ((locale = localeParts[LOCALE_LANGUAGE] + '-' + localeParts[LOCALE_COUNTRY]) in localePositioners) {
        return locale;
    } else if ((locale = localeParts[LOCALE_LANGUAGE]) in localePositioners) {
        return locale;
    } else {
        error('Could not find a formatter for locale "' + locale + '"');
    }
}

exports.setDefaultLocale = function (locale) {
    if (!locale.match(LOCALE_MATCHER)) {
        error('Locale provided does not conform to BCP47.');
    }
    defaultLocale = locale;
};

exports.formatCents = function (centsAmount, options) {
    options = options || {};
    var locale = options.locale || defaultLocale;
    var localeParts = locale.match(LOCALE_MATCHER);

    if (!localeParts) {
        error('Locale provided does not conform to BCP47.');
    }

    var country = options.country || localeParts[LOCALE_COUNTRY];
    var currency = countryCurrency[country];

    if (!currency) {
        error('There is no default currency for the country code "' + country + '". Please provide explicit currency.');
    }

    var symbol = currencySymbol[currency];

    if (!symbol) {
        error('Currency code "' + currency + '" not found.');
    }

    var effectiveLocale = findEffectiveLocale(locale, localeParts);
    var separators = localeSeparators[effectiveLocale];
    var positioner = localePositioners[effectiveLocale];

    // TODO change 100 with information from CLDR
    var minus = centsAmount < 0 ? '-' : '';
    var mainPart = Math.abs(centsAmount / 100) | 0; // | 0 cuts of the decimal part
    var centsPart = Math.abs(centsAmount % 100) | 0;

    return positioner(symbol, mainPart + separators[0] + centsPart, minus);
};
