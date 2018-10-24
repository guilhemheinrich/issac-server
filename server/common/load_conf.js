YAML = require('yamljs');


var _load = (file) => {
    extension = file.substring(file.lastIndexOf('.')+1, file.length) || file;
    let jsonObject;
    switch (extension)
    {
        case 'yaml':
        case 'yml':
        jsonObject = YAML.load(file);
        break;
        case 'json':
        jsonObject = require(file);
        break;
    }
    return jsonObject;
}

module.exports = _load
