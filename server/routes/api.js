const express = require('express');
const router = express.Router();

const neo4j = require('neo4j-driver').v1;

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

router.get('/', (req, res) => {
    res.send('api works');
});


module.exports = router;