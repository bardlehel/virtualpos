(function() {
    'use strict';

    define(['posarray', 'ticket'], function (POSArray, Ticket) {

        var Tickets = function (apiKey, locationURL) {
            POSArray.call(this, apiKey, locationURL + 'tickets/', Ticket);
            console.log('tickets construction');
            this.objectName = 'Tickets';

        };

        Tickets.prototype = Object.create(POSArray.prototype);

        return Tickets;
    })
}());
