// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.service','ngCordova','ja.qr','btford.socket-io'])

.run(function($ionicPlatform,$cordovaPush,$rootScope,userData) {
       var androidConfig = {
    "senderID": "982355901696",
  };
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }




   $cordovaPush.register(androidConfig).then(function(result) {
      //alert(result);
    }, function(err) {
      // Error
    })

    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
            //alert('registration ID = ' + notification.regid);
            userData.datos.pushReg = notification.regid;
          }
          break;

        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
          break;

        case 'error':
          alert('GCM error = ' + notification.msg);
          break;

        default:
          alert('An unknown GCM event has occurred');
          break;
      }
    });
  });
})

.config(function($stateProvider, $urlRouterProvider) {
 
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'Login'
    })
    .state('regis', {
      url: 'login/regis',
      templateUrl: 'templates/registrar.html',
      controller: 'Login'
    })

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })
    .state('app.regpro', {
      url: '/inventario/producto',
      views: {
        'menuContent': {
          templateUrl: 'templates/registropro.html',
          controller: 'Regpro'
        }
      }
    })
    .state('app.histcob', {
      url: '/menuprin/generarcob/histcob',
      views: {
        'menuContent': {
          templateUrl: 'templates/histcob.html',
          controller: 'Princtrl'
        }
      }
    })
    .state('app.detinvent', {
      url: '/inventario/detalles',
      params:{
        producto:{ dynamic: true }
      }
      ,
      views: {
        'menuContent': {
          templateUrl: 'templates/detprod.html',
          controller: 'Detalles'
        }
      }
    })
    .state('app.regser', {
      url: '/inventario/servicio',
      views: {
        'menuContent': {
          templateUrl: 'templates/registroser.html',
          controller: 'Regpro'
        }
      }
    })
    .state('app.genCob', {
      url: '/menuprin/generarcob',
      views: {
        'menuContent': {
          templateUrl: 'templates/generarcob.html',
          controller: 'Princtrl'
        }
      }
    })
    .state('app.genProd', {
      url: '/menuprin/generarprod',
      views: {
        'menuContent': {
          templateUrl: 'templates/generarprod.html',
          controller: 'Princtrl'
        }
      }
    })
    .state('app.qrGen', {
      url: '/menuprin/generarcob/qr',
      views: {
        'menuContent': {
          templateUrl: 'templates/qrgen.html',
          controller: 'Scanpag'
        }
      }
    })
    .state('app.reginv', {
      url: '/inventario',
      views: {
        'menuContent': {
          templateUrl: 'templates/reginv.html',
          controller: 'Invent'
        }
      }
    })
  .state('app.menuprin', {
    url: '/menuprin',
    views: {
      'menuContent': {
        templateUrl: 'templates/menuprin.html',
        controller: 'Princtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
