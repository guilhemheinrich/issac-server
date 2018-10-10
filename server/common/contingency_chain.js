
var contingency_chain = (...contingency_chain) => {
    let out_value;
    contingency_chain.forEach((element) => {
        // try {
        //     console.log(element);
        // } catch (e){
        //     console.log(e);
        // }
        if (element) out_value = element;
    })
    return out_value;
}

var _unroller = (reference, attribute) => {
    return reference[attribute];
}

// All the arguments have the form :
// [object, [sequence]]
var contingency_chain2 = (...contingency_chain) => {
    let out_value;
    contingency_chain.forEach((element) => {
        rootObj = element[0];
        sequence = element[1];
        // currentRef 
        let refOrValue = rootObj;
        for (att_cpt = 0; att_cpt < sequence.length; att_cpt++) {
            refOrValue = _unroller(refOrValue, sequence[att_cpt]);
            if (!refOrValue) {
                break;
            }
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

module.exports = {
    contingency: contingency_chain2
}