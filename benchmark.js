'use strict';

const Benchmark = require('benchmark');
const {formatSubunitAmount, formattingForLocale} = require('.');

const formatting = formattingForLocale('de-DE');

new Benchmark.Suite('')
    .add('big number', () => {
        formatSubunitAmount(123452233, formatting);
    })
    .add('small number', () => {
        formatSubunitAmount(1234, formatting);
    })
    // add listeners
    .on('cycle', (event) => {
        // tslint:disable-next-line
        console.log(String(event.target));
    }).run();
