'use strict';

const Benchmark = require('benchmark');
const {formatSubunitAmount, formattingForLocale} = require('.');

const intlFormatter = Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

const formatting = formattingForLocale('de-DE', 'EUR');

new Benchmark.Suite('')
    .add('big number', () => {
        formatSubunitAmount(100052233, formatting);
    })
    .add('big negative number', () => {
        formatSubunitAmount(-100052233, formatting);
    })
    .add('middle number', () => {
        formatSubunitAmount(120004, formatting);
    })
    .add('small number', () => {
        formatSubunitAmount(1234, formatting);
    })
    .add('big number intl', () => {
        intlFormatter.format(100052233);
    })
    .add('big negative number intl', () => {
        intlFormatter.format(-100052233);
    })
    .add('middle number intl', () => {
        intlFormatter.format(120004);
    })
    .add('small number intl', () => {
        intlFormatter.format(1234);
    })
    // add listeners
    .on('cycle', (event) => {
        // tslint:disable-next-line
        console.log(String(event.target));
    }).run();
