'use strict';

var subUnitsPerUnit = {};

subUnitsPerUnit['BIF'] =
subUnitsPerUnit['CLP'] =
subUnitsPerUnit['CVE'] =
subUnitsPerUnit['DJF'] =
subUnitsPerUnit['GNF'] =
subUnitsPerUnit['ISK'] =
subUnitsPerUnit['JPY'] =
subUnitsPerUnit['KMF'] =
subUnitsPerUnit['KRW'] =
subUnitsPerUnit['PYG'] =
subUnitsPerUnit['RWF'] =
subUnitsPerUnit['UGX'] =
subUnitsPerUnit['UYI'] =
subUnitsPerUnit['VND'] =
subUnitsPerUnit['VUV'] =
subUnitsPerUnit['XAF'] =
subUnitsPerUnit['XOF'] =
subUnitsPerUnit['XPF'] = 1;

subUnitsPerUnit['MGA'] =
subUnitsPerUnit['MRU'] = 5;

subUnitsPerUnit['BHD'] =
subUnitsPerUnit['IQD'] =
subUnitsPerUnit['JOD'] =
subUnitsPerUnit['KWD'] =
subUnitsPerUnit['LYD'] =
subUnitsPerUnit['OMR'] =
subUnitsPerUnit['TND'] =
subUnitsPerUnit['CLF'] = 1000;

module.exports = function (currency) {
    return subUnitsPerUnit[currency] || 100;
};

