/* Local dependencies (pathes)
    schemas loader: '../common/load_many',
    database schema: './models-schemas-yaml/generics-schemas/database.yaml'
    databases files: './databases.json'
    confi loader : '../common/conf_load'
    */

_localPath = __dirname + '/'

var Ajv = require('ajv');
var dbs_schema = require(_localPath + '../common/load_many')(_localPath + './models-schemas-yaml/generics-schemas/database-schema.yaml');

var ajv = new Ajv({
    // See reference : <https://github.com/epoberezkin/ajv#options> 
    schemas: dbs_schema,
    verbose: true,
    allErrors: true,
    coerceTypes: "array" /* For ex., will validate a single string if and array string is awaited
                            WARNING: this will change the initial data to match the schema
                            In the previous ex {uri: "http://uri"} would become  {uri: ["http://uri"]}*/
});

var conf_loader = require(_localPath + '../common/load_conf');
var _databases = conf_loader(_localPath + './databases.json');
var databases = [];
_databases.forEach((db) => {

    let validate = ajv.getSchema(dbs_schema[0]['$id']);
    var valid = validate(db);
    if (!valid) {
        console.log(db);
        console.log(ajv.errorsText(validate.errors));
    } else {
        databases.push(db);
    }
})
// Check 
module.exports = databases;

