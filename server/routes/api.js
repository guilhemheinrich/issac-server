const express = require('express');
const router = express.Router();

const _resolver = require('../configuration/functions');
const sparqlHandler = require('../protocols-specifications/sparql1.1.spec.js')

const neo4j = require('neo4j-driver').v1;

var modelValidator = require('../common/model_validation').checkModel
var databasesFunctions = require('../databases-specifications');
/* GET api listing. */
router.get('/neo', (req, res) => {
    const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "pic3.14"));
    const session = driver.session();
    const resultPromise = session.run(
        'CREATE (a:Person {name: $name}) RETURN a',
        { name: 'Zongo' }
    );
    res.send('Zongo in da place');
});

/* ADD or SET one element
*/
router.post('/POST', (req, res) => {
    objects = req.body;
    model = "ConceptInstance"
    let validObjects;
    if (Array.isArray(objects)) {
        validObjects = modelValidator(model, objects);
    } else {
        validObjects = modelValidator(model, [objects]);
    }
    // quads = sparqlHandler.insert(validObjects);

    res.send(validObjects);
});


router.post('/POST/:objectID', function (req, res) {
    objects = req.body;
    model = req.params.objectID
    let validObjects;
    if (Array.isArray(objects)) {
        validObjects = modelValidator(model, objects);
    } else {
        validObjects = modelValidator(model, [objects]);
    }

    denestify = require('../models').denestify;
    modelXobjects = denestify(model, validObjects);
    console.log(modelXobjects);
    Object.getOwnPropertyNames(modelXobjects)
        .forEach((model) => {
            databasesFunctions.writePipeline(model, modelXobjects[model]);
        });
    res.send(req.params)
})

router.get('/', (req, res) => {
    // databases = require('../configuration/databases');
    concepts = require('../configuration/models').concepts
    res.send('api works');
});


module.exports = router;
