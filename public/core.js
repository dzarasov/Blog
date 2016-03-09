var blogger = angular.module('blogger', ['ui.router']);


blogger.config(function ($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    $stateProvider
        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/',
            templateUrl: 'pages/mainp.html'
        })
        .state('blog', {
            url: '/blog',
            templateUrl: 'pages/blogpage.html',
            controller: 'mainController'
        })
        .state('admin', {
            url: '/admin',
            templateUrl: 'pages/adder.html',
            controller: 'addercontroller'
        })
        .state('blogdata', {
            url: '/blogdata/:postid',
            templateUrl: 'pages/blogid.html',
            controller: 'idctrl'
        })
});






blogger.directive('myYoutube', function($sce) {
  return {
    restrict: 'EA',
    scope: { code:'=' },
    replace: true,
    template: '<div style="height:400px;"><iframe style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
    link: function (scope) {
        console.log('here');
        scope.$watch('code', function (newVal) {
           if (newVal) {
               scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);
           }
        });
    }
  };
});


blogger.directive('maps', function() {
  return {
    restrict: 'EA',
    scope: { mapscode:'=' },
    replace: true,
    template: '<div class="mapper"><div id="map"></div></div>',
    link: function (scope) {

    scope.$watch('mapscode', function (newVal) {
           if (newVal) {
               var nv = newVal.split(',')
               scope.lat = nv[0];
               scope.lon = nv[1];
               console.log('Thisss issss consoleeeeee '+  nv)

    //var lat = '34.0500'
    //var lon = '-118.2500'

    var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(scope.lat, scope.lon),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var markers = [];
    
    var infoWindow = new google.maps.InfoWindow();
    
    var createMarker = function (){
        
        var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(scope.lat, scope.lon)
        });        
        
        markers.push(marker);
        
    }    
        createMarker();
   }
    else{


    var lat = '34.0500'
    var lon = '-118.2500'

    var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(40.0000, -98.0000),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    }

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var markers = [];
    
    var infoWindow = new google.maps.InfoWindow();
    
    var createMarker = function (){
        
        var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(lat, lon)
        });        
        
        markers.push(marker);
        
    }    
        createMarker();

    }

        });
    }

    }
  });


    blogger.directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
       '<button type="button" class="closemodal" data-dismiss="modal" aria-hidden="true">Close</button>' + 
          '<div class="modal-dialog">' + 
              '<div>' + 
               
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true){
          $(element).modal('show');
          
          }
            
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });   

	
    blogger.controller('idctrl', function($scope, AddToBlogPhoto, $rootScope, $location){
            $rootScope.facebookAppId = '[FacebookAppId]'; // set your facebook app id here
            $scope.showModal = false;
            $scope.toggleModal = function(num){
                $scope.showModal = !$scope.showModal;
                $scope.imagett = num;
            };


            $scope.myModel = {
              Url: "https://www.yandex.ru/",//$location.absUrl(),
              Name: "AngularJS directives for social sharing buttons - Facebook, Google+, Twitter and Pinterest | Jason Watmore's Blog", 
              ImageUrl: 'http://www.jasonwatmore.com/pics/jason.jpg'
          };

        $scope.cl = AddToBlogPhoto.cl;
        $scope.imageStat = AddToBlogPhoto.imageStat;
        $scope.loadimage = AddToBlogPhoto.loadimage;
        
        var pId = AddToBlogPhoto.pId();
        console.log("This is a pID " + pId)

        AddToBlogPhoto.getData(pId).then(function(data){
            $scope.idpost = data;
            var data = $scope.idpost.imageBucket;
            data = data.split("|");
            $scope.newD = data;
            $scope.code = $scope.idpost.videoUrl;
            $scope.mapcode = $scope.idpost.latlon;
        })    
    })




   blogger.service('AddToBlogPhoto', function($q, $http, $location, $location, $anchorScroll){



        this.cl = false;
        this.imageStat = false;
        this.pId = function(){
            return $location.path().split("/")[2]||"Unknown";
        }

        this.loadimage = function(index){
            if(this.cl != index+1){
                this.cl = index+1;//true;
                this.imageStat = true;
            }
            else{
                this.imageStat = false;
                this.cl = 0;
            }           
            console.log(this.cl)
        };

        this.getData = function(pId){
            var defer = $q.defer();
            $http.get('/api/supersecretkey/blogdata/' + pId)
                .success(function(resp){
                    defer.resolve(resp);
                }).error(function(err){
                    defer.reject(err);
                });
                return defer.promise;
        }
    })


    
	


    blogger.controller('mainController', function($scope, ServiceForMainCTRL){
	
	$scope.formData = {};

    ServiceForMainCTRL.updateData().then(function(data){
        $scope.data = data;
    });

    $scope.createDataForBlog = function(){
        ServiceForMainCTRL.createDataForBlog($scope.formData).then(function(data){
                    $scope.formData = {};
                    $scope.data = data;
        })
    };    

    $scope.deleteData = function(id){
            ServiceForMainCTRL.deleteData(id).then(function(data){
                $scope.data = data;
            })
        };
});


    blogger.service('ServiceForMainCTRL', function($q, $http, $location){
        
        this.updateData = function(){
            var defer = $q.defer();
            $http.get('/api/supersecretkey/blogdata')
                .success(function(resp){
                    defer.resolve(resp);
                }).error(function(err){
                    defer.reject(err);
                });
                return defer.promise;
        };

        this.createDataForBlog = function(formData){
            var defer = $q.defer;
            $http.post('/api/supersecretkey/blogdata', formData)
                .success(function(resp){
                    defer.resolve(resp);
                }).error(function(err){
                    defer.reject(err);
                });
                return defer.promise;
        };

        this.deleteData = function(id){
            var defer = $q.defer;
            $http.delete('/api/supersecretkey/blogdata/' + id)
                .success(function(resp){
                    defer.resolve(resp);
                }).error(function(err){
                    defer.reject(err);
                });
                return defer.promise;
        };
    })



    blogger.controller('addercontroller', function($scope, ServiceForAdderCTRL){
	
	$scope.formData = {};
    ServiceForAdderCTRL.getDataAllTheTime().then(function(data){
        $scope.data = data;
    })      
    $scope.createDataForBlog = function(){
        ServiceForAdderCTRL.createDataForBlog($scope.formData).then(function(data){
            $scope.formData = {};
            $scope.data = data;
        })
    }    
  
    $scope.deleteData = function(id){
        ServiceForAdderCTRL.deleteData(id).then(function(data){
            $scope.data = data;
        })
    }    

});

    blogger.service('ServiceForAdderCTRL', function($http, $q){
        this.getDataAllTheTime = function(){
            var defer = $q.defer();
            $http.get('/api/supersecretkey/blogdata')
                .success(function(resp){
                    defer.resolve(resp);
                }).error(function(err){
                    defer.reject(err);
                });
                return defer.promise;
        };

        this.createDataForBlog = function(formData){
            var defer = $q.defer();
            $http.post('/api/supersecretkey/blogdata', formData)
                .success(function(resp){
                    defer.resolve(resp);
                }).error(function(err){
                    defer.reject(err);
                });
                return defer.promise;
        };

        this.deleteData = function(id){
            $http.delete('/api/supersecretkey/blogdata/' + id)
                .success(function(resp){
                    defer.resolve(resp);
                }).error(function(err){
                    defer.reject(err);
                });
                return defer.promise;
        };

    });


blogger.directive('fbLike', [
          '$window', '$rootScope', function ($window, $rootScope) {
              return {
                  restrict: 'A',
                  scope: {
                      fbLike: '=?'
                  },
                  link: function (scope, element, attrs) {
                      if (!$window.FB) {
                          // Load Facebook SDK if not already loaded
                          $.getScript('//connect.facebook.net/en_US/sdk.js', function () {
                              $window.FB.init({
                                  appId: $rootScope.facebookAppId,
                                  xfbml: true,
                                  version: 'v2.0'
                              });
                              renderLikeButton();
                          });
                      } else {
                          renderLikeButton();
                      }

                      var watchAdded = false;
                      function renderLikeButton() {
                          if (!!attrs.fbLike && !scope.fbLike && !watchAdded) {
                              // wait for data if it hasn't loaded yet
                              watchAdded = true;
                              var unbindWatch = scope.$watch('fbLike', function (newValue, oldValue) {
                                  if (newValue) {
                                      renderLikeButton();
                                      
                                      // only need to run once
                                      unbindWatch();
                                  }
                                  
                              });
                              return;
                          } else {
                              element.html('<div class="fb-like"' + (!!scope.fbLike ? ' data-href="' + scope.fbLike + '"' : '') + ' data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div>');
                              $window.FB.XFBML.parse(element.parent()[0]);
                          }
                      }
                  }
              };
          }
      ])
