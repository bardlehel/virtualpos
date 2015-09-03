//main component of application that contains the POS Locations data for the client based on the API KEY supplied
//create one of these for every client
(function(){
	'use strict';

	define(['locations'], function(Locations){

        //set the api key here
        var apiKey = '045f89bbcf664cc2bf227fa97db65331';

        //module returns an object containing the Locations object
        //client must call ClientAPIObject.locations.load().then()...
        var POSAPI = function() {
            this.locations = new Locations(apiKey);
        };

        return new POSAPI();
	});

})();