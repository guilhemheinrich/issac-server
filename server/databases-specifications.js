var contingency = require('./common/contingency_chain').contingency;
var databases = require('./configuration');
var bindings = require('./configuration/models-databases-bindings.json');

// We could add 
var _getDatabases = (model, attribute, protocol) => {
    allProtocolsDatabases = databases[protocol].databases.map((db) => {return db.name});
    includes = contingency(
        [{includes: allProtocolsDatabases}, ['includes']],
        [bindings, [model, 'includes']],
        [bindings, [model, attribute,  'includes']]
    );
}