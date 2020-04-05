'use strict';

var positions = {};

positions['af'] = 
positions['am'] = 
positions['cy'] = 
positions['en'] = 
positions['es-419'] = 
positions['es-BO'] = 
positions['es-BR'] = 
positions['es-BZ'] = 
positions['es-CR'] = 
positions['es-CU'] = 
positions['es-DO'] = 
positions['es-GQ'] = 
positions['es-GT'] = 
positions['es-HN'] = 
positions['es-MX'] = 
positions['es-NI'] = 
positions['es-PA'] = 
positions['es-PR'] = 
positions['es-SV'] = 
positions['es-US'] = 
positions['fil'] = 
positions['ga'] = 
positions['gu'] = 
positions['hi'] = 
positions['id'] = 
positions['ja'] = 
positions['kn'] = 
positions['ko'] = 
positions['ml'] = 
positions['mr'] = 
positions['ms'] = 
positions['or'] = 
positions['si'] = 
positions['so'] = 
positions['te'] = 
positions['th'] = 
positions['tr'] = 
positions['yue'] = 
positions['zh'] = 
positions['zu'] = function (symbol, amount, minus) {
    return minus + symbol + amount;
};

positions['ar'] = 
positions['as'] = 
positions['de-AT'] = 
positions['de-LI'] = 
positions['en-AT'] = 
positions['en-US-POSIX'] = 
positions['es-AR'] = 
positions['es-CO'] = 
positions['es-PE'] = 
positions['es-UY'] = 
positions['fa-AF'] = 
positions['jv'] = 
positions['mn'] = 
positions['ms-BN'] = 
positions['nb'] = 
positions['ne'] = 
positions['pa'] = 
positions['pt'] = 
positions['root'] = 
positions['sd'] = 
positions['sw'] = 
positions['ta'] = 
positions['ur'] = function (symbol, amount, minus) {
    return minus + symbol + ' ' + amount;
};

positions['az'] = 
positions['be'] = 
positions['bg'] = 
positions['bs'] = 
positions['ca'] = 
positions['cs'] = 
positions['da'] = 
positions['de'] = 
positions['el'] = 
positions['en-150'] = 
positions['en-BE'] = 
positions['en-DE'] = 
positions['en-DK'] = 
positions['en-FI'] = 
positions['en-SE'] = 
positions['en-SI'] = 
positions['es'] = 
positions['et'] = 
positions['eu'] = 
positions['fi'] = 
positions['fr'] = 
positions['gl'] = 
positions['hr'] = 
positions['hu'] = 
positions['hy'] = 
positions['is'] = 
positions['it'] = 
positions['ka'] = 
positions['kk'] = 
positions['ky'] = 
positions['lt'] = 
positions['lv'] = 
positions['mk'] = 
positions['my'] = 
positions['pl'] = 
positions['no'] = 
positions['ps'] = 
positions['pt-AO'] = 
positions['pt-CH'] = 
positions['pt-CV'] = 
positions['pt-GQ'] = 
positions['pt-GW'] = 
positions['pt-LU'] = 
positions['pt-MO'] = 
positions['pt-MZ'] = 
positions['pt-PT'] = 
positions['pt-ST'] = 
positions['pt-TL'] = 
positions['ro'] = 
positions['ru'] = 
positions['sk'] = 
positions['sl'] = 
positions['sq'] = 
positions['sr'] = 
positions['sv'] = 
positions['tk'] = 
positions['uk'] = 
positions['uz'] = 
positions['vi'] = function (symbol, amount, minus) {
    return minus + amount + ' ' + symbol;
};

positions['bn'] = 
positions['km'] = function (symbol, amount, minus) {
    return minus + amount + symbol;
};

positions['de-CH'] = 
positions['en-CH'] = 
positions['it-CH'] = function (symbol, amount, minus) {
    return minus ? (symbol + minus + amount) : (symbol + ' ' + amount);
};

positions['en-NL'] = 
positions['es-PY'] = 
positions['nl'] = function (symbol, amount, minus) {
    return minus ? (symbol + ' ' + minus + amount) : (symbol + ' ' + amount);
};

positions['es-CL'] = 
positions['es-EC'] = 
positions['es-VE'] = 
positions['lo'] = function (symbol, amount, minus) {
    return minus ? (symbol + minus + amount) : (symbol + amount);
};

positions['fa'] = function (symbol, amount, minus) {
    return '‎' + minus + symbol + ' ' + amount;
};

positions['he'] = function (symbol, amount, minus) {
    return minus ? ('‏' + minus + amount + ' ' + symbol) : ('‏' + amount + ' ' + symbol);
};

module.exports = positions;
