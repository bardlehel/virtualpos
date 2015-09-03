(function() {
    'use strict';

    define(['posobject'], function(POSObject){

        var Ticket = function(apiKey, ticketsURL, jsonTicket) {
            console.log('ticket construction');
            this.objectName = 'Ticket';
            POSObject.call(this, apiKey, ticketsURL, jsonTicket);
        }

        Ticket.prototype = Object.create(POSObject.prototype);

        return Ticket;

    });
}());