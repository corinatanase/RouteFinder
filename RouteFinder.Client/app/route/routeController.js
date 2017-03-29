(function () {
    "use strict";
    var app = angular.module("routeFinder");

    app.factory("DateTimeService", [function () {
        var factory = {};

        factory.date = new Date();

        factory.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            this.opened = true;
        };

        factory.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];

        return factory;
    }

    ]);

    app.directive('routeDatepicker', function () {
        return {
            restrict: 'AE',
            scope: true,
            controller: ['$scope', 'DateTimeService', function DateTimeController($scope, DateTimeService) {

                $scope.date = DateTimeService.date;
                $scope.time = DateTimeService.date;

                $scope.open = DateTimeService.open;
                $scope.format = DateTimeService.formats[0];

                $scope.dateOptions = {
                    maxDate: new Date(2020, 5, 22),
                    minDate: new Date(),
                    startingDay: 1
                };

            }],
            templateUrl: 'Templates/datepicker.html'
        };

    });

    app.controller("RouteController", ["$scope", "$http", "DateTimeService",
        function RouteController($scope, $http, DateTimeService) {

            $scope.currentView = 'Views/login.html';
            $scope.login = function () {
                $scope.currentView = 'Views/address.html';
            }

            $scope.register = function () {
                console.log('register');
            }

            $scope.addressChanged = function () {
                $scope.place = this.getPlace();
                $scope.pickupAddress = {};
                $scope.latitude = $scope.place.geometry.location.lat();
                $scope.longitude = $scope.place.geometry.location.lng();


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

                    };
                });
            };

            $scope.address1Changed = function () {
                $scope.place1 = this.getPlace();
                $scope.deliveryAddress = {};
                $scope.latitude1 = $scope.place1.geometry.location.lat();
                $scope.longitude1 = $scope.place1.geometry.location.lng();

                    $scope.place1.address_components.forEach(function (element) {
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

                        };
                    });        

             };

            
        }
    ]);

})();