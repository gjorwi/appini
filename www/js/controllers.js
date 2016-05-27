angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope,$state, $ionicModal, $timeout,userData) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  //alert("menu");
  // Form data for the login modal
  $scope.loginData = {};
  $scope.cancelar = function() {
    userData={};
  };
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $state.go('login');
  };

  // Ir a pagina principal
  $scope.pyme = function() {
    $state.go('app.menuprin');
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistCtrl', function($scope, $stateParams,datos) {
  $scope.detalle=datos.cancion();
})

.controller('Login', function($scope,$state,$ionicModal,socket,$ionicHistory, $ionicPopup,userData) {
  $scope.choice={};
  $scope.valinput='';
  //alert("login");
  $ionicModal.fromTemplateUrl('templates/tiporif.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.alertMessage ="Error";
  $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Alerta',
       template: $scope.alertMessage
     });

     alertPopup.then(function(res) {
       console.log('El usuario ha confirmado el pago');
     });
   };
  $scope.closeModal = function() {
    $scope.modal.hide();
    //$scope.valinput=$scope.choice.tiprif;
    //alert($scope.choice.tiprif);
  };
  $scope.logdata={};
  $scope.login = function(){
    if(!$scope.logdata.usu || !$scope.logdata.pass){
      $scope.alertMessage = 'Usuario o contraseña se encuentra en blanco!';
      $scope.showAlert();
    }
    else{
      socket.emit('logemp',$scope.logdata);
      //$state.go('app.menuprin');
    }
    socket.removeListener('logDesition');
    socket.on('logDesition', function(desition){
      if(desition.message=='false'){
        $scope.alertMessage = 'Usuario o Contraseña invalida!';
        $scope.showAlert();
        $scope.loginData ={};
      }
      else if(desition.message=='true'){
        userData.datos = desition;
        //alert(userData.datos.userId);
        $state.go('app.menuprin');
      }
    });
  } 
  $scope.regis = function(){
    $state.go('regis');
  } 
  $scope.tiprif = function(){
    $scope.modal.show();
  }
  $scope.register = function(){
    //alert('id:'+$scope.choice.email);
    if(!$scope.choice.userId ||!$scope.choice.name|| !$scope.choice.tiprif||!$scope.choice.rif||!$scope.choice.email
      ||!$scope.choice.direccion || !$scope.choice.tel ||!$scope.choice.password ||!$scope.choice.confirmPass ){
      $scope.alertMessage = 'Faltan campos por llenar';
      $scope.showAlert();
    }
    else if($scope.choice.email==undefined){
        $scope.alertMessage = 'El correo ingresado es invalido';
        $scope.showAlert();
        $scope.choice.password ='';
        $scope.choice.confirmPass='';
    }
    else if($scope.choice.password!=$scope.choice.confirmPass){
        $scope.alertMessage = 'Las contraseñas no coinciden';
        $scope.showAlert();
        $scope.choice.password ='';
        $scope.choice.confirmPass='';
    }
    else{
      socket.emit('registerEmp',$scope.choice);
      
    }
    socket.removeListener('cantRegis');
    socket.on('cantRegis',function(){
      $scope.alertMessage = 'La empresa ya se encuentra registrada!';
      $scope.showAlert();
    });
    socket.removeListener('regOk');
    socket.on('regOk',function(){
      $scope.alertMessage = 'Sus datos fueron registrados Exitosamente!';
      $scope.showAlert();
      $ionicHistory.goBack(-1);
    });
    
  }

})

.controller('Princtrl', function($scope,$stateParams,$state,$filter,socket,userData,ventas,pagoService) {
  if (!userData.datos.userId) {
    $state.go('login');
  }
  //alert('hola');
  $scope.genCob = function(){
     $state.go('app.genCob');
  }
  $scope.ir = function(){
     $state.go('app.reginv');
  }
  $scope.Swiper=null;
  $scope.index = 0;
  $scope.page = 'Cobros';
  $scope.options = {
           onSlideChangeEnd: function(swiper){
            if(swiper.activeIndex == 0)
            $scope.page ='Cobros';
            if(swiper.activeIndex == 1){
              $scope.page ='Ventas';
              socket.emit('sqlventas',userData.datos.userId);
            }
            if(swiper.activeIndex == 2){
            $scope.page ='Estadisticas';
            }   
            $scope.$apply();
           },
           onInit:function(swiper){
              $scope.declareSwiper(swiper);
              $scope.$digest();
           },
           pagination: false

      }
    $scope.declareSwiper = function(swiper){
      $scope.Swiper = swiper;
    }
    $scope.slideTo = function(slide){
    $scope.Swiper.slideTo(slide, 200, true);
  }
  $scope.dataVentas=[];
  socket.removeListener('repsqlventas');
  socket.on('repsqlventas',function(ventas){
    //alert(JSON.parse(ventas));

    $scope.dataVentas=ventas;
    //alert($scope.dataVentas[0]);
    if ($scope.dataVentas[0]=='f') {
      $scope.dataVentas=[];
    }
    $scope.counventas=$scope.dataVentas.length;
    //alert(JSON.parse(ventas));
  });
///////////////////////////////////////GENERAR COBRO///////////////////////////////////////

$scope.pago = 0.00;
$scope.multiplo = 10;
$scope.oldNumber = 0.00;
$scope.actualPago = '0.00';
$scope.totalPago = {};
$scope.date = new Date();
 $scope.datescope = $filter('date')(new Date(), 'short');
//$scope.total = 
$scope.zoom = 112;
$scope.string = "hola prueba generar";
  $scope.sum = function(number){
    number = number*0.01;
    if($scope.oldNumber<0.01){
      $scope.pago = number;
      $scope.oldNumber = number;
      $scope.actualPago = $scope.pago.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    }

    else{

      $scope.oldNumber = $scope.oldNumber*$scope.multiplo;

      var x = $scope.oldNumber + number;

      $scope.pago = x.toFixed(2);
      $scope.oldNumber = $scope.pago;

         $scope.actualPago = $scope.pago.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
         //pagoService.pago = $scope.actualPago;
    }

  }


  $scope.restar = function(){
  $scope.pago = 0.00;
  //this.multiplo = 0.01;
  $scope.oldNumber = 0.00;
   $scope.actualPago ='0.00';
}

$scope.comapunto = function(){
  $scope.actualPago = $scope.actualPago.replace(/,/g,'.');
  alert($scope.actualPago);
}

$scope.qrGen = function(){
//alert(userData.datos.userId);
$scope.totalPago = {id:userData.datos.userId, monto:$scope.actualPago, fecha:$scope.datescope};
socket.emit('genVenta', $scope.totalPago);
socket.on('ventaRegistrado', function(pagreg){
  pagoService.pago=pagreg;
  $state.go('app.qrGen');
});

}

///////////////////////////////////////GENERAR COBRO///////////////////////////////////////
})

.controller('Invent', function($timeout,$scope,$stateParams,$state,$filter,$ionicModal,userData,socket,invent,detalle) {
  if (!userData.datos.userId) {
    $state.go('login');
  }
  $scope.sql=function(){
    socket.emit('sqlprod',userData.datos.userId);
    socket.emit('sqlserv',userData.datos.userId);
  };
  $scope.sql();
  
  $scope.check={
    val:'false',
    check:"input"
  };
  $scope.tipo="producto";
  $scope.srcfun="srcpro()";
  $scope.cambiar=function(val){
    $scope.check.val=val;
    if (val==false) {

      $scope.tipo="producto";
      $scope.srcfun="srcpro()";
      //alert("Productos");
    }
    else{
      $scope.tipo="servicio";
      $scope.srcinv='';
      $scope.srcfun="srcinv()";
      //alert("Servicios");
    };
  }
  //alert($scope.check.val);
  $scope.choice={categoria:''};
  $scope.srcinv='';
  $scope.counprod=1;
  $scope.counventa='';
  $ionicModal.fromTemplateUrl('filtro.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.srcinv=$scope.choice.categoria;
    //alert($scope.choice.categoria);
  };
  $scope.$on('modal.hidden', function() {
  });
  $scope.detprod='';
  $scope.Swiper=null;
  $scope.index = 0;
  $scope.pageInv = 'Inventario';
  $scope.options = {
    onSlideChangeEnd: function(swiper){
      if(swiper.activeIndex == 0){
        $scope.pageInv ='Productos';
        socket.emit('sqlprod',userData.datos.userId);
        socket.emit('sqlserv',userData.datos.userId);
      }
      if(swiper.activeIndex == 1)
      $scope.pageInv ='Categorias';  
      $scope.$apply();
     },
     onInit:function(swiper){
        $scope.declareSwiper(swiper);
        $scope.$digest();
     },
     pagination: false
    }
    $scope.declareSwiper = function(swiper){
      $scope.Swiper = swiper;
    }
    $scope.slideTo = function(slide){
      $scope.Swiper.slideTo(slide, 200, true);
    }
  socket.removeListener('repsqlprod');
  socket.on('repsqlprod',function(prod){
    
    $scope.dataVentas=prod;
    invent.inventario=prod;
    if ($scope.dataVentas[0]=='f') {
      $scope.dataVentas=[];
    }
    $scope.counprod=$scope.dataVentas.length;
  });
  socket.removeListener('repsqlserv');
  socket.on('repsqlserv',function(venta){
    //alert(JSON.parse(ventas));

    $scope.venta=venta;
    //alert($scope.dataVentas[0]);
    if ($scope.venta[0]=='f') {
      $scope.venta=[];
    }
    $scope.counprod2=$scope.venta.length;
    //alert(JSON.parse(ventas));
  });

  $scope.funcreg = function(tipo) {
    if (tipo=="producto") {
      $state.go('app.regpro');
    }else{
      $state.go('app.regser');
    };
  };
  $scope.detalle = function(producto) {
    alert(producto);
    //$scope.nomprod=producto;
    detalle.detprod=producto;
    alert(detalle.detprod);
    $state.go('app.detinvent');
  };
  
  
})

.controller('Detalles', function($scope,$stateParams,$state,$ionicPopup,detalle,userData,$timeout) {
  if (!userData.datos.userId) {
    $state.go('login');
  }
  alert("detalles");
      $scope.nomprod=detalle.giveDet();

})
.controller('Regpro', function($scope,$stateParams,$state,$ionicPopup,socket,userData) {
  $scope.regprod={};
  $scope.alertMessage ="Error";
  $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Alerta',
       template: $scope.alertMessage
     });

     alertPopup.then(function(res) {
     });
   };
  $scope.regProd = function(){
    //alert('id:'+$scope.choice.email);
    $scope.regprod.prodId=userData.datos.userId;
    if(!$scope.regprod.nombre|| !$scope.regprod.precio||!$scope.regprod.existencia
      ||!$scope.regprod.detalle){
      $scope.alertMessage = 'Faltan campos por llenar';
      $scope.showAlert();
    }
    else{
      socket.emit('registerprod',$scope.regprod);
    }
    socket.removeListener('cantRegisprod');
    socket.on('cantRegis',function(){
      $scope.alertMessage = 'No se pudo registrar el producto!';
      $scope.showAlert();
    });
    socket.removeListener('regOk');
    socket.on('regOk',function(){
      $scope.alertMessage = 'Producto registrado Exitosamente!';
      $scope.showAlert();
      $ionicHistory.goBack(-1);
    }); 
  }


})

.controller('Scanpag', function($scope,$stateParams,$ionicHistory,socket,$state,$cordovaBarcodeScanner,pagoService,$timeout) {
  
  $scope.datos=pagoService.givePago();
  //alert($scope.datos.ventaID);
  $scope.datos.ventaID=$scope.datos.ventaID.toString();
  //alert($scope.datos.ventaID);
  $scope.cont=1;
  $scope.time=function(){
    timer=$timeout(function() {
      
      //alert($scope.cont);
      socket.removeListener('reprefresh');
      socket.emit('refresh',$scope.datos.ventaID);
      //alert("Enviado "+$scope.datos.ventaID);
      socket.on('reprefresh',function(newid){
       // alert("recibido "+newid.control);
        if (newid.control==false) {
          $scope.trigger="Cancelado";
          dat={
            idnoti:newid.ventaID.toString()
          };
          $timeout.cancel(timer);
          socket.emit('notiCancel',dat);
          return;
        }else{
         // alert(newid.ventaID);
          $scope.datos.ventaID=newid.ventaID.toString();
        }
        if ($scope.trigger=='Cancelado') {
          $timeout.cancel(timer);
          $ionicHistory.goBack(-1);
          return;
        }else{
         // alert("sigue");
          $scope.time();
        }
      });
       $scope.cont++;
      
    }, 30000);
  }
  $scope.time();
  $scope.cancelar=function(){
    $state.go('app.genCob');
    $timeout.cancel(timer);
    dat={
      idnoti:$scope.datos.ventaID
    };
    socket.emit('notiCancel',dat);
  };

  socket.removeListener('serverConfirm');
  socket.on('serverConfirm', function(){

    
    alert("pago confirmado por el servidor");
    $ionicHistory.goBack(-1);

});
 
})