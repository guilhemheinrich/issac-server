var sparql_default = require('../configuration/protocols')["sparql1.1"]
var models = require('../configuration/models.json');
var bindings = require('../configuration/protocols-models-bindings/sparql1.1.json')

var sparqlEngine = require('./sparql1.1_dependency/sparql')

var contingency = require('../common/contingency_chain').contingency
var unique = require('../common/unique')


var _namedGraph = (model, attribute) => {
    let out_namedGraph = '';
    out_namedGraph = contingency(
        bindings[model].namedGraph,
        bindings[model].objects[attribute].namedGraph
    );
    if (out_namedGraph) {
        if (sparql_default.prefixes[out_namedGraph]) {
            return sparql_default.prefixes[out_namedGraph]
        } else {
            return out_namedGraph;
        }
    } else {
        console.log("May i shoot a warning about " + model + " " + attribute + " ?");
        return ""
    }
}

var _prefixes = (model, attribute, prefixes) => {
    let out_prefixes = {};
    return contingency(
        bindings[model].prefixes,
        bindings[model].namespaces,
        bindings[model].objects[attribute].prefixes,
        bindings[model].objects[attribute].namespaces,
    );
    console.log(out_prefixes)
}

var _buildTripleSkeleton = (model, attribute) => {
    let subject = contingency(
        sparql_default.subject,
        bindings[model].objects[attribute].subject
    );
    let predicate = contingency(
        sparql_default.predicate,
        bindings[model].objects[attribute].predicate
    );
    let object = contingency(
        sparql_default.object,
        bindings[model].objects[attribute].object
    )
    return {
        subject: subject,
        predicate: predicate,
        object: object
    }
}

var _parseObject = (model, attribute, value) => {
    let attributeTypeSpecification = models[model].attributes[attribute];
    // Shortened syntax : should be used for litterals
    if (typeof (attributeTypeSpecification) === "string") {
        return `"${value}"${sparql_default.datatype_bindings[attributeTypeSpecification]}`
    } else {
        /* 
        attributeTypeSpecification is therefore an object
        type give the datatype
        class give the class of the linked object, if relevant
        */
        if (attributeTypeSpecification.type === "Object") {
            return `${value}`;
        } else {
            return `"${value}"${sparql_default.datatype_bindings[attributeTypeSpecification.type]}`
        }
    }
}

var _insert = (model, data, quads, prefixes) => {
    skeletonModel = models[model].attributes;
    Pkey = models[model].Pkey;
    attributesValues = data;
    sparqlBinding = bindings[model].objects;
    sparqlBinding = Object.getOwnPropertyNames(sparqlBinding).forEach((attribute => {
        current_prefix = _prefixes(model, attribute);
        if (Array.isArray(current_prefix)) {
            prefixes.push(...current_prefix);
        } else {
            prefixes.push(current_prefix);
        }

        if (attributesValues[attribute]) {
            let namedGraph = _namedGraph(model, attribute);
            let values;
            if (Array.isArray(attributesValues[attribute])) {
                values = attributesValues[attribute]
            } else {
                values = [attributesValues[attribute]];
            }
            values.forEach((value) => {

                let tripleSkeleton = _buildTripleSkeleton(model, attribute);
                tripleSkeleton.subject = `${attributesValues[Pkey]}`;
                if (attribute !== Pkey) {
                    if (typeof (value) === 'object') {
                        tripleSkeleton.object = _insert(skeletonModel[attribute].class, value, quads, prefixes);
                    } else {
                        tripleSkeleton.object = _parseObject(model, attribute, value);
                    }
                }

                if (!quads[namedGraph.uri]) {
                    quads[namedGraph.uri] = [tripleSkeleton]
                } else {
                    quads[namedGraph.uri].push(tripleSkeleton);
                }
            })

        }
    }));
    return data[Pkey];
}

var insert = (validObjects) => {
    let quads = {};
    prefixes = [];
    validObjects.forEach((object) => {
        let model = object.type;
        let instance = object.data;
        _insert(model, instance, quads, prefixes);
    });
    // Cannot be put upper because '=' instanciate a new array
    prefixes = prefixes.filter(unique);
    prefixesObject = {};
    prefixes.forEach((alias) => {
        match = sparql_default.namespaces[alias];
        prefixesObject[match.prefix] = match.uri;
    });
    let addQuery = {
        type: 'update',
        prefixes: prefixesObject,
        updates: [
            {
                updateType: 'insert',
                insert: [],
            }
        ]
    }
    Object.getOwnPropertyNames(quads).forEach((namedGraph) => {
        sparqlEngine.generateAddQuery(namedGraph, quads[namedGraph], addQuery)
    })
    let generator = new sparqlEngine.SparqlGenerator({allPrefixes: prefixesObject});
    console.log(addQuery);
    generator.stringify(addQuery)
    console.log(
        generator.stringify(addQuery)
        );
    return quads;
}
module.exports = {
    insert: insert

}

// var parsedQuery = parser.parse(`
// PREFIX issac: <http://issac/> 
// INSERT DATA {  
//     GRAPH <http://ECPP_administration/agent/set/> {   
//     <issac:01354dsz> <rdfs:label> "Test 2"^^<xsd:string>.
//     <issac:01354dsz> <rdfs:label> "Test 2"^^<xsd:string>.
//     <issac:01354dsz> <issac:involve> <http://hello>.
//     <issac:01354dsz> <issac:hasOwner> <http://Bob>.
//     }
//     GRAPH <http://ECPP_administration/agent/set/> {
//     <http://Bob> <rdf:type> <foaf:Person>.
//     <http://Bob> <foaf:firstName> "Bob"^^<xsd:string>.
//     <http://Bob> <foaf:mbox> "bob@gmail.com"^^<xsd:string>.
//     }
// }`)
