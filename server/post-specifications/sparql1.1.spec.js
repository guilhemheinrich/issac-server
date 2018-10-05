var sparql_default = require('../configuration/protocols')["sparql1.1"]
var models = require('../configuration/models.json');
var bindings = require('../configuration/data-bindings/sparql1.1.json')
module.exports = {
    insert: function (object) {
        console.log(object.type);
        console.log(object.data);
        skeletonModel = models[object.type].attributes;
        Pkey = models[object.type].Pkey;
        attributesValues = object.data;
        sparqlBinding = bindings[object.type].objects;
        sparqlBinding = sparqlBinding.map((attribute => {
            return Object.create(
            sparql_default, // Default with protocol default
            bindings[object.type],  // class default
            attribute,      // attribute default
            {subject: '<' + attributesValues[Pkey] + '>'}); // instance default
        }));
        insertQuad = '';
        attributesValues.forEach((attribute => {
            insertQuad = skeletonModel
        }));
        return 'hello';
    }

}