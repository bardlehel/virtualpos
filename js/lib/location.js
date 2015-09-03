(function() {
    'use strict';

    define(['posobject', 'tickets'], function(POSObject, Tickets){

        var Location = function(apiKey, locationsURL, jsonLoc) {
            POSObject.call(this, apiKey, locationsURL, jsonLoc);
            this.objectName = 'Location';
            this.tickets = new Tickets(apiKey, locationsURL + jsonLoc.id);
        }

        Location.prototype = Object.create(POSObject.prototype);

        return Location;

    });
}());

