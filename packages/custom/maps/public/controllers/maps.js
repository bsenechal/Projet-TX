'use strict';



/* jshint -W098 */
angular.module('mean.maps')
    .factory('Initializer', function($window, $q) {

        //Google's url for async maps initialization accepting callback function
        var asyncUrl = 'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places&callback=',
            mapsDefer = $q.defer();

        //Callback function - resolving promise after maps successfully loaded
        $window.googleMapsInitialized = mapsDefer.resolve; // removed ()

        //Async loader
        var asyncLoad = function(asyncUrl, callbackName) {
            var script = document.createElement('script');
            //script.type = 'text/javascript';
            script.src = asyncUrl + callbackName;
            document.body.appendChild(script);
        };
        //Start loading google maps
        asyncLoad(asyncUrl, 'googleMapsInitialized');

        //Usage: Initializer.mapsInitialized.then(callback)
        return {
            mapsInitialized: mapsDefer.promise
        };
    })
    .controller('MapsController', ['$scope', '$window', 'Global', 'Maps', 'Initializer',
        function($scope, $window, Global, Maps, Initializer) {
            $scope.global = Global;
            $scope.package = {
                name: 'maps'
            };

            //TODO: make it work !
            //geolocation function :
            $scope.geolocalize = function(uPos) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        uPos = new google.maps.LatLng(position.coords.latitude,
                            position.coords.longitude);
                        console.log('geolocalize: it works');
                    }, function(error) {
                        console.log('geolocalize: Error occurred. Error code: ' + error.code);
                    }, {
                        timeout: 5000
                    });
                } else {
                    console.log('geolocalize: no geolocation support');
                }
            }


            Initializer.mapsInitialized.
            then(function() {

                //init select marker variables :
                var nbMarkerSelected = 0;
                var markerSelected = null;
                console.log("start initialize map");

                var markers = [];

                //if posible use localization :
                var userPos = new google.maps.LatLng(-28.643387, 153.612224);
                $scope.geolocalize(userPos);
                // alert(userPos);

                //Map options  :
                var mapOptions = {
                    zoom: 12,
                    //TODO : make that work !
                    streetViewControl: false,
                    // mapTypeControl: true,
                    mapTypeControl: false,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.BOTTOM_CENTER
                    },
                    zoomControl: true,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.LARGE,
                        position: google.maps.ControlPosition.LEFT_CENTER
                    },
                    scaleControl: true,
                    streetViewControl: true,
                    streetViewControlOptions: {
                        position: google.maps.ControlPosition.LEFT_TOP
                    },
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }


                var map = new google.maps.Map(document.getElementById('map-canvas'),
                    mapOptions);


                //center config :
                map.setCenter(userPos);

                console.log("mapinit");

                var defaultBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(-33.8902, 151.1759),
                    new google.maps.LatLng(-33.8474, 151.2631));
                map.fitBounds(defaultBounds);

                console.log("defaultBounds");

                // Create the search box and link it to the UI element.
                var input = /** @type {HTMLInputElement} */ (
                    $window.document.getElementById('pac-input'));


                map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

                var options = {
                    //types: ['(cities)']//,
                    //componentRestrictions: {country: "us"}
                };

                var autocomplete = new google.maps.places.Autocomplete(input, options);

                console.log("autocomplete created");

                // Listen for the event fired when the user selects an item from the
                // pick list. Retrieve the matching places for that item.
                google.maps.event.addListener(autocomplete, 'place_changed', function() {
                    console.log("Create autocomplete Listener");
                    var place = autocomplete.getPlace();

                    console.log("Search result :");
                    console.log(place);

                    if (!place.geometry) {
                        alert('no result !');
                        return;
                    }

                    // For each place, get the icon, place name, and location.

                    var bounds = new google.maps.LatLngBounds();

                    var image = {
                        url: place.icon,
                        size: new google.maps.Size(10, 10),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(0, 0),
                        scaledSize: new google.maps.Size(40, 40)
                    };

                    // Create a marker for each place.
                    var marker = new google.maps.Marker({
                        map: map,
                        //icon: image,
                        title: place.name,
                        draggable: true,
                        animation: google.maps.Animation.DROP,
                        position: place.geometry.location
                    });
                    console.log("marker 1rst position:");
                    console.log(marker.position);
                    // console.log("resultPosition before affectation : " + resultPosition);
                    // resultPosition = marker.getPosition();
                    $scope.latitude = marker.getPosition().lat();
                    $scope.longitude = marker.getPosition().lng();
                    $scope.$apply();
                    // console.log("resultPosition after affectation : "  + resultPosition);

                    //remove old marker :
                    for (var j = 0; j < markers.length; j++) {
                        markers[j].setMap(null);
                    }


                    markers.push(marker);

                    google.maps.event.addListener(marker, 'dragend', function() {
                        console.log("marker dragged");

                        //TODO : solde the apply issue -> works only partially !
                        $scope.latitude = marker.getPosition().lat();
                        $scope.longitude = marker.getPosition().lng();
                        $scope.$apply();

                        console.log(marker.getPosition());
                        map.setCenter(marker.getPosition());
                    });
                    
                    // google.maps.event.addListener(marker, 'click', function() {
                    //         if (nbMarkerSelected == 0 && !markerSelected) {
                    //             //select a marker :
                    //             console.log("select a marker");
                    //             //change color and select :
                    //             var pinColor = "87CEEB";
                    //             var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                    //                 new google.maps.Size(21, 34),
                    //                 new google.maps.Point(0, 0),
                    //                 new google.maps.Point(10, 34)
                    //             );
                    //             marker.setIcon(pinImage);
                    //             markerSelected = marker;
                    //             nbMarkerSelected = 1;
                    //         } else if (markerSelected) {
                    //             //deselect a marker :
                    //             console.log("deselect a marker");
                    //             marker.setIcon();
                    //             nbMarkerSelected = 0;
                    //             markerSelected = null;
                    //         }
                    //         console.log("marker clicked");
                    //         console.log(marker.position);
                    //         map.setCenter(marker.getPosition());

                    //     }

                    // );

                    bounds.extend(place.geometry.location);

                    //setmap center on marker :
                    if (marker) {
                        map.setCenter(marker.getPosition());
                    }
                });

                // Bias the autocomplete results towards places that are within the bounds of the
                // current map's viewport.
                google.maps.event.addListener(map, 'bounds_changed', function() {
                    var bounds = map.getBounds();
                    //limit the search on the specific displayed map :
                    //autocomplete.setBounds(bounds);
                });

            });

        }
    ])
    .controller('MapDisplayController', ['$scope', '$window', 'Global', 'Maps', 'Initializer',
        function($scope, $window, Global, Maps, Initializer) {
            $scope.global = Global;
            $scope.package = {
                name: 'maps'
            };

            Initializer.mapsInitialized.
            then(function() {

                console.log("start initialize map");

                var markers = [];

                for (var j = 0; j < markers.length; j++) {
                        markers[j].setMap(null);
                }

                var userPos = new google.maps.LatLng(-28.643387, 153.612224);
                // alert(userPos);

                //Map options  :
                var mapOptions = {
                    zoom: 12,
                    //TODO : make that work !
                    streetViewControl: false,
                    // mapTypeControl: true,
                    mapTypeControl: false,
                    mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.BOTTOM_CENTER
                    },
                    zoomControl: true,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.LARGE,
                        position: google.maps.ControlPosition.LEFT_CENTER
                    },
                    scaleControl: true,
                    streetViewControl: true,
                    streetViewControlOptions: {
                        position: google.maps.ControlPosition.LEFT_TOP
                    },
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }


                var map = new google.maps.Map(document.getElementById('map-canvas'),
                    mapOptions);


                //center config :
                map.setCenter(userPos);

                console.log("mapinit");

                var defaultBounds = new google.maps.LatLngBounds(
                    new google.maps.LatLng(-33.8902, 151.1759),
                    new google.maps.LatLng(-33.8474, 151.2631));
                map.fitBounds(defaultBounds);

                console.log("defaultBounds");

                //remove old marker :
                for (var j = 0; j < markers.length; j++) {
                    markers[j].setMap(null);
                }
                // for each (var deal in $scope.deals) {
                    

                //     // Create a marker for each place.
                //     var marker = new google.maps.Marker({
                //         map: map,
                //         //icon: image,
                //         title: place.name,
                //         draggable: true,
                //         animation: google.maps.Animation.DROP,
                //         position: google.maps.LatLng(deal.latitude,deal.longitude)
                //     });
                //     console.log("marker 1rst position:");
                //     console.log(marker.position);
                //     // console.log("resultPosition before affectation : " + resultPosition);
                //     // resultPosition = marker.getPosition();
                //     // console.log("resultPosition after affectation : "  + resultPosition);
                //     markers.push(marker);

                // }



                });

        }
    ]);