var models = require('./models');
var database = require('./databases');
// var contingency = require('../common/contingency_chain');
var pointer = require('json-pointer');


var generate = () => {
    // models.concepts.forEach(concept => {
        concept = require('../common/load_conf')(__dirname + '/' + './models/concepts/test.yaml')
        generalDatabases = {}
        if (pointer(concept).has('/databases')) {
            generalDatabases = pointer(concept).get('/databases')
        }
        concept.attributes.forEach((attribute) => {
            specificDatabases = {}
            if (pointer(attribute).has('/databases')) {
                specificDatabases = pointer(attribute).get('/databases')
            }
            attribute.databases = {...generalDatabases, ...specificDatabases}
        })
        console.log(concept)
        return concept     
    // });  
}
module.exports = generate
