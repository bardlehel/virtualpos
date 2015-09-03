(function() {
    'use strict';

    define(['restful',  'underscore'], function (restful,   _) {

        var Promise = window.Promise;

        //represents a collection of POS data objects
        //should not be used directly but subclassed for real POS data collections (i.e., Locations, Tickets, etc)
        //_apiKey:  the API key for the company
        //_sourceURL: the RESTful service endpoint for the POS item collection
        //elementClass:  the name of the constructor function for the POS object to be held in this array
        var POSArray = function(_apiKey, _sourceURL, elementClass) {
            this.objectName = 'POSArray';
            this.dataPath = '';

            var me = this;
            var elements = [];
            var apiKey = _apiKey;
            var sourceURL = _sourceURL;
            var elementClass = elementClass;
            var restAPI =
                restful('api.omnivore.io')
                .header('API-Key', apiKey)
                .protocol('https');

            //returns a json array based on contents of elements
            this.getJSON = function() {
                var jsonArray = [];
                _.each(elements, function(e) {
                    e.load().then(function(json){
                        jsonArray.push(e.data);
                    });
                });

                return jsonArray;
            }

            this.getLength = function() {
                return elements.length;
            }

            this.getAt = function(index) {
                if(index == undefined || index < 0 || index >= elements.length) throw new Error(me.objectName + '.getAt: bad param');
                return elements[index];
            }

            this.getById = function(id) {
                return _.find(elements, function(e){return e.id == id});
            }


            //fetches the array of POS items from the collection endpoint and populates the member array with items
            //returns:  Promise that resolves when the GET for the collection returns json data
            this.load = function() {
                return new Promise(function (resolve, reject) {
                    restAPI
                        .allUrl(me.objectName, sourceURL)
                        .getAll()
                        .then(
                        function (response) {
                            var entity = response.body();
                            me.data = entity.data();
                            var array = eval("me.data." + me.dataPath);

                            for (var i = 0; i != array.length; i++)
                                addNoCreate(array[i]);

                            resolve(array);
                        }
                        ,
                        function (response) {
                            var message = "failed to load item:";
                            var message2 = response;
                            if(response.body) {
                                message2 = response.body;
                            if(response.body.data() != undefined)
                                message2 = respone.body.data();
                            }

                            reject(new Error(me.objectName + ".load failed to load item:" + message + message2));
                        }
                    ).catch(function(e){console.log("exception"); throw e;});
                } );
            }

            //used privately to add a POSObject to the elements array without trying to create the object on the server
            var addNoCreate = function(jsonObj) {
                if(jsonObj == undefined) {
                    throw new Error(me.objectName + '.addNoCreate given no param');
                    return;
                }

                var posObj = new elementClass(apiKey, sourceURL, jsonObj);
                elements.push(posObj);

                return posObj;
            }

            //creates a new item based on json supplied and adds it to the array
            //returns: Promise that resolves when item creation in REST service succeeds; rejects otherwise
            this.add = function(jsonObj) {
                return new Promise(function (resolve, reject) {
                    if(jsonObj == undefined) {
                        reject(new Error("bad param"));
                        return;
                    }
                    var posObj = new elementClass(apiKey, sourceURL, jsonObj);
                    posObj
                        .create(jsonObj)
                        .then(
                            function(id) {
                                elements.push(posObj);
                                resolve(id);
                            },
                            function(e) {
                                reject(e);
                            }
                    ).catch(function(e){console.log('create exception')});
                });
            }

            //removes an item in the POS collection (if exists)
            //id is the id of the POS item
            //returns a Promise that rejects if item not found or error, otherwise resolves with deleted item
            this.remove = function(id) {
                return new Promise(function(resolve, reject) {
                    if (id == undefined) {
                        reject(new Error("bad parameter"));
                    }

                    //remove item from array
                    elements =  _.reject(elements, function(d){ return d.id === id; });

                    restAPI
                        .oneUrl(sourceURL + id)
                        .get()
                        .then(
                        function(response) {
                            //take that popped item and delete.
                            response.body().remove();
                            resolve();
                        },
                        function(response) {
                            reject(new Error("failed to load item"));
                        }
                    );
                });
            }
        }


        return POSArray;
    });
}());
