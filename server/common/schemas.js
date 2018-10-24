var localDependencies = {
    configration_file_loader: './load_conf.js'
}

var fs = require("fs")
var loader = require('./load_conf.js');


var buildSchemas = (schemasPathes) => {
    // Convert in array for conveniance
    if (!Array.isArray(schemasPathes)) {
        _schemasPathes = [schemasPathes];
    } else {
        _schemasPathes = schemasPathes;
    }

    schemas = [];
    _schemasPathes.forEach((schemaPath) => {
        try{
            if (fs.lstatSync(schemaPath).isDirectory()) {
                fs.readdirSync(schemaPath).forEach(function (file) {
                    schema = loader(file)
                    /*
                    TODO : add some schema validation
                    */
                    schemas.push(schema);
                
                });
            } else {
                schema = loader(schemaPath)
                schemas.push(schema);
            }
       }catch(e){
          // Handle error
          if(e.code == 'ENOENT'){
            //no such file or directory
            //do something
          }else {
            //do something else
          }
       }
    })
    return schemas;
}

module.exports = buildSchemas;

