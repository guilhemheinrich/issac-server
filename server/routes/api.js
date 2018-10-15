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
        {name: 'Zongo'}
      );
    res.send('Zongo in da place');
});

/* ADD or SET one element
Pattern as json is :
{
    type: ModelName,
    data: {
        ... attribute: value
        ... relationShip: Pattern
    }
}

*/
router.post('/POST', (req, res) => {
    objects = req.body;
    let validObjects = modelValidator(...objects);
    
    quads = sparqlHandler.insert(validObjects);

    res.send(quads);
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
    allObjects = denestify(model, validObjects);
    // modelXobjects = [{model: model, objects: validObjects}];
    // while (objects.length > 0) {
    //     model = modelXobjects[0].model;
    //     objects = modelXobjects[0].objects;
    //     databasesFunctions.writePipeline(model, objects);
    // }
    console.log(allObjects);
    res.send(req.params)
  })

router.get('/', (req, res) => {
    res.send('api works');
});


module.exports = router;

var random = () => {
    return Math.random() > 0.3
}
while (random()) {
    console.log('one more')
}