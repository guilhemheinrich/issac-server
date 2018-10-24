/* Local dependencies (pathes)
    mutli file loader: '../common/load_many',
    validation schemas: './models-schemas-yaml/generics-schemas/models'
    concepts directory: './configuration/models/concepts'
    conf loader : '../common/conf_load'
    */
_localPath = __dirname + '/'

var Ajv = require('ajv');

// _schemas are a dictionary
var _schemas = require(_localPath + '../common/load_many')(_localPath + './models-schemas-yaml/generics-schemas/models',
    {
        dictionary: '/title'
    });

var ajv = new Ajv({
    // See reference : <https://github.com/epoberezkin/ajv#options> 
    schemas: _schemas,
    verbose: true,
    allErrors: true,
    coerceTypes: "array" /* For ex., will validate a single string if and array string is awaited
                               WARNING: this will change the initial data to match the schema
                               In the previous ex {uri: "http://uri"} would become  {uri: ["http://uri"]}*/
});

var conf_loader = require(_localPath + '../common/load_conf');

/////////////////////////////////////////////////////////////////////
///////////////////// Concepts //////////////////////////////////////
/////////////////////////////////////////////////////////////////////
var _concepts = require(_localPath + '../common/load_many')(_localPath + './models/concepts');

var _schemasDict = {};
_schemas.forEach(( function (schema) {
    _schemasDict[schema['title']] = schema;
}));
var concepts = [];
_concepts.forEach((concept) => {

    let validate = ajv.getSchema(_schemasDict['Concept']['$id']);
    var valid = validate(concept);
    if (!valid) {
        console.log(concept);
        console.log(ajv.errorsText(validate.errors));
    } else {
        concepts.push(concept);
    }
})

/////////////////////////////////////////////////////////////////////
///////////////////// Relationship //////////////////////////////////
/////////////////////////////////////////////////////////////////////
var _relationships = require(_localPath + '../common/load_many')(_localPath + './models/relationships');

var _schemasDict = {};
_schemas.forEach(( function (schema) {
    _schemasDict[schema['title']] = schema;
}));
var relationships = [];
_relationships.forEach((relationship) => {

    let validate = ajv.getSchema(_schemasDict['Relationship']['$id']);
    var valid = validate(relationship);
    if (!valid) {
        console.log(relationship);
        console.log(ajv.errorsText(validate.errors));
    } else {
        relationships.push(relationship);
    }
})

module.exports = {
    concepts: concepts,
    relationships: relationships
};

