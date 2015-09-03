(function() {
    'use strict';

    define(['location', 'posarray'], function (Location, POSArray) {

        var locationsURL = 'https://api.omnivore.io/0.1/locations/';

        var Locations = function (apiKey) {
            POSArray.call(this, apiKey, locationsURL, Location);
            this.objectName = 'Locations';
            this.dataPath = '_embedded.locations';
        };

        Locations.prototype = Object.create(POSArray.prototype);

        return Locations;
    })
}());
