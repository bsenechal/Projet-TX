'use strict';

angular.module('mean.deals').controller('DealsController', ['$scope','$controller','$q', '$stateParams', '$resource', '$location', 'Global', 'Deals',
  function($scope, $controller,$q, $stateParams,$resource, $location, Global, Deals) {
    $scope.global = Global;

    $scope.hasAuthorization = function(deal) {
      if (!deal || !deal.user) return false;
      return $scope.global.isAdmin || deal.user._id === $scope.global.user._id;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        this.loc = [this.longitude,this.latitude];
        var deal = new Deals({
          title: this.title,
          initialPrice: this.initialPrice,
          salePrice: this.salePrice,
          latitude: this.latitude,
          longitude: this.longitude,
          loc : this.loc,
          description: this.description
        });
        console.log("create: Tmp deal");
        console.log(deal);
        deal.$save(function(response) {
          $location.path('deals/' + response._id);
        });
        console.log("create: reinit scope");
        this.title = '';
        this.initialPrice = '';
        this.salePrice = '';
        this.latitude = '';
        this.longitude = '';
        this.loc = [];
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

    $scope.queryAll = function(){
      Deals.query(function(deals) {
          console.log("find : server results");
          console.log(deals);
          $scope.deals = deals;
          //TODO change the structure in order not to have that :
          //it seems that we need to wait for the server response... ok but isn't there a more elegant way ?
          $controller('MapDisplayController',{$scope: $scope});
      });
    }

    $scope.queryByRadius = function(){
        var DealsByRadius = $resource(
          '/dealsbyradius',
          {srchLng: $scope.srchLng,srchLat: $scope.srchLat, srchRadius: $scope.srchRadius},
          {
            query: {method:'POST',isArray: true }
          }
        );
        console.log("findByRadius: ressource created");
        DealsByRadius.query(function(deals) {
          console.log("findByRadius : server results");
          console.log(deals);
          $scope.deals = deals;
          $controller('MapDisplayController',{$scope: $scope});
        });    
    };

    $scope.findByRadius = function() {
      console.log("findByRadius");
      console.log(this.srchLng + ";"+ this.srchLat +";"+ this.srchRadius);
      if (this.srchLng && this.srchLat && this.srchRadius){
        console.log("findByRadius : with paramaters");
        //A mettre dans une factory de services ?
        //$scope.queryByRadius();

        //Basic scheme :
        //1: init an empty map
        // $controller('MapInitController',{$scope: $scope});
        //2: query the deals according to search parameters
        $scope.queryByRadius();
        //3: update the map
        // $controller('MapDisplayController', {$scope, $scope});
        //Final: Watch search parameters change, if so -> do 2 and 3 again
        // $scope.$watch('srchRadius',function(){
        //   $scope.queryByRadius();
        //   $controller('MapDisplayController', {$scope, $scope});
        // },true)
      }
      else{
        console.log("findByRadius : find : without paramaters");
        // $controller('MapInitController',{$scope: $scope});
        $scope.queryAll();
        // $controller('MapDisplayController', {$scope, $scope});
        
      }


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
