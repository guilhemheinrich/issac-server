
var unroller = require('./safe_accessor')

var contingency_chain = (...contingency_chain) => {
    let out_value;
    contingency_chain.forEach((element) => {
        if (element) out_value = element;
    })
    return out_value;
}

// All the arguments have the form :
// [object, [sequence]]
var contingency_chain2 = (...contingency_chain) => {
    let out_value;
    contingency_chain.forEach((element) => {
        rootObj = element[0];
        if (element[1]) {
            sequence = element[1];
            refOrValue = unroller(rootObj, sequence);
        } else {
            refOrValue = rootObj;
        }

        if (refOrValue) {
            out_value = refOrValue;
        }

    })
    return out_value;
}

// o1 = {a: 3};
// o2 = {};
// contingency_chain2([o1, ['a']], [o2, ['c', 'd']])

var pointer = require('json-pointer');

// Fonctions factory
var contingencyBuilder = (chain = []) => {
    var walk = (object) => {
        let value = undefined;
        let bindedObject = pointer(object);
        chain.forEach((link) => {
            if (bindedObject.has(link)) {
                value = bindedObject.get(link);
            }
            console.log(value);
        })
    }
    return walk;
}

// Object oriented
var _internal = (contingency) => ({
    reset: () => {
        contingency.chain = [];
        return _internal(contingency);
    },
    push: (link) => {
        contingency.chain.push(link);
        return _internal(contingency);
    },
    popOrSlice: (index = -1) => {
        if (index >= 0 && index <contingency.chain.length) {
            contingency.chain.splice(index);
        } else {
            contingency.chain.pop();
        }
    },
    walk: (object) => {
        let value = undefined;
        let bindedObject = pointer(object);
        contingency.chain.forEach((link) => {
            if (bindedObject.has(link)) {
                value = bindedObject.get(link);
            }
            console.log(value);
        })
    }
})

var newContingency = () => {
    return _internal({
        chain: []
    })
}

function c_3() {
    if (!this.chain) {
        this.chain = [];
    }
    this.reset = () => {
        this.chain = []
    };
    this.link = (link) => {
        this.chain.push(link);
        return this
    };
    this.walk =  (object) => {
        let value = undefined;
        let bindedObject = pointer(object);
        this.chain.forEach((link) => {
            if (bindedObject.has(link)) {
                value = bindedObject.get(link);
            }
            console.log(value);
        })
    };
}

// var namechain = contingency(['/name', '/attribute/name']);
// var namechain2 = newContingency();
// namechain2.link('/name').link('/attribute/name').walk(object)

// var namechain3 = new c_3();
// namechain3.link('/name').link('/attribute/name').walk(object)
// object = {
//     name: 'hello',
//     attribute: {name: 'world'}
// }
// object2 = {
//     attribute: {name: {a:1}}
// }
// namechain(object);
// namechain(object2);

module.exports = {
    contingency: contingency_chain2,
    builder: contingencyBuilder,
    constructor: newContingency
}