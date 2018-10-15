var schemas = [];
rootDir = '/home/gheinrich/issac-server/server/configuration/models-schemas';
require("fs").readdirSync(rootDir).forEach(function (file) {
    console.log('Schemas loaded from : ' + rootDir);
    console.log(rootDir + '/' + file);
    schema = require(rootDir + '/' + file)
    schemas.push(schema);
});

/*
    Title in the schemas MUST BE the same as the model meta name
*/
let _models = () => {
    out = {};
    schemas.forEach((schema) => {
        out[schema.title] = schema.properties;

    });
    return out;
}

var _schemasXclass = () => {
    out = {}
    schemas.forEach((schema) => {
        out[schema['$id']] = schema.title;
    });
    return out;
}

var models = _models();
var schemasXclass = _schemasXclass();

var _potentialObjectsAttributes = (model) => {
    possibleObjectsAttribute = [];
    Object.keys(models[model]).forEach((attributeName) => {
        attribute = models[model][attributeName];
        if (attribute.anyOf) {
            if (Object.keys(attribute.anyOf).includes('$ref')) {
                potential = {property: attributeName,
                    model: schemasXclass[attribute.anyOf['$ref']]
                }
                possibleObjectsAttribute.push(potential)
            }
        }
        if (attribute['$ref']) {
            potential = {property: attributeName,
                model: schemasXclass[attribute['$ref']]
            }
            possibleObjectsAttribute.push(potential)
        }
        if (attribute.type === 'array') {
            items = attribute.items
            if (items.anyOf) {
                items.anyOf.forEach((item) => {

                    if (item['$ref']) {
                        potential = {property: attributeName,
                            model: schemasXclass[item['$ref']]
                        }
                        possibleObjectsAttribute.push(potential)
                    }
                })
            }
            if (items['$ref']) {
                potential = {property: attributeName,
                    model: schemasXclass[items['$ref']]
                }
                possibleObjectsAttribute.push(potential)
            }
        }
    })
    return possibleObjectsAttribute;
}

var splitInstances = (model, objects) => {
    // _model = model;
    // _objects = objects;
    _inObjects = {[model]: objects}
    objectsPerClass = {..._inObjects}
    // objectsPerClass = {};
    do {
        nestedObjects = {};
        // nestedObjects = {};
        Object.keys(_inObjects).forEach((modelName) => 
        {
            _objects = _inObjects[modelName];
            potentialObjectsAttribute = _potentialObjectsAttributes(modelName);
            _objects.forEach((object) => {
                possibleObjectsAttribute.forEach((potentialObjectProperty) => {
                    if (typeof(object[potentialObjectProperty.property]) === 'object'){
                        if (!objectsPerClass[potentialObjectProperty.model]) {
                            // objectsPerClass[potentialObjectsAttributes.model] = [];
                            nestedObjects[potentialObjectProperty.model] = [];
                        }
                        // objectsPerClass[potentialObjectsAttributes.model].push(object[[potentialObjectsAttributes.property]])
                        nestedObjects[potentialObjectProperty.model].push(object[[potentialObjectProperty.property]])
                    }
                })
            })
        })
        objectsPerClass = {...objectsPerClass, ...nestedObjects};
        _inObjects = nestedObjects;
    }
    while (Object.getOwnPropertyNames(nestedObjects).length > 0)
    return objectsPerClass;
}

var _splitInstances = (model, objects, _objectsPerClass) => {
    potentialObjectsAttribute = _potentialObjectsAttributes(model);
    objects.forEach((object) => {
        possibleObjectsAttribute.forEach((potentialObjectProperty) => {
            if (typeof(object[potentialObjectsAttributes.property]) === 'object'){
                if (!_objectsPerClass[potentialObjectsAttributes.model]) {
                    _objectsPerClass[potentialObjectsAttributes.model] = [];
                    // nestedObjects[potentialObjectsAttributes.model] = [];
                }
                _objectsPerClass[potentialObjectsAttributes.model].push(object[[potentialObjectsAttributes.property]])
                // nestedObjects[potentialObjectsAttributes.model].push(object[[potentialObjectsAttributes.property]])
            }
        })
    })
}


// module.exports = models;
module.exports = {
    models: models,
    denestify: splitInstances
}