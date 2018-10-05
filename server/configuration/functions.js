protocols_map = require('./protocols.json')
db_map = require('./databases.json')
modXprot_map = require('./modelXprotocol.json')
models_map = require('./models.json')

module.exports = {
    getDatabases: function(objectInstance) {
        /* By default, we insert the model in all databases
        */
       var databases = Object.keys(db_map);
       // Temporary use just virtuoso
       databases = ["virtuoso"];
       return databases;
    },

    getProtocols: function(objectInstance) {
        let databases = this.getDatabases(objectInstance);
        let protocols = databases.map(db => {
            return db_map[db].requestProtocol;
        });
        // From <https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates>
        function onlyUnique(value, index, self) { 
            return self.indexOf(value) === index;
        }        
        return protocols.filter(onlyUnique);
    }
}