'use strict';

angular.module('mean.deals').controller('DealsController', ['$scope','$controller', '$stateParams', '$location', 'Global', 'Deals',
  function($scope, $controller, $stateParams, $location, Global, Deals) {
    $scope.global = Global;
    $scope.hasAuthorization = function(deal) {
      if (!deal || !deal.user) return false;
      return $scope.global.isAdmin || deal.user._id === $scope.global.user._id;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var deal = new Deals({
          title: this.title,
          initialPrice: this.initialPrice,
          salePrice: this.salePrice,
          latitude: this.latitude,
          longitude: this.longitude,
          description: this.description
        });
        deal.$save(function(response) {
          $location.path('deals/' + response._id);
        });

        this.title = '';
        this.initialPrice = '';
        this.salePrice = '';
        this.latitude = '';
        this.longitude = '';
        this.description = '';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(deal) {
      if (deal) {
        deal.$remove(function(response) {
          for (var i in $scope.deals) {
            if ($scope.deals[i] === deal) {
	      $scope.deals.splice(i,1);
            }
          }
          $location.path('deals');
        });
      } else {
        $scope.deal.$remove(function(response) {
          $location.path('deals');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var deal = $scope.deal;
        if(!deal.updated) {
          deal.updated = [];
	}
        deal.updated.push(new Date().getTime());

        deal.$update(function() {
          $location.path('deals/' + deal._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.updateAlert = function(deal) {
       if (deal) {
         if (deal.alert === 5) {
           deal.$remove();
           $location.path('deals');
         } else {
           deal.alert++;
           deal.$update();
         }
       }
    };

	 $scope.updateGradePlus = function(deal) {
      if (deal) {
        deal.grade++;
        deal.$update();
      }
    };

    $scope.updateGradeMinus = function(deal) {
      if (deal) {
        deal.grade--;
        deal.$update();
      }
    };

    $scope.find = function() {
      Deals.query(function(deals) {
        $scope.deals = deals;
      });
    };

    $scope.listMap = function() {
      Deals.query(function(deals) {
        //call map controller once $scope.deals initialized
        $controller('MapDisplayController',{$scope: $scope});
      });
    };

    $scope.createMap = function() {
      Deals.query(function(deals) {
        //call map controller once $scope.deals initialized
        $controller('MapsController',{$scope: $scope});
      });
    };

    $scope.findOne = function() {
      Deals.get({
        dealId: $stateParams.dealId
      }, function(deal) {
        $scope.deal = deal;
      });
    };
  }
]);
