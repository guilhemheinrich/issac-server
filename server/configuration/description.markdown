
## General philosophy

This set of three files, _protocols.json, databases.json, modelXlanguage.json and models_, are the three configuration files whuich should carry all the information to insert and retrieve data from a set of services/databases.
Coming from a client sending an object instance, the procedure gather required information from the most general to the most specific, for each language/service, before sending the request on the various endpoint.

**protocols > databases > modelXlanguage > models > instance**

At each step, the relevant information (if present) overides the current one.


## Mappings file description

#### Protocols

This file defaults settings for the request languages. Each of those languages **must** implements the necessary parsing functions for the wanted operations

#### Databases

This file provides databases and/or endpoint information, such as dsn/endpoint, credentials, request language or protocol, etc...
It maps each of those endpoints to a language,


#### Model X Protocol bindings

These files provides the links between the model received by the server and the protocols.

#### Models 

This file provides the skeleton of the entities.