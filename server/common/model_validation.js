
var Ajv = require('ajv');
var schemas = [];
rootDir = '/home/gheinrich/issac-server/server/configuration/models-schemas';
require("fs").readdirSync(rootDir).forEach(function (file) {
    console.log('Schemas loaded from : ' + rootDir);
    console.log(rootDir + '/' + file);
    schema = require(rootDir + '/' + file)
    schemas.push(schema);

});
var ajv = new Ajv({ schemas: schemas }); // options can be passed, e.g. {allErrors: true}
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
            console.log(validate.errors);
        } else {
            validObjects.push(object);
        }
    })
    
    
    
    return validObjects
}

module.exports = {
    checkModel: ajvCheck
}

