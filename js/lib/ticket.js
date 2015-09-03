(function() {
    'use strict';

    define(['posobject'], function(POSObject){

        var Ticket = function(apiKey, ticketsURL, jsonTicket) {
            POSObject.call(this, apiKey, ticketsURL, jsonTicket);
            this.objectName = 'Ticket';
        }

        Ticket.prototype = Object.create(POSObject.prototype);

        return Ticket;
    });
}());