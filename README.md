# Banknote

Banknote is a small, easy-to-use JavaScript library that provides a simple way to format monetary amounts in multiple locales and currencies. It's mainly targeted at Node.js, but also works in the browser (if needed) with module bundlers like [Webpack](https://webpack.github.io/) and [Browserify](http://browserify.org/).

## Features
Banknote addresses a common problem faced by anyone (for example, an ecommerce company) who has to update and format prices on the frontend. It is different from similar projects in that it follows Unicode CLDR formatting standards, not an ad hoc data solution. It also:  
- is customizable — you can use emoticons, preferred symbols, etc.
- allows you to override its default settings — for example, if you want to apply US formatting to amounts in Chinese yen 

If you want to do more than just format monetary amounts, and you are open to changing your build process or accepting a ~300MB node module, then we recommend using jQuery Foundation's [globalize](https://github.com/jquery/globalize). It uses the same data as Banknote, but includes access to all of the [Unicode CLDR](http://cldr.unicode.org/).

## How to Use

###Requirements
- npm (either backend or frontend)

###Installing It

###Running It

###Examples
#### Single Locale

If your app only uses one locale, then the code is very straightforward:

```js
var banknote = require('banknote');
var formattingOptions = banknote.formattingForLocale('en-US');

console.log(banknote.formatSubunitAmount(123456, formattingOptions));
// "$1,234.56"
```

#### Explicit Currency

For some applications, you'll need a way to specify different currencies without changing number-formatting rules. Here's an example of the "en" number-formatting rules, but with Euro:

```js
var banknote = require('banknote');
var formattingOptions = banknote.formattingForLocale('en-US', 'EUR');

console.log(banknote.formatSubunitAmount(123456, formattingOptions));
// "€1,234.56"
```

####  Dynamic Locales

Quite often, you have to change a locale based on an incoming request or some other input. We recommended using
the [memoization](https://en.wikipedia.org/wiki/Memoization) function together with a fallback logic. For example:

```js
var banknote = require('banknote');
var memoize = require('memoizee');
var memoizedFormattingOptions = memoize(banknote.formattingForLocale);
var defaultFormattingOptions = banknote.formattingForLocale('en-US');

// Express.js init here ...

app.get('/', function(req, res){
    var locale = parseAcceptLanguageForMainLocale(req.headers['accept-language']);
    var formattingOptions;
    try {
        formattingOptions = memoizedFormattingOptions(locale);
    } catch (e) {
        formattingOptions = defaultFormattingOptions;
    }
    res.write(banknote.formatSubunitAmount(123456, formattingOptions));
    // "€1,234.56"
});

```

#### Customizing Default Formatters

With `banknote`, you can also customize any of the formatting options yourself. For example:

```js
var banknote = require('banknote');
var formattingOptions = banknote.formattingForLocale('en-US');

// disable "cents"
formattingOptions.showDecimalIfWhole = false;

// remove the thousand separator
formattingOptions.thousandSeparator = '';

formattingOptions.currencyFormatter = function (symbol, formattedNumber, minus) {
    return minus + symbol + ' ' + formattedNumber;
};

console.log(banknote.formatSubunitAmount(123400, formattingOptions));
// "$1234"
```

We've noticed that many libraries lack a `currencyFormatter` function to place things in their correct positions — providing separate options instead. Unfortunately, separate options won't satisfy all possible locale settings. For example, `de-CH` requires placing `-` after the currency symbol, which is usually unsupported or results in an explosion of parameters.

## Formatting Options

Here's a list of all the properties in formatting options obtained from the `formattingForLocale` call:

```js
var formattingOptions = {
    /**
     * Controls whether the subunit (decimal) part is shown when
     * the value is exact, e.g. exactly $8 and 0¢
     * @type boolean
     */
    showDecimalIfWhole: true,

    /**
     *
     * @type number
     */
    subunitsPerUnit: 100,

    /**
     * Effective locale means the exact locale that will be used
     * when formatting numbers. It doesn't necessarily match the
     * locale passed to `formattingForLocale()` call because
     * of the fallback logic.
     * @type string
     */
    effectiveLocale: 'en',

    /**
     * Currency code is not used directly and is provided here
     * for reference or custom logic for the clients of the lib
     * @type string
     */
    currencyCode: 'USD',

    /**
     * Symbol passed in to `currencyFormatter` function.
     * @type string
     */
    currencySymbol: '$',

    /**
     * Separator used to format thousands.
     * @type string
     */
    thousandSeparator: ',',

    /**
     * Separator between whole and decimal part of the amount.
     * @type string
     */
    decimalSeparator: '.',

    /**
     * Function that correctly positions symbol, formattedAmount
     * and a minus relative to each other.
     * @param {string} symbol
     * @param {string} formattedAmount
     * @param {string} minus
     * @returns {string}
     */
    currencyFormatter: function (symbol, formattedAmount, minus) {
        return minus + formattedAmount + symbol;
    }
};
```

###Contributions
We welcome contributions to this project. Please keep in mind that we want to avoid feature overload, so if you'd like to help out please consider working on the following:
- performance/speed
- automating updates of new Unicode releases, or manually submitting pull requests with new Unicode

## License

Copyright (c) 2015 Zalando SE

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

