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

const assert = require('assert');
const banknote = require('../');

const ALL_KNOWN_LOCALES = Object.keys(require('../data/separators'));
const COUNTRY_CURRENCY_MAP = require('../data/country-currency');
const EXPECTED_US_OPTIONS = {
    decimalSeparator: '.',
    thousandSeparator: ',',
    currencyCode: 'USD',
    currencySymbol: '$',
    subunitsPerUnit: 100,
    showDecimalIfWhole: true
};

describe('banknote', function () {

    describe('formattingOptionsForLocale', function () {

        it('should throw for missing locale', function () {
            assert.throws(function () {
                banknote.formattingForLocale();
            });
        });

        it('should throw for unknown locale', function () {
            assert.throws(function () {
                banknote.formattingForLocale('i-klingon');
            });
        });

        it('should throw for a locale without a region', function () {
            assert.throws(function () {
                banknote.formattingForLocale('en');
            });
        });

        it('should give a full options given a valid locale with a territory', function () {
            const options = banknote.formattingForLocale('en-US');
            assert.equal(typeof options.currencyFormatter, 'function');
            delete options.currencyFormatter;
            assert.deepEqual(options, EXPECTED_US_OPTIONS);
        });

        it('should work for all known locales given an explicit currency', function () {
            ALL_KNOWN_LOCALES.forEach(function (locale) {
                assert(typeof banknote.formattingForLocale(locale, 'USD'), 'object');
            });
        });

        it('should work for all known locales where region is a valid country code', function () {
            ALL_KNOWN_LOCALES.forEach(function (locale) {
                var region = locale.split('-')[1];
                if (region && region.length === 2 && (region in COUNTRY_CURRENCY_MAP)) {
                    assert(typeof banknote.formattingForLocale(locale), 'object');
                }
            });
        });

    });

    describe('currencyForCountry', function () {
        it('should allow to find a currency code from the country code', function () {
            assert.equal(banknote.currencyForCountry('US'), 'USD');
            assert.equal(banknote.currencyForCountry('DE'), 'EUR');
        });
    });

    describe('formatSubunitAmount', function () {

        it('should work for "en-US" locale', function () {
            const options = banknote.formattingForLocale('en-US');
            assert.equal(banknote.formatSubunitAmount(123456, options), '$1,234.56');
        });

        it('should work for "de-AT" locale', function () {
            const options = banknote.formattingForLocale('de-AT');
            assert.equal(banknote.formatSubunitAmount(-123456, options), '-€ 1 234,56');
        });

        it('should work for "de-CH" locale', function () {
            const options = banknote.formattingForLocale('de-CH');
            assert.equal(banknote.formatSubunitAmount(-123456, options), 'CHF-1\'234.56');
        });

        it('should work for "en-US" locale with "EUR" currency', function () {
            const options = banknote.formattingForLocale('en-US', 'EUR');
            assert.equal(banknote.formatSubunitAmount(123456, options), '€1,234.56');
        });

        it('should work for "de" locale with "EUR" currency', function () {
            const options = banknote.formattingForLocale('de', 'EUR');
            assert.equal(banknote.formatSubunitAmount(123456, options), '1.234,56 €');
        });

        it('should work for "no" locale with "NOK" currency', function () {
            const options = banknote.formattingForLocale('no-NO', 'NOK');
            assert.equal(banknote.formatSubunitAmount(123456, options), '1 234,56 kr');
        });

        it('should correctly fill up the cents amount', function () {
            const options = banknote.formattingForLocale('de-DE');
            assert.equal(banknote.formatSubunitAmount(123406, options), '1.234,06 €');
        });

        it('should correctly hide decimal when appropriate options is specified', function () {
            const options = banknote.formattingForLocale('de-DE');
            options.showDecimalIfWhole = false;
            assert.equal(banknote.formatSubunitAmount(123400, options), '1.234 €');
        });

    });
});
