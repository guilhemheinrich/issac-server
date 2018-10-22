var contingency = require('./common/contingency_chain').contingency;
var databases = require('./configuration/databases.json');
var bindings = require('./configuration/models-databases-bindings.json');

var safeAccessor = require('./common/safe_accessor');
var models = require('./models').models;


var _dispatcher = (protocol) => {
    protocol_mapping = require('./protocols-specifications/protocols_mappings.json')
    return require('./protocols-specifications/' + protocol_mapping[protocol]);
}
var writePipeline = (model, objects) => {
    // Step 1 Find the relevant attributes for each databases
    modelsAttributes = Object.keys(models[model]);
    databasesXattributes = {};
    modelsAttributes.forEach((attribute) => {
        database_name = getDatabasesName(model, attribute, "write");
        // We expect the database_name to have exactly one element
        if (database_name.length == 1) {
            // databasesXattributes[attribute] = database_name[0];
            if (!databasesXattributes[database_name[0]]) {
                databasesXattributes[database_name[0]] = [];
            }
            databasesXattributes[database_name[0]].push(attribute);
        } else {
            console.log(model + '.' + ' doesn\'t write in one database');
        }
    });

    _databases = {};
    databases.forEach((db) => {
        _databases[db.name] = db.requestProtocol
    })
    nested_objects = {};
    Object.keys(databasesXattributes).forEach((db_name) => {
        _dispatcher(_databases[db_name])
        .insertRequest(objects, model, databasesXattributes[db_name], nested_objects);
    });
    return nested_objects;
}

var getProtocols = (databasesNameArray) => {
    dbXprtcl = {};
    Object.keys(databases).forEach((protocol) => {
        protocol.databases.forEach((database) => {
            dbXprtcl[database] = protocol;
        })
    });
    protocols = databasesNameArray.map((dbName) => dbXprtcl[dbname]);
    return protocols.filter(require('./common/unique'))
}



var getDatabasesName = (model, attribute, permission) => {
    // Filter only the database with the right permissions
    _databases = {};
    databases.forEach(
        (database) => {
            if (database.permissions) {
                _databases[database.name] = database.permissions;
            } else {
                _databases[database.name] = ["read", "write"];

            }
        })

    // Default to the database of the model, if any
    model_dbs = safeAccessor(bindings, [model, 'databases']);
    if (Array.isArray(model_dbs)) {
        model_dbs = model_dbs.filter((db) => {
            let database_level_check;
            if (_databases[db.name]) {
                database_level_check = _databases[db.name].includes(permission);
            } else {
                console.log(db.name + ' not in databases file');
                database_level_check = false;
            }
            return database_level_check;
            // if (database_level_check) {
            //     // 
            //     if (db.permissions && db.permissions.length != 0) {
            //         return db.permissions.includes(permission);
            //     } else {
            //         return true;
            //     }
            // } else {
            //     return false
            // }
        });
    }

    // If specific attribute database ...
    attribute_dbs = safeAccessor(bindings, [model, 'attributes', attribute, 'databases']);
    if (Array.isArray(attribute_dbs)) {
        attribute_dbs = attribute_dbs.filter((db) => {
            return db.permissions.includes(permission) &&
                _databases[db.name].permissions.includes(permission);
        });
    };
    final_databases = [];
    if (model_dbs) {
        final_databases = model_dbs;
    }
    if (attribute_dbs) {
        final_databases = attribute_dbs;
    }


    // We only want the names
    return final_databases.map((db) => {
        // let {name, ...complementary} = db;
        return db.name;
    });
}
module.exports = {
    getDatabasesName: getDatabasesName,
    getProtocols: getProtocols,
    writePipeline: writePipeline
}