
        var watchID;
        var geo;    // for the geolocation object
        var map;    // for the google map object
        var mapMarker;  // the google map marker object

        // position options
        var MAXIMUM_AGE = 200; // miliseconds
        var TIMEOUT = 300000;
        var HIGHACCURACY = true;

        function getGeoLocation() {
            try {
                if( !! navigator.geolocation ) return navigator.geolocation;
                else return undefined;
            } catch(e) {
                return undefined;
            }
        }

        function show_map(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var latlng = new google.maps.LatLng(lat, lon);

            if(map) {
                map.panTo(latlng);
                mapMarker.setPosition(latlng);
            } else {
                var myOptions = {
                    zoom: 18,
                    center: latlng,

                    // mapTypeID --
                    // ROADMAP displays the default road map view
                    // SATELLITE displays Google Earth satellite images
                    // HYBRID displays a mixture of normal and satellite views
                    // TERRAIN displays a physical map based on terrain information.
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                map.setTilt(0); // turns off the annoying default 45-deg view

                mapMarker = new google.maps.Marker({
                    position: latlng,
                    title:"You are here."
                });
                mapMarker.setMap(map);
            }
        }

        function geo_error(error) {
            stopWatching();
            switch(error.code) {
                case error.TIMEOUT:
                    alert('Geolocation Timeout');
                    break;
                case error.POSITION_UNAVAILABLE:
                    alert('Geolocation Position unavailable');
                    break;
                case error.PERMISSION_DENIED:
                    alert('Geolocation Permission denied');
                    break;
                default:
                    alert('Geolocation returned an unknown error code: ' + error.code);
            }
        }

        function stopWatching() {
            if(watchID) geo.clearWatch(watchID);
            watchID = null;
        }

        function startWatching() {
            watchID = geo.watchPosition(show_map, geo_error, {
                enableHighAccuracy: HIGHACCURACY,
                maximumAge: MAXIMUM_AGE,
                timeout: TIMEOUT
            });
        }

        window.onload = function() {
            if((geo = getGeoLocation())) {
                startWatching();
            } else {
                alert('Geolocation not supported.')
            }
        }
    