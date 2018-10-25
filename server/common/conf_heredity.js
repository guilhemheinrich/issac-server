var pointer = require('json-pointer');

var specificator = (general, specific) => {
    out = {}
    _specificator(general, specific, out);
    return out;
}

// <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#Implementing_basic_set_operations>
function difference(setA, setB) {
    var _difference = new Set(setA);
    for (var elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}

var _specificator = (general, specific, out = {}, ...path) => {

    var propgeneral = new Set(Object.getOwnPropertyNames(general))
    var propspecific = new Set(Object.getOwnPropertyNames(specific))

    // <https://stackoverflow.com/questions/2342749/is-there-a-library-for-a-set-data-type-in-javascript#answer-31931246>
    var commonProperties = new Set([...propspecific].filter(i => propgeneral.has(i)));
    var generalProperties = difference(propgeneral, commonProperties);
    var specificProperties = difference(propspecific, commonProperties);

    generalProperties.forEach((generalOnlyProp) => {
        jsonPath = pointer.compile([...path, generalOnlyProp]);
        pointer(out).set(jsonPath, general[generalOnlyProp]);
    });
    specificProperties.forEach((specificOnlyProp) => {
        jsonPath = pointer.compile([...path, specificOnlyProp]);
        pointer(out).set(jsonPath, specific[specificOnlyProp]);
    });

    commonProperties.forEach((cProp) => {
        if (general[cProp] !== null && typeof general[cProp] === 'object' &&
            specific[cProp] !== null && typeof specific[cProp] === 'object') {
            _specificator(general[cProp], specific[cProp], out, [...path, cProp]);
        } else {
            jsonPath = pointer.compile([...path, cProp]);
            pointer(out).set(jsonPath, specific[cProp]);
        }
    })
}

module.exports = specificator;

var general = { a: 2, b: 3, d: { a: 4, c: 5 } }
var specific = { a: 4, d: { c: 'specific !' } }

specificator(general, specific)
