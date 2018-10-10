var models = require('../configuration/models.json');

var _checkPattern = (model, objectAttributes, ...pastReferences) => {
    modelAttributes = models[model].attributes;
    PrimaryKey = models[model].Pkey;

    /* Check 1 : Attributes name matching
    objectAttributes subset of modelAttributes
    */
    Object.getOwnPropertyNames(objectAttributes).forEach((attributeName) => {
        if (!Object.getOwnPropertyNames(modelAttributes).includes(attributeName)) {
            throw "instance." + [...pastReferences, attributeName].join('.') +"  is not part of model attributes"
        }
    });


    let primaryKeyExistence = (objectAttributes[PrimaryKey] !== undefined);
    if (!primaryKeyExistence) {
        throw "instance attributes does not possess a primary key"
    }

    Object.getOwnPropertyNames(objectAttributes).forEach(attributeName => {
        if (Array.isArray(objectAttributes[attributeName]) && !modelAttributes[attributeName].multiple) {
            throw "instance." + [...pastReferences, attributeName].join('.') +" is an array while it shouldn't"
        }
    });

    // recursive check (occurs when it's an object)
    Object.getOwnPropertyNames(objectAttributes).forEach(attributeName => {
        // Embedded object
        if (modelAttributes[attributeName].type === "Object") {
            if (Array.isArray(objectAttributes[attributeName]) ) { 
                objectAttributes[attributeName].forEach((element) => {
                    if (typeof(element) === "object") {
                        _checkPattern(modelAttributes[attributeName].class, element, model);
                    }
                })
            } else {
                if (typeof(objectAttributes[attributeName]) === "object") {
                    _checkPattern(modelAttributes[attributeName].class, objectAttributes[attributeName], model);
                }
            }
        }
    });

}

var checkPattern = (...objects) => {
    let validObjects = [];
    objects.forEach((object) => {
        console.log(object);
        try {
            _checkPattern(object.type, object.data);
            console.log(object);
            validObjects.push(object);
        } catch(e) {
            console.log(e)
        }
    });
    return validObjects
}

module.exports = {
    checkModel: checkPattern
}