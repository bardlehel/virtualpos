(function() {
    'use strict';

    define(['restful',  'underscore'], function(restful,  _){
        var Promise = window.Promise;

        //creates a new POS data object that encapsulates the REST data for each POS item
        //should not be used directly but used only by subclasses that abstract real POS data objects
        //_apiKey: the API key for the Company
        //_sourceURL: the endpoint for the collection of POS items
        //jsonObj (optional):  supplied data for the object (if not supplied, call load() method to populate the object with data)
        var POSObject = function(_apiKey, _sourceURL, jsonObj) {
            console.log('posobject construction');
            this.objectName = 'POSObject';
            this.dataPath = '';
            this.data = jsonObj;  //let data be public so client can set json object values directly

            var me = this;
            var sourceURL = _sourceURL;
            var apiKey = _apiKey;
            var restAPI =
                restful('api.omnivore.io')
                .header('API-Key', apiKey)
                .protocol('https');

            //returns the id of the POS Data Object
            //if the id is not jsonData.id for a given sublcass data object, this getId function should be overridden.
            this.getId = function() {
                if(me.data != undefined)
                    return me.data.id;

                return undefined;
            }


            //creates a new object via a REST post via jsonObj provided and sets this object
            //returns a Promise that resolves with id of item after POST returns successful
            this.create = function(jsonObj){
                return new Promise(function(resolve, reject) {

                    if(jsonObj == undefined) {
                        reject(new Error("invalid param"));
                        return;
                    }

                    restAPI
                        .oneUrl(sourceURL)
                        .post(jsonObj)
                        .then(
                            function(response) {
                                var entity = response.body();
                                me.data = entity.data();
                                resolve(me.data);
                            },
                            function(response){
                                reject(new Error("failed to create item"));
                            }
                        );
                });
            };


            //(re)loads the data from the webservice into the POSObject via JSON returned when queried from sourceURL
            //sourceURL should be set to the endpoint for the POS collection that this object belongs to
            //returns: Promise that resolves when the data is loaded
            this.load = function() {
                return new Promise(function(resolve, reject) {
                    console.log('POSObject.load; URL = ' + sourceURL + me.getId());
                    restAPI
                        .oneUrl(me.objectName, sourceURL + me.getId())
                        .get()
                        .then(
                        function(response) {
                            var entity = response.body();
                            me.data = entity.data();
                            resolve(me.data);
                        },
                        function(response){
                            console.log('POSObject.load failure');
                            reject(new Error("failed to load item"));
                        }
                    ).catch(function(e){console.log('POSObject.load exception'); throw e;});
                });
            }

            //saves the data set inside the json to the sourceURL
            //returns: Promise that resolves when data is posted
            this.save = function() {
                return new Promise(function(resolve, reject) {
                    restAPI
                        .oneUrl(sourceURL + me.getId())
                        .get()
                        .then(
                        function(response) {
                            var entity = response.body();
                            var eData = entity.data();
                            _.extend(eData, me.data);
                            entity.save();
                            resolve(me.data);
                        },
                        function(response){
                            reject(new Error("failed to load item"));
                        }
                    );
                });
            }
        }


        return POSObject;

    });

}());
