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
  $scope.menuser = userData.datos.userId;
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
  $scope.menuser = userData.datos.userId;
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
    else if($scope.choice.password.length<=6){
        $scope.alertMessage = 'Las contraseñas debe contener al menos 6 caracteres.';
        $scope.showAlert();
        $scope.choice.password ='';
        $scope.choice.confirmPass='';
    }
    else{
      $scope.choice.registration=userData.datos.pushReg;
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

.controller('Princtrl', function($scope,$stateParams,$state,$filter,socket,userData,$ionicPopup,histcob,invent,ventas,pagoService) {
  if (!userData.datos.userId) {
    $state.go('login');
  }
  $scope.opcion=0;
  $scope.switch = function(val){
    $scope.opcion=val;
  }
  //alert('hola');
  $scope.genCob = function(){
     $state.go('app.genCob');
  }
  $scope.genProd = function(){
     $state.go('app.genProd');
  }
  $scope.ir = function(){
     $state.go('app.reginv');
  }
  socket.emit('sqlprod',userData.datos.userId);
  socket.removeListener('repsqlprod');
  socket.on('repsqlprod',function(prod){
    
    $scope.dataVentas=prod;
    invent.inventario=prod;
    if ($scope.dataVentas[0]=='f') {
      $scope.dataVentas=[];
    }
    $scope.counprod=$scope.dataVentas.length;
    //alert($scope.counprod);
  });
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
$scope.search = '';
$scope.counthist=histcob.givecounthist();
$scope.addtext='Pago Especial';
$scope.pago = 0.00;
$scope.multiplo = 10;
$scope.oldNumber = 0.00;
$scope.actualPago = '0.00';
$scope.totalPagomu=0.00;
$scope.totalPago = '0.00';
$scope.conthist=0;
if (histcob.totcob) {
  //alert('hay historial');
  $scope.totalPagomu = histcob.totcob;
  $scope.totalPago = histcob.totcob;

}

$scope.histPago=histcob.cob;
$scope.histPagoext=histcob.cob.filter(function(a){
      return typeof a !== 'undefined';
    });;
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
      $scope.actualPago = $scope.pago;

    }

    else{

      $scope.oldNumber = $scope.oldNumber*$scope.multiplo;

      var x = $scope.oldNumber + number;

      $scope.pago = x.toFixed(2);
      $scope.oldNumber = $scope.pago;

         $scope.actualPago = $scope.pago;
         //pagoService.pago = $scope.actualPago;
    }

  }
  $scope.class1="gris";
  $scope.data = {};
  $scope.showPopup = function() {
  

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<div class="row"><label style="margin-top:10px;font-weight:bold;">Info.:</label><input type="text" style="padding-left:5px;border-bottom:1px solid #6282FF;background-color:rgba(0,0,0,0);" ng-model="data.coment"></div>',
    title: 'Nota Adicional',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Añadir</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.coment) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            return $scope.data.coment;
          }
        }
      }
    ]
  });
  myPopup.then(function(res) {
    $scope.addtext=res
    if (res!=null || res!=undefined) {
      $scope.class1="azul";
    }
    else{
      $scope.data={};
      $scope.class1="gris";

    }
    console.log('Tapped!', res);
  });
 };
 $scope.check={
    val:'false',
    check:"input"
  };
  $scope.tipo="producto";
  $scope.cambiar=function(val){
    $scope.check.val=val;
    if (val==false) {
      $scope.pageInv='Productos';
      $scope.tipo="producto";
      $scope.search='';
      //alert("Productos");
    }
    else{
      $scope.pageInv='Servicios';
      $scope.tipo="servicio";
      $scope.search='';
      //alert("Servicios");
    };
  }
  $scope.reset = function(){
    $scope.addtext='Pago Especial';
    $scope.pago = 0.00;
    $scope.multiplo = 10;
    $scope.oldNumber = 0.00;
    $scope.actualPago = '0.00';
    $scope.totalPagomu=0.00;
    $scope.totalPago = '0.00';
    histcob.cob=[];
    histcob.totcob='';
    $scope.histPago=[];
    $scope.data = {};
    $scope.class1="gris";
    $scope.conthist=0;
  }
  $scope.contHist=function(){

    if ($scope.histPago.length>0) {
      $scope.conthist=$scope.histPago.length;
    }
    else{
      $scope.conthist=0;
    }
    //alert('contador'+$scope.conthist);
    return $scope.conthist;
    
  };
  $scope.sumtotal = function(){

    //alert($scope.totalPagomu);
    //alert($scope.actualPago);
    $scope.totalPagomu =parseFloat($scope.totalPagomu) + parseFloat($scope.actualPago);
    var y=$scope.totalPagomu;
    //alert($scope.totalPagomu);
    $scope.totalPagomu = y.toFixed(2);
    //alert($scope.totalPagomu);
    var paso=$scope.totalPagomu;
    $scope.totalPago=paso.toString();
    histcob.totcob=$scope.totalPago;
    if (!$scope.addtext) {
      $scope.addtext='Pago especial'
    }
    var cont=$scope.contHist();
    $scope.histPago.push({idhist:cont,coment:$scope.addtext,precio:$scope.actualPago,tipo:'otro'});
    histcob.cob=$scope.histPago;
    $scope.class1="gris";
    $scope.pago = 0.00;
    //this.multiplo = 0.01;
    $scope.oldNumber = 0.00;
    $scope.actualPago ='0.00';
    $scope.data = {};
  }
  $scope.restar = function(){
    $scope.pago = 0.00;
    //this.multiplo = 0.01;
    $scope.oldNumber = 0.00;
    $scope.actualPago ='0.00';
  }
$scope.deletCob = function(hitorial){
  //alert(idcob);
  for(i in $scope.histPago){
    if ($scope.histPago[i].idhist==hitorial.idhist) {
      delete $scope.histPago[i];
       $scope.histPagoext=$scope.histPago;
      histcob.counthist=$scope.histPago.length;
      $scope.histPagoext=$scope.histPagoext.filter(function(a){
        return typeof a !== 'undefined';
      });
      //$scope.histPago.splice(i,1);
      histcob.totcob=$scope.totalPago-hitorial.precio;
      $scope.totalPago=histcob.totcob;
      var temp=$scope.histPago.filter(function(a){
        return typeof a !== 'undefined';
      });
      histcob.counthist=temp.length;
      $scope.counthist=temp.length;
    }
  }
}
$scope.sumarprod = function(productocob){
  //alert($scope.totalPagomu);
  //alert($scope.actualPago);
  $scope.totalPagomu =parseFloat($scope.totalPagomu) + parseFloat(productocob.precio);
  var y=$scope.totalPagomu;
  //alert($scope.totalPagomu);
  $scope.totalPagomu = y.toFixed(2);
  //alert($scope.totalPagomu);
  var paso=$scope.totalPagomu;
  $scope.totalPago=paso.toString();
  histcob.totcob=$scope.totalPago;
  var cont=$scope.contHist();
  $scope.histPago.push({idhist:cont,coment:productocob.nombre,precio:productocob.precio,tipo:'item'});
  histcob.cob=$scope.histPago;
  $scope.pago = 0.00;
  //this.multiplo = 0.01;
  $scope.oldNumber = 0.00;
  $scope.data = {};
  $scope.actualPago ='0.00';
  }
  $scope.historial = function(){

    $scope.histPagoext=$scope.histPago;
    //alert($scope.histPagoext);
    histcob.counthist=$scope.histPago.length;
    $scope.histPagoext=$scope.histPagoext.filter(function(a){
      return typeof a !== 'undefined';
    });
    //alert($scope.histPagoext);
    $state.go('app.histcob');
  } 
 
$scope.comapunto = function(){
  $scope.actualPago = $scope.actualPago.replace(/,/g,'.');
  alert($scope.actualPago);
}

$scope.qrGen = function(){
  $scope.histPagoGen=$scope.histPago.filter(function(a){
      return typeof a !== 'undefined';
    });
  //alert($scope.histPagoGen);
  
  $scope.totalPagoGen = {id:userData.datos.userId, monto:$scope.totalPago, fecha:$scope.datescope,histpag:angular.toJson($scope.histPagoGen)};
  socket.emit('genVenta', $scope.totalPagoGen);
  socket.on('ventaRegistrado', function(pagreg){
    pagoService.pago=pagreg;
    $scope.reset();
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
      $scope.pageInv='Productos';
      $scope.tipo="producto";
      $scope.srcfun="srcpro()";

      //alert("Productos");
    }
    else{
      $scope.pageInv='Servicios';
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
  $scope.pageInv = 'Productos';
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
    //alert(producto);
    //$scope.nomprod=producto;
    //detalle.detprod=producto;
    //alert(detalle.detprod);
    $state.go('app.detinvent',{ producto: producto});
  };
  
})

.controller('Detalles', function($scope,$stateParams,$state,socket,$ionicHistory,$ionicPopup,detalle,userData) {
  if (!userData.datos.userId) {
    $state.go('login');
  }
  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
     title: 'Alerta',
     template: $scope.alertMessage
    });

    alertPopup.then(function(res) {
     console.log('El usuario ha confirmado el pago');
    });
  };
  //alert("detalles:"+$stateParams.producto);
  $scope.nomprod=$stateParams.producto;
  $scope.elimprod = function(prodElim) {
    socket.emit('elimprod',prodElim);
  };
  socket.removeListener('repelimprod');
  socket.on('repelimprod',function(){
    $scope.alertMessage = 'El producto ha sido eliminado';
    $scope.showAlert();
    $ionicHistory.goBack(-1);
  });

})
.controller('Regpro', function($scope,$stateParams,$state,$ionicModal,$ionicHistory,$ionicPopup,socket,userData) {
  if (!userData.datos.userId) {
    $state.go('login');
  }
  $scope.regprod={};
  $scope.unidades=[{
    val:'KM'},{val:'CAJA'},{val:'BULTO'},{val:'LTS'},{val:'K'},{val:'MTS'},{val:'PULG'},{val:'PACK'},{val:'CM'},
  {val:'CM2'},{val:'CM3'},{val:'MTS2'},{val:'MTS3'}
  ];
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
    //alert('existencia:'+$scope.regprod.precio);
    $scope.regprod.userId=userData.datos.userId;
    if(!$scope.regprod.nombre|| !$scope.regprod.precio||!$scope.regprod.existencia
      ||!$scope.regprod.detalle){
      $scope.alertMessage = 'Faltan campos por llenar.';
      $scope.showAlert();
    }
    else if($scope.regprod.existencia==2 && !$scope.regprod.cantidad1){
      $scope.alertMessage = 'Debe ingresar una cantidad.';
      $scope.showAlert();
    }else if($scope.regprod.existencia==3 && !$scope.regprod.cantidad){
      $scope.alertMessage = 'Debe ingresar una cantidad.';
      $scope.showAlert();
    }else if($scope.regprod.existencia==3 && !$scope.regprod.unidad){
      $scope.alertMessage = 'Debe Seleccionar una unidad.';
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
      $scope.alertMessage = 'Su producto ha sido registrado Exitosamente!';
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
      
    }, 60000);
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

.controller('Resumen', function($scope,$stateParams,$ionicHistory,socket,$state,$cordovaBarcodeScanner,pagoService,$timeout,userData) {
  $scope.ingresos=0;
  $scope.balance=0;
  $scope.ingresosItems=0;
  $scope.ingresosServicios=0;
  $scope.ingresosOtros=0;
  socket.emit('balance',userData.datos);
  socket.removeListener('repbalance');
  socket.on('repbalance',function(bal){
    //alert("hola");
    $scope.balance=bal;
  });
  socket.emit('ingresos',userData.datos);
  socket.removeListener('repingresos');
  socket.on('repingresos',function(ing){
    //alert("hola");
    $scope.dataIngresos=ing;
    if ($scope.dataIngresos[0]=='f') {
      $scope.dataIngresos=[];
      $scope.ingresos=0;
      $scope.ingresosItems=0;
      $scope.ingresosServicios=0;
      $scope.ingresosOtros=0;
      //alert("hola"+$scope.ingresos);
    }
    else{
      //alert('else');
      for(i in $scope.dataIngresos){
        //alert('for 1');
        //alert($scope.dataIngresos[i].histpag);
        var histpag=JSON.parse($scope.dataIngresos[i].histpag);
        //alert(histpag);
        //console.log(histpag.length);
        for(j in histpag){
          //console.log("for 2");
          if (histpag[j].tipo=='item') {
            $scope.ingresosItems+=parseFloat(histpag[j].precio);
          }
          else{
            $scope.ingresosOtros+=parseFloat(histpag[j].precio);
          }
        }
        $scope.ingresos+=parseFloat($scope.dataIngresos[i].monto);
      }
      //console.log($scope.ingresosItems);
      //console.log($scope.ingresosOtros);
    }
  });
})