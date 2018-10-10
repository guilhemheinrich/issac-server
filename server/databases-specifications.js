var contingency = require('./common/contingency_chain').contingency;
var databases = require('./configuration');
var bindings = require('./configuration/models-databases-bindings.json');

var _getDatabases = (model, attribute, protocol) => {
    allProtocolsDatabases = databases[protocol].databases.map((db) => {return db.name});
    // contingency(
    //     {includes: allProtocolsDatabases},
    //     bindings[model].includes,
    //     bindings[model][attribute].includes
    // );
}