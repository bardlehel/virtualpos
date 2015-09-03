##Omnivore POS API (mapped to Virtual POS Client)

How it works:

src/vpos.js defines the Client API module which is defined as an AMD module to be imported (in this project via Require.js).
Inside, client api-key is set so that the object can be created and have proper access to the Omnivore services.
The object returned by this central module contains a member object called 'locations' which encapsulates the top-level data for the client's business
(the locations of the client's company and corresponding metadata)

To use the API, simply require the vpos.js module:

var POSAPI = require('vpos.js');

From here, when you want to read the data from the locations, simply call load() which will return a Promise where subsequent processing can be handled:

POSAPI.locations.load().then(function(returnedJSON) {
    //do something with the Locations data...
}

The locations object is a collection that contains Location elements, which can be added, edited or removed:

var jsonLocation =  {
    //fill in this json object with key-value pairs for the appropriate data
};

//add a new location defined by JSON
POSAPI.locations.add(jsonLocation).then(function(id) {
       console.log('the new location has an id of ' + id);

       //edit this locatiopn
       var newLoc = POSAPI.locations.getById(id);
       newLoc.address = "new address";
       newLoc.save().then(function() {
           console.log('changed address!');

            //forget it. get rid of it now...
            POSAPI.locations.remove(id).then(function() {
                console.log('it is gone!');
            });
       });
});


A location within the Locations collection contain properties such as tickets collection object which can be used to receive
all the tickets submitted for a given location as well as add and remove an individual ticket to the collection:

//get location with id of 12345 and add a ticket:

var ticketJSON = {
    //ticket key-value data
};

POSAPI.locations.getById(12345).tickets.add(ticketJSON).then(function(id) {
    console.log('ticket was submitted and has an id of:' + id);
});