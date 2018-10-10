
var contingency_chain = (...contingency_chain) => {
    let out_value;
    contingency_chain.forEach((element) => {
        if (element) out_value = element;
    })
    return out_value;
}

module.exports = {
    contingency: contingency_chain
}