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

// var _checkReference

var _potentialObjectsAttributes = (model) => {
    possibleObjectsAttribute = [];
    Object.keys(models[model]).forEach((attributeName) => {
        attribute = models[model][attributeName];
        if (attribute.anyOf) {
            if (Object.keys(attribute.anyOf).includes('$ref')) {
                potential = {
                    property: attributeName,
                    model: schemasXclass[attribute.anyOf['$ref']]
                }
                possibleObjectsAttribute.push(potential)
            }
        }
        if (attribute['$ref']) {
            potential = {
                property: attributeName,
                model: schemasXclass[attribute['$ref']]
            }
            possibleObjectsAttribute.push(potential)
        }
        if (attribute.type === 'array') {
            items = attribute.items
            if (items.anyOf) {
                items.anyOf.forEach((item) => {
                    if (item['$ref']) {
                        potential = {
                            property: attributeName,
                            model: schemasXclass[item['$ref']]
                        }
                        possibleObjectsAttribute.push(potential)
                    }
                })
            }
            if (items['$ref']) {
                potential = {
                    property: attributeName,
                    model: schemasXclass[items['$ref']]
                }
                possibleObjectsAttribute.push(potential)
            }
        }
    })
    return possibleObjectsAttribute;
}


var _checkObjectAndInsert = (model, object, container) => {
    if (typeof (object) === 'object') {
        if (!container[model]) {
            container[model] = [];
        }
        container[model].push(object)
    }
}

var denestify = (model, objects) => {
    _inObjects = { [model]: objects }
    objectsPerClass = { ..._inObjects }
    do {
        nestedObjects = {};
        Object.keys(_inObjects).forEach((modelName) => {
            _objects = _inObjects[modelName];
            potentialObjectsAttribute = _potentialObjectsAttributes(modelName);
            _objects.forEach((object) => {
                possibleObjectsAttribute.forEach((potentialObjectProperty) => {
                    if (Array.isArray(object[potentialObjectProperty.property])) {
                        object[potentialObjectProperty.property].forEach((item) => {
                            _checkObjectAndInsert(potentialObjectProperty.model, item, nestedObjects);
                        })
                    } else {
                        _checkObjectAndInsert(potentialObjectProperty.model, object[potentialObjectProperty.property], nestedObjects);
                    }
                })
            })
        })
        // objectsPerClass = { ...objectsPerClass, ...nestedObjects };
        // Safey merge
        Object.getOwnPropertyNames(nestedObjects)
            .forEach((propertyName) => {
                if (!objectsPerClass[propertyName]) {
                    objectsPerClass[propertyName] = [];
                }
                objectsPerClass[propertyName].push(...nestedObjects[propertyName]);
            })

        _inObjects = nestedObjects;
    }
    while (Object.getOwnPropertyNames(nestedObjects).length > 0)
    return objectsPerClass;
}

module.exports = {
    models: models,
    denestify: denestify
}