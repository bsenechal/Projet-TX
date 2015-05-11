'use strict';

//TODO: make it work !
//geolocation function :
function geolocalize(map, navigator) {
    var uPos;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            uPos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);
            map.setCenter(uPos);
            console.log('geolocalize: it works');
        }, function(error) {
            console.log('geolocalize: Error occurred. Error code: ' + error.code);
        }, {
            timeout: 5000
        });
    } else {
        console.log('geolocalize: no geolocation support');
        uPos = new google.maps.LatLng(-28.643387, 153.612224);
        map.setCenter(uPos);
    }
    
}



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
    .controller('MapInitController', ['$scope', '$window', 'Global', 'Maps', 'Initializer',
        function($scope, $window, Global, Maps, Initializer) {
            Initializer.mapsInitialized.
            then(function() {
                console.log("start initialize map");

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
                    streetViewControlOptions: {
                        position: google.maps.ControlPosition.LEFT_TOP
                    },
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                if(!$scope.map){
                    $scope.map = new google.maps.Map(document.getElementById('map-canvas'),
                        mapOptions);
                }   

                console.log("Map created");

                // ****************************
                // ****************************
                //      Set AUTOCOMPLETE
                // ****************************
                // ****************************
                if(!$scope.input){                
                    $scope.input = /** @type {HTMLInputElement} */ (
                        document.getElementById('pac-input'));
                        console.log("Got pac-input as input");
                        console.log("Input :" + $scope.input);

                        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push($scope.input);

                        console.log("Put input in map");
                }

 
                var options = {
                    //types: ['(cities)']//,
                    //componentRestrictions: {country: "us"}
                };
                if(!$scope.autocomplete){
                    $scope.autocomplete = new google.maps.places.Autocomplete($scope.input, options);
                }

                console.log("autocomplete created");

                //init circle and markers array :
                //clean old circle !
                if($scope.circle && !($scope.srchLng && $scope.srchLat && $scope.srchRadius)){
                    $scope.circle.setMap(null);
                }
                if(!$scope.markers){                
                    $scope.markers = [];
                }else
                {
                    for (var j = 0; j < $scope.markers.length; j++) {
                        $scope.markers[j].setMap(null);
                    }
                }
                console.log("API and map: loaded !");
            },function(){console.log("API not loaded !")});
    }])
    .controller('MapsController', ['$scope', '$window', 'Global', 'Maps', 'Initializer',
        function($scope, $window, Global, Maps, Initializer) {
            $scope.global = Global;
            $scope.package = {
                name: 'maps'
            };

            //************************************
            //************************************
            // NEED TO BE GENERIC !!!
            //************************************
            //************************************
            //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<            

            Initializer.mapsInitialized.
            then(function() {

                //init select marker variables :
                var nbMarkerSelected = 0;
                var markerSelected = null;
                console.log("start initialize map");

                $scope.markers = [];

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
                };


                $scope.map = new google.maps.Map(document.getElementById('map-canvas'),
                    mapOptions);


                console.log("mapinit");

                // var defaultBounds = new google.maps.LatLngBounds(
                //     new google.maps.LatLng(-33.8902, 151.1759),
                //     new google.maps.LatLng(-33.8474, 151.2631));
                // $scope.map.fitBounds(defaultBounds);

                console.log("defaultBounds");


                // ****************************
                // ****************************
                //      Set AUTOCOMPLETE
                // ****************************
                // ****************************

                // Create the search box and link it to the UI element.
                var input = /** @type {HTMLInputElement} */ (
                    document.getElementById('pac-input'));


                $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

                var options = {
                    //types: ['(cities)']//,
                    //componentRestrictions: {country: "us"}
                };

                var autocomplete = new google.maps.places.Autocomplete(input, options);

                console.log("autocomplete created");

                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


                //if posible use localization to center the map:
                geolocalize($scope.map, navigator);
                // Listen for the event fired when the user selects an item from the
                // pick list. Retrieve the matching places for that item.
                if($scope.place_changedListener){
                    google.maps.event.removeListener($scope.place_changedListener); 
                }

                $scope.place_changedListener = google.maps.event.addListener(autocomplete, 'place_changed', function() {
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
                        map: $scope.map,
                        //icon: image,
                        title: place.name,
                        draggable: true,
                        animation: google.maps.Animation.DROP,
                        position: place.geometry.location
                    });
                    console.log("marker 1rst position:");
                    console.log(marker.position);

                    $scope.latitude = marker.getPosition().lat();
                    $scope.longitude = marker.getPosition().lng();

                    $scope.$apply();
                    // console.log("resultPosition after affectation : "  + resultPosition);

                    //remove old marker :
                    for (var j = 0; j < $scope.markers.length; j++) {
                        $scope.markers[j].setMap(null);
                    }


                    $scope.markers.push(marker);
                    if($scope.dragendListener){
                        google.maps.event.removeListener($scope.dragendListener); 
                    }

                    $scope.dragendListener = google.maps.event.addListener(marker, 'dragend', function() {
                        console.log("marker dragged");

                        //TODO : solde the apply issue -> works only partially ! -> DONE
                        $scope.latitude = marker.getPosition().lat();
                        $scope.longitude = marker.getPosition().lng();

                        //done in the deal controller :
                        // $scope.loc = [marker.getPosition().lng(),marker.getPosition().lat()];

                        $scope.$apply();

                        console.log(marker.getPosition());
                        $scope.map.setCenter(marker.getPosition());
                    });

                    bounds.extend(place.geometry.location);

                    //setmap center on marker :
                    if (marker) {
                        $scope.map.setCenter(marker.getPosition());
                    }
                });

                // Bias the autocomplete results towards places that are within the bounds of the
                // current map's viewport.
                google.maps.event.addListener($scope.map, 'bounds_changed', function() {
                    var bounds = $scope.map.getBounds();
                    //limit the search on the specific displayed map :
                    //autocomplete.setBounds(bounds);
                });
            })
        }
    ])
    .controller('MapDisplayController', ['$scope', '$window', 'Global', 'Maps', 'Initializer',
        function($scope, $window, Global, Maps, Initializer) {
            $scope.global = Global;
            $scope.package = {
                name: 'maps'
            };
            console.log("In MapDisplayController");

            //************************************
            //************************************
            // NEED TO BE GENERIC !!!
            //************************************
            //************************************
            //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
            //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

            Initializer.mapsInitialized.
            then(function() {

                console.log("start initialize map");

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
                    streetViewControlOptions: {
                        position: google.maps.ControlPosition.LEFT_TOP
                    },
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                if(!$scope.map){
                    $scope.map = new google.maps.Map(document.getElementById('map-canvas'),
                        mapOptions);
                }   

                console.log("Map created");

                // ****************************
                // ****************************
                //      Set AUTOCOMPLETE
                // ****************************
                // ****************************
                if(!$scope.input){                
                    $scope.input = /** @type {HTMLInputElement} */ (
                        document.getElementById('pac-input'));
                        console.log("Got pac-input as input");
                        console.log("Input :" + $scope.input);

                        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push($scope.input);

                        console.log("Put input in map");
                }

 
                var options = {
                    //types: ['(cities)']//,
                    //componentRestrictions: {country: "us"}
                };
                if(!$scope.autocomplete){
                    $scope.autocomplete = new google.maps.places.Autocomplete($scope.input, options);
                }

                console.log("autocomplete created");

                //init circle and markers array :
                //clean old circle !
                if($scope.circle && !($scope.srchLng && $scope.srchLat && $scope.srchRadius)){
                    $scope.circle.setMap(null);
                }
                if(!$scope.markers){                
                    $scope.markers = [];
                }else
                {
                    for (var j = 0; j < $scope.markers.length; j++) {
                        $scope.markers[j].setMap(null);
                    }
                }

                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

                // Listen for the event fired when the user selects an item from the
                // pick list. Retrieve the matching places for that item.
                if($scope.place_changedListener){
                    google.maps.event.removeListener($scope.place_changedListener); 
                }
                
                $scope.place_changedListener = google.maps.event.addListener($scope.autocomplete, 'place_changed', function() {
                        
                    console.log("Create autocomplete Listener");
                    var place = $scope.autocomplete.getPlace();

                    console.log("Search result :");
                    console.log(place);

                    if (!place.geometry) {
                        alert('no result !');
                        return;
                    }
                    console.log("init search circle :");
                    //clean old circle !
                    if($scope.circle){
                        $scope.circle.setMap(null);
                    }
                    $scope.srchRadius = 1000000;
                    var circleOptions = {
                        center: place.geometry.location,
                        radius: $scope.srchRadius,
                        map: $scope.map,
                        editable: true
                    };

                    $scope.circle = new google.maps.Circle(circleOptions);
                    $scope.srchLng = $scope.circle.getCenter().lng();
                    $scope.srchLat = $scope.circle.getCenter().lat();


                    if($scope.radius_changedListener){
                        google.maps.event.removeListener($scope.radius_changedListener); 
                    }
                    $scope.radius_changedListener = google.maps.event.addListener($scope.circle, 'radius_changed', function () {
                        $scope.srchRadius = $scope.circle.getRadius();
                        // $scope.srchLng = $scope.circle.getCenter().lng();
                        // $scope.srchLat = $scope.circle.getCenter().lat();
                        //Clear listener :
                    // $scope.mapChanged = true;
                        $scope.$apply();
                        $scope.queryByRadius();
                    });

                    if($scope.center_changedListener){
                        google.maps.event.removeListener($scope.center_changedListener); 
                    }
                    $scope.center_changedListener = google.maps.event.addListener($scope.circle, 'center_changed', function () {
                        // $scope.srchRadius = $scope.circle.getRadius();
                        $scope.srchLng = $scope.circle.getCenter().lng();
                        $scope.srchLat = $scope.circle.getCenter().lat();
                        //Clear listener :
                    // $scope.mapChanged = true;
                        $scope.$apply();
                        $scope.queryByRadius();
                    });           
                    //Clear listener :
                    // $scope.mapChanged = true;
                    $scope.$apply();
                    $scope.queryByRadius();
                });
                          
                console.log("mapinit");

                //remove old marker :
                for (var j = 0; j < $scope.markers.length; j++) {
                    $scope.markers[j].setMap(null);
                }
                
                console.log("deals");
                console.log($scope.deals);

                for (var i = 0; i < $scope.deals.length; i++) {
              
                    // Create a marker for each place.
                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        //icon: image,
                        title: $scope.deals[i].title,
                        draggable: false,
                        animation: google.maps.Animation.DROP,
                        position: new google.maps.LatLng($scope.deals[i].latitude,$scope.deals[i].longitude)
                    });
                    
                    console.log("marker lat/lng from $scope.deals[i]:");
                    console.log("{" + $scope.deals[i].latitude + ";" + $scope.deals[i].longitude + "}");
                    console.log("marker " + i + "; position:");
                    console.log(marker.position);
                    // console.log("resultPosition before affectation : " + resultPosition);
                    // resultPosition = marker.getPosition();
                    // console.log("resultPosition after affectation : "  + resultPosition);
                    $scope.markers.push(marker);

                }

                //recenter on result :
                var bounds = new google.maps.LatLngBounds();
                for(i=0;i<$scope.markers.length;i++) {
                 bounds.extend($scope.markers[i].getPosition());
                }

                $scope.map.fitBounds(bounds);
            });
        }
    ]);