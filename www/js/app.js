// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.service','ngCordova','ja.qr','btford.socket-io'])

.run(function($ionicPlatform) {
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
      url: '/menuprin/generar',
      views: {
        'menuContent': {
          templateUrl: 'templates/generar.html',
          controller: 'Princtrl'
        }
      }
    })
    .state('app.qrGen', {
      url: '/menuprin/generar/qr',
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
