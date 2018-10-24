var localDependencies = {
    configration_file_loader: './load_conf.js'
}

var fs = require("fs")
var path = require("path");
var pathValidator = require('is-valid-path')
var pointer = require('json-pointer')
var loader = require('./load_conf.js');

// var _inserter = (options) => {
//     insert = () => undefined;
//     if (!options.dictionary ||
//         options.dictionary == false) {
//             insert = (file, object, $refArray) => {
//                 $refArray.push(object);
//             };
//     } else {

//         switch (options.dictionary) {
//             case true:
//             case 'default':
//             case 'FULLPATH':
//                 insert = (file, object, $refDictionary) => {
//                     key = path.resolve(file);
//                     $refDictionary[key] = object;
//                 };
//                 break;
//             case 'FILENAME':
//                 insert = (file, object, $refDictionary) => {
//                     key = path.basename(file);
//                     $refDictionary[key] = object;
//                 };
//                 break;
//             default:
//                 if (Array.isArray(options.dictionary)) {
//                     insert = (file, object, $refDictionary) => {
//                         json_pointer = pointer.parse(options.dictionary);
//                         key = pointer(object)
//                             // .has(json_pointer)
//                             .get(json_pointer);
//                         if (key) {
//                             $refDictionary[key] = object;
//                         }
//                     }
//                 } else {
//                     // TODO : Check if it is a valid JSON pointer path
//                     if (pathValidator(options.dictionary)) {
//                         insert = (file, object, $refDictionary) => {
//                             json_pointer = options.dictionary;
//                             key = pointer(object)
//                                 // .has(json_pointer)
//                                 .get(json_pointer);
//                             if (key) {
//                                 $refDictionary[key] = object;
//                             }
//                         }
//                     }
//                 }
//         }
//     }
//     return insert;
// }

var buildSchemas = (schemasPathes,
    options = {}) => {
    // dictionary = options.dictionary

    // Convert in array for conveniance
    if (!Array.isArray(schemasPathes)) {
        _schemasPathes = [schemasPathes];
    } else {
        _schemasPathes = schemasPathes;
    }

    // insert = _inserter(options);
    // if (dictionary) {
    //     schemas = {};
    // } else {
    //     schemas = [];
    // }
    schemas = [];

    _schemasPathes.forEach((schemaPath) => {
        try {
            if (fs.lstatSync(schemaPath).isDirectory()) {
                fs.readdirSync(schemaPath).forEach(
                    ((file) => {
                        schema = loader(_schemasPathes + '/' + file)
                        /*
                        TODO : add some schema validation
                        */
                        schemas.push(schema);
                        //    insert(file, schema, schemas);
                    })
                );
            } else {
                schema = loader(schemaPath);
                schemas.push(schema);
                // insert(schemaPath, schema, schemas);
            }
        } catch (e) {
            // Handle error
            if (e.code == 'ENOENT') {
                //no such file or directory
                //do something
            } else {
                //do something else
            }
        }
    })
    return schemas;
}

module.exports = buildSchemas;

