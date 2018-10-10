const express = require('express');
const router = express.Router();

const _resolver = require('../configuration/functions');
const sparqlHandler = require('../post-specifications/sparql1.1.spec.js')

const neo4j = require('neo4j-driver').v1;

var modelValidator = require('../common/model_validation').checkModel
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

router.get('/', (req, res) => {
    res.send('api works');
});


module.exports = router;