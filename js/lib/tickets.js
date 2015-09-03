(function() {
    'use strict';

    define(['posarray', 'ticket'], function (POSArray, Ticket) {

        var Tickets = function (apiKey, locationURL) {
            POSArray.call(this, apiKey, locationURL + '/tickets/', Ticket);
            this.objectName = 'Tickets';
            this.dataPath = '_embedded.tickets';
        };

        Tickets.prototype = Object.create(POSArray.prototype);

        return Tickets;
    })
}());
