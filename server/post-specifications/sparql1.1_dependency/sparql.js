var SparqlGenerator = require('sparqljs').Generator;
var SparqlParser = require('sparqljs').Parser;

var generateAddQuery = (namedGraph, triples, addQuery) => {
    addQuery.updates[0].insert.push(
        {
            type:'graph',
            name: namedGraph,
            triples: triples    
        });
}

module.exports = {
    SparqlGenerator: SparqlGenerator,
    SparqlParser: SparqlParser,
    generateAddQuery: generateAddQuery
}