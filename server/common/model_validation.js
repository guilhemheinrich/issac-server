
var Ajv = require('ajv');
var schemas = [];
rootDir = '/home/gheinrich/issac-server/server/configuration/models-schemas';
require("fs").readdirSync(rootDir).forEach(function (file) {
    console.log('Schemas loaded from : ' + rootDir);
    console.log(rootDir + '/' + file);
    schema = require(rootDir + '/' + file)
    schemas.push(schema);

});
var ajv = new Ajv({
    // See reference : <https://github.com/epoberezkin/ajv#options> 
    schemas: schemas,
    verbose: true, 
    allErrors: true,
    coerceTypes: "array" /* For ex., will validate a single string if and array string is awaited
                            WARNING: this will change the initial data to match the schema
                            In the previous ex {uri: "http://uri"} would become  {uri: ["http://uri"]}*/
}); 
modelXvalidation = require('../configuration/routesXschemas.json')

var ajvCheck = (model, objects) => {
    console.log(schemas);
    let validObjects = [];
    objects.forEach((object) => {
        if (!modelXvalidation.mappings[model]) {
            throw "Not a valid object"
        }
        let validate = ajv.getSchema(modelXvalidation.mappings[model]);
        var valid = validate(object);
        if (!valid) 
        {
            console.log(object);
            console.log(ajv.errorsText(validate.errors));
        } else {
            validObjects.push(object);
        }
    })
    
    
    
    return validObjects
}

module.exports = {
    checkModel: ajvCheck
}

