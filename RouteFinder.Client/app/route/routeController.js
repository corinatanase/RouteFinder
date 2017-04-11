(function () {
    "use strict";
    var app = angular.module("RouteFinder");

    app.controller("RouteController", ["$scope", "$http", "$log", "$timeout",
        function RouteController($scope, $http, $log, $timeout) {

            $scope.currentView = 'Views/login.html';


            //definesc functia de login care se apeleaza on click pe Login button
            $scope.login = function () {
                $scope.currentView = 'Views/address.html';
            }

            //definesc functia de register care se apeleaza on click pe Register button
            $scope.register = function () {
                console.log('register');
            }

            $scope.renderMap = function () {
                $timeout(function () {
                    $scope.isMapVisible = true;
                })
            }

            $scope.renderMap1 = function () {
                $timeout(function () {
                    $scope.isMapVisible1 = true;
                })
            }

            function clearField(input, valoare) {
                input.value = valoare;
            };

            $scope.setCenter = 'current-location';

            $scope.pickupAddressChanged = function (geocodePlace) {
                $scope.$apply(() => {
                    $scope.place = {};
                    // this.getPlace && ($scope.place = this.getPlace()) || ($scope.place = geocodePlace);

                    if (geocodePlace == null) {
                        $scope.place = this.getPlace();
                    }
                    else {
                        $scope.place = geocodePlace;
                        clearField(document.getElementById("input"), $scope.place.formatted_address);
                    }

                    $scope.pickupAddress = {};
                    $scope.pickupLatitude = $scope.place.geometry.location.lat();
                    $scope.pickupLongitude = $scope.place.geometry.location.lng();
                    $scope.setCenter = '[' + $scope.pickupLatitude + ', ' + $scope.pickupLongitude + ']';

                    $scope.place.address_components.forEach(function (element) {
                        switch (element.types[0]) {
                            case 'route':
                                $scope.pickupAddress.name = element.short_name;
                                break;
                            case 'street_number':
                                $scope.pickupAddress.number = element.short_name;
                                break;
                            case 'sublocality_level_1':
                                $scope.pickupAddress.district = element.short_name;
                                break;
                            case 'locality':
                                $scope.pickupAddress.city = element.short_name;
                                break;
                            case 'country':
                                $scope.pickupAddress.country = element.long_name;
                                break;
                            case 'postal_code':
                                $scope.pickupAddress.zip = element.short_name;
                                break;
                        }; //switch
                    }); //foreach
                });

            } //autocomplete callback addressChanged

            /************************** Delivery Address Changed **********************************/

            $scope.setCenter1 = 'current-location';

            $scope.deliveryAddressChanged = function (geocodePlace) {
                $scope.$apply(() => {
                    $scope.place = {};
                    // this.getPlace && ($scope.place = this.getPlace()) || ($scope.place = geocodePlace);

                    if (geocodePlace == null) {
                        $scope.place = this.getPlace();
                    }
                    else {
                        $scope.place = geocodePlace;
                        clearField(document.getElementById("input1"), $scope.place.formatted_address);
                    }

                    
                    $scope.deliveryAddress = {};
                    $scope.deliveryLatitude = $scope.place.geometry.location.lat();
                    $scope.deliveryLongitude = $scope.place.geometry.location.lng();
                    $scope.setCenter1 = '[' + $scope.deliveryLatitude + ', ' + $scope.deliveryLongitude + ']';

                    $scope.place.address_components.forEach(function (element) {
                        switch (element.types[0]) {
                            case 'route':
                                $scope.deliveryAddress.name = element.short_name;
                                break;
                            case 'street_number':
                                $scope.deliveryAddress.number = element.short_name;
                                break;
                            case 'sublocality_level_1':
                                $scope.deliveryAddress.district = element.short_name;
                                break;
                            case 'locality':
                                $scope.deliveryAddress.city = element.short_name;
                                break;
                            case 'country':
                                $scope.deliveryAddress.country = element.long_name;
                                break;
                            case 'postal_code':
                                $scope.deliveryAddress.zip = element.short_name;
                                break;
                        }; //switch
                    }); //foreach
                });

            } //autocomplete callback addressChanged


            /*******************************Datetime picker *************************************/


            // #datetimepicker start region
            $scope.endDateBeforeRender = endDateBeforeRender
            $scope.endDateOnSetTime = endDateOnSetTime
            $scope.startDateBeforeRender = startDateBeforeRender
            $scope.startDateOnSetTime = startDateOnSetTime

            function startDateOnSetTime() {
                $scope.showDeliveryDatepick = true;
                $scope.$broadcast('start-date-changed');
            }

            function endDateOnSetTime() {
                $scope.$broadcast('end-date-changed');
            }

            function startDateBeforeRender($dates) {
                var activeDate = moment().subtract(1, 'day').add(1, 'minute');

                $dates.filter(function (date) {
                    return date.localDateValue() <= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                });
            }

            function endDateBeforeRender($view, $dates) {
                if (!$scope.pickupAddress) {
                    $scope.pickupAddress = {};
                    $scope.pickupAddress.dateRangeStart = moment().add(1, 'day');
                }

                var activeDate = moment($scope.pickupAddress.dateRangeStart).add(1, 'minute');

                $dates.filter(function (date) {
                    return date.localDateValue() <= activeDate.valueOf()
                }).forEach(function (date) {
                    date.selectable = false;
                })
            }

            // #datetimepicker end region
            $scope.getCoord = function (coord) {
                $scope.pickupLatitude = coord.latLng.lat();
                $scope.pickupLongitude = coord.latLng.lng();
                $scope.setCenter = '[' + $scope.pickupLatitude + ', ' + $scope.pickupLongitude + ']';

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng($scope.pickupLatitude, $scope.pickupLongitude);
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            $scope.pickupAddressChanged(results[0]);
                            //debugger;
                        }
                    }
                });
            };

            $scope.getCoord1 = function (coord) {
                $scope.deliveryLatitude = coord.latLng.lat();
                $scope.deliveryLongitude = coord.latLng.lng();
                $scope.setCenter1 = '[' + $scope.deliveryLatitude + ', ' + $scope.deliveryLongitude + ']';

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng($scope.deliveryLatitude, $scope.deliveryLongitude);
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[0]) {
                            $scope.deliveryAddressChanged(results[0]);
                            //debugger;
                        }
                    }
                });
            };

            $scope.XMLCreate = function() {
                    var XML = new XMLWriter();

                    XML.BeginNode("transport_name");
                        XML.Node("id", "100");
                        XML.Node("order_number", "101");
                        XML.Node("order_kind_code", "default");
                        XML.BeginNode("contact");
                            XML.Node("id", "001");
                            XML.Node("code", "test");
                            XML.Node("name", "admin");
                        XML.EndNode();
                        XML.Node("productId", "default");
                        XML.BeginNode("pickup_task");
                            XML.BeginNode("address");
                                XML.Node("id", "110");
                                XML.Node("code", "A");
                                XML.Node("name", "pickup");
                                XML.Node("address_kind_code", "default");
                                XML.Node("street_name", $scope.pickupAddress.name);
                                XML.Node("door_number", $scope.pickupAddress.number);
                                XML.Node("zipcode", $scope.pickupAddress.zipcode);
                                XML.Node("area_description", "Bloc,Scara,Apt");
                                XML.Node("city", $scope.pickupAddress.city);
                                XML.Node("country_code", "RO");
                                XML.Node("givenX", $scope.pickupLatitude);
                                XML.Node("givenY", $scope.pickupLongitude);
                            XML.EndNode();
                            XML.BeginNode("start_window");
                                XML.Node("from_instant", $scope.pickupAddress.dateRangeStart);
                            XML.EndNode();
                            XML.BeginNode("finish_window");
                                XML.Node("till_instant", $scope.pickupAddress.dateRangeStart);
                            XML.EndNode();
                    XML.EndNode();

                        XML.BeginNode("delivery_task");
                            XML.BeginNode("address");
                                XML.Node("id", "110");
                                XML.Node("code", "A");
                                XML.Node("name", "pickup");
                                XML.Node("address_kind_code", "default");
                                XML.Node("street_name", $scope.deliveryAddress.name);
                                XML.Node("door_number", $scope.deliveryAddress.number);
                                XML.Node("zipcode", $scope.deliveryAddress.zipcode);
                                XML.Node("area_description", "Bloc,Scara,Apt");
                                XML.Node("city", $scope.deliveryAddress.city);
                                XML.Node("country_code", "RO");
                                XML.Node("givenX", $scope.deliveryLatitude);
                                XML.Node("givenY", $scope.deliveryLongitude);
                            XML.EndNode();
                            XML.BeginNode("start_window");
                                XML.Node("from_instant", $scope.deliveryAddress.dateRangeStart);
                            XML.EndNode();
                            XML.BeginNode("finish_window");
                                XML.Node("till_instant", $scope.deliveryAddress.dateRangeStart);
                            XML.EndNode();
                        XML.EndNode();
                    XML.EndNode();
                    XML.Close();
                    document.getElementById("ExampleOutput").value = XML.ToString().replace(/</g, "\n<");
                
            };

        }]);

})();