var _unroller = (reference, attribute) => {
    return reference[attribute];
}

var unroller = (object, property_chain) => {

    // currentRef 
    let refOrValue = object;
    for (att_cpt = 0; att_cpt < property_chain.length; att_cpt++) {
        refOrValue = _unroller(refOrValue, property_chain[att_cpt]);
        if (!refOrValue) {
            break;
        }
    }

    return refOrValue
}

module.exports = unroller;