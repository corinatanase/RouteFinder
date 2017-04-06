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

            //definesc functia care 
            $scope.renderMap = function () {
                $timeout(function () {
                    $scope.isMapVisible = true;
                })
            }

            $scope.setCenter = 'current-location';

            $scope.pickupAddressChanged = function (geocodePlace) {
                $scope.place = {};
               // this.getPlace && ($scope.place = this.getPlace()) || ($scope.place = geocodePlace);
                
                
                if (geocodePlace == null) {
                    $scope.place = this.getPlace();
                }
                else $scope.place = geocodePlace;

                $scope.inputAddress = $scope.place.formatted_address;
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
            } //autocomplete callback addressChanged

            $scope.deliveryAddressChanged = function () {

                $scope.deliveryAddress = {};
                $scope.place = this.getPlace();

                $scope.deliveryLatitude = $scope.place.geometry.location.lat();
                $scope.deliveryLongitude = $scope.place.geometry.location.lng();

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
            } //delivery address changed

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
                    $scope.pickupAddress.dateRangeStart = moment();
                }
                var activeDate = moment($scope.pickupAddress.dateRangeStart).subtract(1, $view).add(1, 'minute');

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

        }]


    );

})();