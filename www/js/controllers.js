angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope,$rootScope,Cajas,$state, $ionicModal, $timeout,userData,$ionicPopover) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  //alert("menu");
  // Form data for the login modal
  $scope.caja=Cajas.giveEnlazado();
  $scope.caja=$scope.caja.idmaster;
  $rootScope.$on('someEvent', function(event, data) { 
    //alert("llego");
    $scope.caja=data.idmaster;
    $scope.menuser = data.userId;
  });
  //alert($scope.caja);
  
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

  $ionicPopover.fromTemplateUrl('popover.html', {
      scope: $scope
   }).then(function(popover) {
      $scope.popover = popover;
   });

   $scope.openPopover = function($event) {
      $scope.popover.show($event);
   };

   $scope.closePopover = function() {
      $scope.popover.hide();
   };

   //Cleanup the popover when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.popover.remove();
   });

   // Execute action on hide popover
   $scope.$on('popover.hidden', function() {
      // Execute action
   });

   // Execute action on remove popover
   $scope.$on('popover.removed', function() {
      // Execute action
   });



})

.controller('PlaylistCtrl', function($scope, $stateParams,datos) {
  $scope.detalle=datos.cancion();
})

.controller('Login', function($scope,aviso,$rootScope,$state,$ionicModal,socket,$ionicHistory, $ionicPopup,userData,Cajas) {
  aviso.av=0;
  
  
  //alert($scope.caja);
  $scope.Swiper=null;
  $scope.index = 0;
  $scope.regEnl = 'Registrar';
  $scope.options = {
           onSlideChangeEnd: function(swiper){
            if(swiper.activeIndex == 0)
            $scope.regEnl = 'Registrar';
            if(swiper.activeIndex == 1){
              $scope.regEnl = 'Enlazar';
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
  $scope.choice={};
  $scope.funcreg = function(dato) {
    if (dato=="Registrar") {
      //alert(dato);
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
      else if($scope.choice.password.length<6){
          $scope.alertMessage = 'La contraseña debe contener al menos 6 caracteres.';
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
    }else{
      //alert(dato);
      //alert('id:'+$scope.choice.email);
      if(!$scope.choice.userId || !$scope.choice.tiprif||!$scope.choice.rif||!$scope.choice.password ||!$scope.choice.confirmPass ){
        $scope.alertMessage = 'Faltan campos por llenar';
        $scope.showAlert();
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
        socket.emit('enlEmp',$scope.choice);
        
      }
      socket.removeListener('cantEnl');
      socket.on('cantEnl',function(){
        $scope.alertMessage = 'La empresa a la que intenta enlazar no se encuentra registrada!';
        $scope.showAlert();
      });
      socket.removeListener('cantEnl2');
      socket.on('cantEnl2',function(){
        $scope.alertMessage = 'El usuario ingresado no se encuentra disponible para su uso.';
        $scope.showAlert();
      });
      socket.removeListener('enlOk');
      socket.on('enlOk',function(){
        $scope.alertMessage = 'Solicitud de enlace enviada con exito!';
        $scope.showAlert();
        $ionicHistory.goBack(-1);
      });
    
    };
  };

  
  $scope.valinput='';
  //alert("login");
  $ionicModal.fromTemplateUrl('templates/tiporif.html', {
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.alertMessage ="Error";
  $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: '<p class="font-inp-login">Alerta</p>',
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
    Cajas.enlazado.idmaster=0;
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
        //alert(userData.datos);
        $scope.caja={idmaster:0};
        if (userData.datos.idmaster) {
          Cajas.enlazado.idmaster=userData.datos.idmaster;
          $scope.caja=Cajas.giveEnlazado();
          $scope.caja={idmaster:$scope.caja.idmaster};
          //alert($scope.caja);
        }
        $scope.caja.userId=userData.datos.userId;
        //alert(JSON.stringify($scope.caja.userId));
        $rootScope.$broadcast('someEvent', $scope.caja);
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
    
  }

})

.controller('Princtrl', function($scope,aviso,pag,$timeout,$ionicHistory,$rootScope,grafic,Cajas,$stateParams,$state,$filter,socket,userData,$ionicPopup,histcob,invent,ventas,pagoService) {
  $scope.aviso=0;
  $scope.venLog='false';
  $scope.opcion=0;
  if ($stateParams.not) {
    //alert("aca");
    aviso.av=0;
  }
  $scope.iva=0.12;
  $scope.ivaPago=pag.giveivap();
  $scope.totalPagototal=pag.givetpagt();
  //alert($scope.ivaPago+' - '+$scope.totalPagototal);
  var fechahoy=new Date();
  $scope.formatfech=function(fec){
    var year1 = $filter('date')(fec, 'yyyy');
    var day1 = $filter('date')(fec, 'dd');
    var month1 = $filter('date')(fec, 'MM');
    var datemod1=day1+'/'+month1+'/'+year1;
    return datemod1;
  };

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
  $scope.userprin=userData.datos.userId;
  $scope.user=userData.datos.userId;
  $scope.caja=Cajas.giveEnlazado();
  var datsqlprod={userId:userData.datos.userId};
  var idmaster=Cajas.giveEnlazado();
  var id=idmaster.idmaster;
  datsqlprod.idmaster=id;
  socket.emit('sqlserv',datsqlprod);
  socket.emit('sqlprod',datsqlprod);
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
  socket.removeListener('repsqlserv');
  socket.on('repsqlserv',function(serv){
    //alert(JSON.stringify(serv));
    $scope.dataServ=serv;
    if ($scope.dataServ[0]=='f') {
      $scope.dataServ=[];
    }
    $scope.counserv=$scope.dataServ.length;
  });
  $rootScope.$$listeners['rootScope:emit'] = [];
  $rootScope.$on('rootScope:emit', function (event, data) {
    console.log($scope.Swiper); // 'Emit!'
    $scope.aviso='go';
    aviso.av=$scope.aviso;
    //alert($scope.aviso);
  });
  $scope.ingresos2=0;
  $scope.ingresosItems2=0;
  $scope.ingresosServicios2=0;
  $scope.ingresosOtros2=0;
  $scope.Swiper=null;
  $scope.index = 0;
  $scope.page = 'Cobros';
  $scope.options = {
          onSlideChangeEnd: function(swiper){
            if(swiper.activeIndex == 0){
              $scope.page ='Cobros';
              var datsqlprod={userId:userData.datos.userId};
              var idmaster=Cajas.giveEnlazado();
              var id=idmaster.idmaster;
              datsqlprod.idmaster=id;
              socket.emit('sqlprod',datsqlprod);
              socket.emit('sqlserv',datsqlprod);
            }
            if(swiper.activeIndex == 1){
              $scope.page ='Ventas';
              var datsqlprod3={userId:userData.datos.userId};
              var idmaster=Cajas.giveEnlazado();
              var id3=idmaster.idmaster;
              datsqlprod3.idmaster=id3;
              //alert(datsqlprod.fechaact);
              socket.emit('sqlventas',datsqlprod3);
              
            }
            if(swiper.activeIndex == 2){
              var datsqlprod2={userId:userData.datos.userId};
              var idmaster=Cajas.giveEnlazado();
              var id2=idmaster.idmaster;
              datsqlprod2.idmaster=id2;
              datsqlprod2.fechaact=$scope.formatfech(fechahoy);
              //alert(datsqlprod2.fechaact);
              socket.emit('sqlcajas',datsqlprod2);
              socket.emit('statscaja',datsqlprod2);
              $scope.page ='Estadisticas';

            }   
            $scope.$apply();
          },
          onInit:function(swiper){
              $scope.declareSwiper(swiper);
              $scope.$digest();
              $scope.$apply();
              $scope.aviso=aviso.giveav();
              if ($scope.aviso=='go') {
                //alert("hola");
                $scope.slideTo(1);
              }
              
              console.log($scope.Swiper);
          },
          pagination: false

      }
    $scope.declareSwiper = function(swiper){
      $scope.Swiper = swiper;
    }
  $scope.slideTo = function(slide){
    $scope.Swiper.slideTo(slide, 200, true);
  }

  $scope.refreshCaja = function(caja){
    if (caja=="master") {
      var datsql={userId:userData.datos.userId};
      datsql.idmaster=userData.datos.userId;
      datsql.fechaact=$scope.formatfech(fechahoy);
      //alert(datsqlprod2.fechaact);
      $scope.user=userData.datos.userId;
      socket.emit('statscaja',datsql);
    }else if(caja!="master"){
      var datsql={userId:caja.userId};
      datsql.idmaster=caja.idmaster;
      $scope.user=caja.userId;
      datsql.fechaact=$scope.formatfech(fechahoy);
      //alert(datsqlprod2.fechaact);
      socket.emit('statscaja',datsql);
    }
    
  }
  $scope.dataVentas=[];
  $scope.dataStats=[];
  socket.removeListener('repstatscaja');
  socket.on('repstatscaja',function(stats){
    $scope.ingresos2=0;
    $scope.ingresosItems2=0;
    $scope.ingresosServicios2=0;
    $scope.ingresosOtros2=0;
    //alert(JSON.stringify(stats));
    $scope.datastats=stats;
    if ($scope.datastats[0]=='f') {
      $scope.datastats=[];
      $scope.ingresos2=0;
      $scope.ingresosItems2=0;
      $scope.ingresosServicios2=0;
      $scope.ingresosOtros2=0;
      //alert("hola"+$scope.ingresos);
    }
    else{
      //alert('else');
      for(i in $scope.datastats){
        //alert('for 1');
        //alert($scope.dataIngresos[i].histpag);
        var histpag=JSON.parse($scope.datastats[i].histpag);
        //alert(histpag);
        //console.log(histpag.length);
        for(j in histpag){
          //console.log("for 2: "+histpag[j].tipo);
          if (histpag[j].tipo=='item') {

            $scope.ingresosItems2++;

          }
          else{
            $scope.ingresosOtros2++;
          }
        }
        $scope.ingresos2+=parseFloat($scope.datastats[i].monto);
      }

    }
    grafic.datgraf.item=$scope.ingresosItems2;
    grafic.datgraf.servicio=$scope.ingresosServicios2;
    grafic.datgraf.otros=$scope.ingresosOtros2;
    
    //console.log($scope.ingresosItems);
    //console.log($scope.ingresosOtros);
    //alert(grafic.datgraf.item);
    $scope.$broadcast('update');
    
  });
  socket.removeListener('repsqlcajas');
  socket.on('repsqlcajas',function(cajas){
    //alert(enl);
    //alert(JSON.stringify(cajas) );
    $scope.datacajas=cajas;
    if ($scope.datacajas[0]=='f') {
      $scope.datacajas=[];
    }
    $scope.countcajas=$scope.datacajas.length;
  });
  socket.removeListener('repsqlventas');
  socket.on('repsqlventas',function(ventas){
    //alert(JSON.parse(ventas));

    $scope.dataVentas=ventas;
    //alert($scope.dataVentas[0]);
    if ($scope.dataVentas[0]=='f') {
      $scope.dataVentas=[];
    }
    $scope.venLog='true';
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
});
$scope.date = new Date();
$scope.year = $filter('date')(new Date(), 'yyyy');
$scope.day = $filter('date')(new Date(), 'dd');
$scope.month = $filter('date')(new Date(), 'MM');
$scope.mes=$filter('date')(new Date(), 'MMM');
$scope.datescope=$scope.day+'/'+$scope.month+'/'+$scope.year;
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
    };

  }
  $scope.class1="gris";
  $scope.data = {};
  $scope.showPopup = function() {
  

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<div class="row"><label style="margin-top:10px;font-weight:bold;">Info:</label><input type="text" style="padding-left:5px;border-bottom:1px solid #6282FF;background-color:rgba(0,0,0,0);" ng-model="data.coment"></div>',
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
    pag.ivap=0;
    pag.tpagt=0;
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
    $scope.ivaPago=$scope.totalPago*$scope.iva;
    pag.ivap=$scope.ivaPago;
    //alert($scope.ivaPago);
    $scope.totalPagototal=parseFloat($scope.totalPago)-parseFloat($scope.ivaPago);
    pag.tpagt=$scope.totalPagototal;
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
      $scope.ivaPago=parseFloat(histcob.totcob)*$scope.iva;
    pag.ivap=$scope.ivaPago;
    //alert($scope.ivaPago);
    $scope.totalPagototal=parseFloat(histcob.totcob)-parseFloat($scope.ivaPago);
    pag.tpagt=$scope.totalPagototal;
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
  if (productocob.tipo=='producto') {
    var tipo='item';
  }else{
    var tipo='servicio';
  }
  
  $scope.histPago.push({idhist:cont,coment:productocob.nombre,precio:productocob.precio,tipo:tipo});
  histcob.cob=$scope.histPago;
  $scope.ivaPago=$scope.totalPago*$scope.iva;
    pag.ivap=$scope.ivaPago;
    //alert($scope.ivaPago);
    $scope.totalPagototal=parseFloat($scope.totalPago)-parseFloat($scope.ivaPago);
    pag.tpagt=$scope.totalPagototal;
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
 //alert($scope.ivaPago);
$scope.comapunto = function(){
  $scope.actualPago = $scope.actualPago.replace(/,/g,'.');
  alert($scope.actualPago);
}
$scope.detventa = function(venta){
  $state.go('app.detventa',{venta:venta});
}
$scope.anuladas = function(){
  $state.go('app.anuladas');
}
$scope.avisar = function(){
  $scope.aviso='go';
  aviso.av=$scope.aviso;
  $ionicHistory.goBack(-1);
  //$state.go('app.anuladas');
}
//alert($scope.ivaPago);
//alert($scope.totalPagototal);
$scope.qrGen = function(){
  $scope.histPagoGen=$scope.histPago.filter(function(a){
      return typeof a !== 'undefined';
  });
  //alert($scope.histPagoGen);
  var idmaster=Cajas.giveEnlazado();
  var id=idmaster.idmaster;
  
    //alert(JSON.stringify(idmaster) );
    //var id=Cajas.enlazados.idmaster;
    //alert($scope.totalPago);
  if ($scope.totalPago==0) {
    //alert("es cero");
    $scope.alertMessage ="Error";
    $scope.showAlert = function() {
       var alertPopup = $ionicPopup.alert({
         title: 'Alerta',
         template: $scope.alertMessage
       });

       alertPopup.then(function(res) {
          $scope.control=1;
          $scope.cambiar = function(){
            timer=$timeout(function() {
                if ($scope.control>8) {
                  return;
                }else{
                  if ($scope.control==2||$scope.control==4||$scope.control==6||$scope.control==8) {
                    document.getElementById("mont").setAttribute('style', 'border:1px solid rgba(0,0,0,0.2);padding:0px 5px;margin:0px 5px;');
                  }
                  else{
                    document.getElementById("mont").setAttribute('style', 'background-color:#FF6388 !important;border:1px solid rgba(0,0,0,0.2);padding:0px 5px;margin:0px 5px;');
                  }
                  
                  //alert(document.getElementById("mont").style.backgroundColor);    
                  $scope.cambiar();
                }
               $scope.control++;
            }, 200);
          }
          $scope.cambiar();
       });
    };
    $scope.alertMessage = 'Debe agragar un monto con el teclado numerico mediante el boton +, o un producto del apartado Items.';
    $scope.showAlert();
    
  }else{
    if (userData.datos.userId==null) {
      //alert("null");
    }
    else{
      $scope.totalPagoGen = {id:userData.datos.userId,idmaster:id, monto:$scope.totalPago,fecdia:$scope.day, fecha:$scope.datescope,fecmes:$scope.mes,fectime:$scope.date,histpag:angular.toJson($scope.histPagoGen)};
      socket.emit('genVenta', $scope.totalPagoGen);
    }
  }
  socket.on('ventaRegistrado', function(pagreg){
    pagoService.pago=pagreg;
    $scope.reset();
    $state.go('app.qrGen',{datpag:$scope.totalPagoGen});
  });
}

  $scope.calendar = function() {
  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<div class="row"><input type="date" ng-value="12" class="text-center" style="padding-left:5px;border-bottom:1px solid #6282FF;background-color:rgba(0,0,0,0);" ng-model="data.coment"></div>',
    title: 'Fecha a buscar',
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
///////////////////////////////////////GENERAR COBRO///////////////////////////////////////
})

.controller('Invent', function($timeout,aviso,Cajas,$scope,$stateParams,$state,$filter,$ionicModal,userData,socket,invent,detalle) {
  /*
  if (!userData.datos.userId) {
    $state.go('login');
  }
  */
  aviso.av=0;
  $scope.venLog='false';
  $scope.servLog='false';
  $scope.counserv=0;
  var datsqlprod={userId:userData.datos.userId};
  var idmaster=Cajas.giveEnlazado();
  var id=idmaster.idmaster;
  datsqlprod.idmaster=id;

  $scope.sql=function(datos){
    socket.emit('sqlprod',datos);
    socket.emit('sqlserv',datos);
  };
  $scope.sql(datsqlprod);
  
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
        var datsqlprod={userId:userData.datos.userId};
        var idmaster=Cajas.giveEnlazado();
        var id=idmaster.idmaster;
        datsqlprod.idmaster=id;
        socket.emit('sqlprod',datsqlprod);
        socket.emit('sqlserv',datsqlprod);
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
    $scope.venLog='true';
    $scope.counprod=$scope.dataVentas.length;
  });
  socket.removeListener('repsqlserv');
  socket.on('repsqlserv',function(serv){
    //alert(JSON.stringify(serv));
    $scope.dataServ=serv;
    if ($scope.dataServ[0]=='f') {
      $scope.dataServ=[];
    }
    $scope.servLog='true';
    $scope.counserv=$scope.dataServ.length;
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
  $scope.detalleserv = function(servicio) {
    //alert(producto);
    //$scope.nomprod=producto;
    //detalle.detprod=producto;
    //alert(detalle.detprod);
    $state.go('app.detserv',{ servicio: servicio});
  };
})

.controller('Anuladas', function($scope,$stateParams,$rootScope,userData,Cajas,aviso,$ionicPopup,$ionicHistory,socket,$state,$cordovaBarcodeScanner,pagoService,$timeout) {
  $scope.solanuLog='false';
  $scope.anuladasLog='false';
  $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Alerta',
       template: $scope.alertMessage
     });

     alertPopup.then(function(res) {
     });
  };
  var datsqlprod={userId:userData.datos.userId};
  var idmaster=Cajas.giveEnlazado();
  var id=idmaster.idmaster;
  datsqlprod.idmaster=id;
  socket.emit('sqlsolventanu',datsqlprod);
  socket.removeListener('repsqlsolventanu');
  socket.on('repsqlsolventanu',function(datanu){
    //alert(JSON.stringify(datanu));
     $scope.dataSolanu=datanu;
    if ($scope.dataSolanu[0]=='f') {
      $scope.dataSolanu=[];
    }
    $scope.solanuLog='true';
    $scope.counsolanu=$scope.dataSolanu.length;
  });
  $scope.detSolanu = function(anular){
    $state.go('app.detventanu',{ventanu:anular});
  };
  $scope.avisar = function() {
    $rootScope.$emit('rootScope:emit', 'Emit!');
    $ionicHistory.goBack(-1);
  };
  $scope.Swiper=null;
  $scope.index = 0;
  $scope.pageInv = 'Productos';
  $scope.options = {
    onSlideChangeEnd: function(swiper){
      if(swiper.activeIndex == 0){
        socket.emit('sqlsolventanu',datsqlprod);
      }
      if(swiper.activeIndex == 1)
        socket.emit('sqlanuladas',datsqlprod);
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
  socket.removeListener('repsqlanuladas');
  socket.on('repsqlanuladas',function(datanu){
    //alert(JSON.stringify(datanu));
     $scope.dataAnuladas=datanu;
    if ($scope.dataAnuladas[0]=='f') {
      $scope.dataAnuladas=[];
    }
    $scope.anuladasLog='true';
    $scope.counanuladas=$scope.dataAnuladas.length;
  });
 
})

.controller('Detalles', function($scope,$filter,$rootScope,aviso,$stateParams,$state,socket,$ionicHistory,$ionicPopup,detalle,userData) {
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
  $scope.nomserv=$stateParams.servicio;
  $scope.nomprod=$stateParams.producto;
  $scope.detsol=$stateParams.caja;
  //alert(JSON.stringify($scope.detsol));
  $scope.detventa=$stateParams.venta;
  if ($stateParams.ventanu) {
    $scope.detventanu=$stateParams.ventanu;
    $scope.histpag=JSON.parse($scope.detventanu.histpag);
    //alert(JSON.stringify($scope.detventanu));
  }
  if ($stateParams.venta) {
    $scope.detventa.fectime=$filter('date')($scope.detventa.fectime, 'short');

  }
  if ($stateParams.venta) {
    if ($scope.detventa.histpag) {
      $scope.histpag=JSON.parse($scope.detventa.histpag);
    }
  }
  $scope.recsolanu=function(detventanu){
    socket.emit('rechanularsol',detventanu);
  };
  $scope.anularsol=function(detventanu){
    socket.emit('anularsol',detventanu);
  };

  $scope.anular = function(solanu) {
    $scope.showConfirm = function() {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Alerta',
         template: 'Desea enviar una solicitud para anular la venta?',
         buttons: [
          { text: 'No' },
          {
            text: '<b>Si</b>',
            type: 'button-positive',
            onTap: function(e) {
              
                return true;
              
            }
          }
        ]
       });

       confirmPopup.then(function(res) {
         if(res) {
           //alert('hola');
           
           var data=angular.toJson(solanu);
           //alert(JSON.stringify(data));
           socket.emit('solanular',data);
         } else {
           console.log('You are not sure');
         }
       });
     };
     $scope.showConfirm();
    
  };
  socket.removeListener('reprechanularsol');
  socket.on('reprechanularsol',function(rech){
    $scope.alertMessage = 'La solicitud de anulacion ha sido rechazada.';
    $scope.showAlert();
    $ionicHistory.goBack(-1);
  });
  socket.removeListener('repanularsol');
  socket.on('repanularsol',function(datanu){
    if (datanu=='0') {
      $scope.alertMessage = 'Existe un error al tratar de anular la venta.';
      $scope.showAlert();
    }
    else if (datanu=='1') {
      $scope.alertMessage = 'El usuario que realizo la venta no se encuentra registrado.';
      $scope.showAlert();
    }
    else if (datanu=='2') {
      $scope.alertMessage = 'El saldo de su cuenta es menor al monto de la solicitud de anulacion.';
      $scope.showAlert();
    }
    else if (datanu=='3') {
      $scope.alertMessage = 'El usuario que realizo el pago no se encuentra registrado.';
      $scope.showAlert();
    }
    else{
      $scope.alertMessage = 'La venta fue anulada de forma exitosa!';
      $scope.showAlert();
      $ionicHistory.goBack(-1);
    }
  });
  socket.removeListener('respsolanular');
  socket.on('respsolanular',function(datanu){
    if (datanu=='0') {
      $scope.alertMessage = 'La solicitud de anulacion ya se encuentra registrada esperando la aprobacion.';
      $scope.showAlert();
    }
    else if (datanu=='1') {
      $scope.alertMessage = 'No se pudo registrar su solicitud de anulacion!';
      $scope.showAlert();
    }
    else{
      $scope.alertMessage = 'Su solicitud de anulacion ha sido registrada con exito!';
      $scope.showAlert();
    }
  });
  $scope.avisar = function() {
    $rootScope.$emit('rootScope:emit', 'Emit!');
    $ionicHistory.goBack(-1);
  };
  $scope.editar = function(prodEdit) {
    $state.go('app.regpro',{datprod:prodEdit});
  };
  $scope.editars = function(servEdit) {
    $state.go('app.regser',{datserv:servEdit});
  };
  $scope.elimserv = function(servElim) {
    socket.emit('elimserv',servElim);
  };
  $scope.elimprod = function(prodElim) {
    socket.emit('elimprod',prodElim);
  };
  socket.removeListener('repelimprod');
  socket.on('repelimprod',function(){
    $scope.alertMessage = 'El producto ha sido eliminado.';
    $scope.showAlert();
    $ionicHistory.goBack(-1);
  });
  socket.removeListener('repelimserv');
  socket.on('repelimserv',function(){
    $scope.alertMessage = 'El servicio ha sido eliminado.';
    $scope.showAlert();
    $ionicHistory.goBack(-1);
  });
  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
     title: 'Alerta',
     template: $scope.alertMessage
    });

    alertPopup.then(function(res) {
     
    });
  };
 
  $scope.enlazar = function(caja){
    socket.emit('enlazar',caja);
  }
  $scope.rechazar = function(caja){
    socket.emit('rechazar',caja);
  }
  socket.removeListener('resprechazar');
  socket.on('resprechazar',function(err){
    socket.emit('sqlsolenl',userData.datos.userId);
    $scope.alertMessage = 'La solicitud fue rechazada!';
    $ionicHistory.goBack(-1);
    $scope.showAlert();
  });
  socket.removeListener('respenlazarerr');
  socket.on('respenlazarerr',function(err){
    $scope.alertMessage = 'La caja ya se encuentra enlazada!';
    $scope.showAlert();
  });
  socket.removeListener('respenlazar');
  socket.on('respenlazar',function(dat){
    socket.emit('sqlsolenl',userData.datos.userId);
    $scope.alertMessage = 'Enlace exitoso!';
    $ionicHistory.goBack(-1);
    $scope.showAlert();
  });
})

.controller('Regserv', function($scope,Cajas,aviso,$stateParams,$state,$ionicModal,$ionicHistory,$ionicPopup,socket,userData) {
  if (!userData.datos.userId) {
    $state.go('login');
  }
  aviso.av=0;
  $scope.regserv={};
  $scope.regserv.contreg='false';
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

  if ($stateParams.datserv.nombre) {
    //alert("aca");
    $scope.datservext=$stateParams.datserv;
    $scope.regserv=$scope.datservext;
    $scope.regserv.contreg='true';
  }

  $scope.regServ = function(){
    //alert('existencia:'+$scope.regprod.precio);
    $scope.regserv.userId=userData.datos.userId;
    var idmaster=Cajas.giveEnlazado();
    $scope.regserv.idmaster=idmaster.idmaster;
    if(!$scope.regserv.nombre|| !$scope.regserv.precio||!$scope.regserv.clasificacion
      ||!$scope.regserv.detalle){
      $scope.alertMessage = 'Faltan campos por llenar.';
      $scope.showAlert();
    }
    else{
      socket.emit('registerserv',$scope.regserv);
    }
    socket.removeListener('cantRegiserv');
    socket.on('cantRegiserv',function(){
      $scope.alertMessage = 'No se pudo registrar el Servicio!';
      $scope.showAlert();
    });
    socket.removeListener('regOkserv');
    socket.on('regOkserv',function(res){
      if (res=='1') {
        $scope.alertMessage = 'Su servicio ha sido registrado Exitosamente!';
        $scope.showAlert();
        $ionicHistory.goBack(-1);
      }else{
        $scope.alertMessage = 'Su servicio ha sido actualizado Exitosamente!';
        $scope.showAlert();
        $ionicHistory.goBack(-1);
      }
      
    }); 
  }
  //alert($scope.regprod.existencia);

})

.controller('Regpro', function($scope,Cajas,aviso,$stateParams,$state,$ionicModal,$ionicHistory,$ionicPopup,socket,userData) {
  if (!userData.datos.userId) {
    $state.go('login');
  }
  aviso.av=0;
  $scope.regprod={};
  $scope.regprod.contreg='false';
  $scope.regprod.existencia='1';

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

  if ($stateParams.datprod.nombre) {
    //alert("aca");
    $scope.datprodext=$stateParams.datprod;
    $scope.regprod=$scope.datprodext;
    $scope.regprod.contreg='true';
    if ($scope.regprod.existencia=='Por Pedido') {
      $scope.regprod.existencia='1';
    }
    else if ($scope.regprod.existencia=='Existencia') {
      $scope.regprod.existencia='2';
    }
    else{
      $scope.regprod.existencia='3';
    }
  }

  $scope.regProd = function(){
    //alert('existencia:'+$scope.regprod.precio);
    $scope.regprod.userId=userData.datos.userId;
    var idmaster=Cajas.giveEnlazado();
    $scope.regprod.idmaster=idmaster.idmaster;
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
    socket.on('regOk',function(res){
      if (res=='1') {
        $scope.alertMessage = 'Su producto ha sido registrado Exitosamente!';
        $scope.showAlert();
        $ionicHistory.goBack(-1);
      }else{
        $scope.alertMessage = 'Su producto ha sido actualizado Exitosamente!';
        $scope.showAlert();
        $ionicHistory.goBack(-1);
      };
      
    }); 
  }
  //alert($scope.regprod.existencia);

})

.controller('Scanpag', function($scope,$stateParams,aviso,$ionicPopup,$ionicHistory,socket,$state,$cordovaBarcodeScanner,pagoService,$timeout) {
  $scope.showAlert = function() {
     var alertPopup = $ionicPopup.alert({
       title: 'Alerta',
       template: $scope.alertMessage
     });

     alertPopup.then(function(res) {
     });
  };
  $scope.datpagext=$stateParams.datpag;
  //alert($scope.datpagext);
  aviso.av=0;
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
       //alert("recibido "+newid.control);
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
    $scope.alertMessage = 'Cobro realizado de manera Exitosa!';
      $scope.showAlert();
    $ionicHistory.goBack(-1);
  });
 
})

.controller('Resumen', function($scope,grafic,aviso,Cajas,$stateParams,$ionicHistory,$filter,socket,$state,$cordovaBarcodeScanner,pagoService,$timeout,userData) {
  var fecha=new Date();
  if ($stateParams.not) {
    //alert("aca");
    aviso.av=0;
  }
  var dias_semana = new Array("Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado");
  var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre", "Diciembre");
  //alert(new Date(fecha.getTime()));
  $scope.ayer1=new Date(fecha.getTime() - 24*60*60*1000);
  $scope.ayer2=new Date(fecha.getTime() - 48*60*60*1000);
  $scope.manana1=new Date(fecha.getTime() + 24*60*60*1000);
  $scope.manana2=new Date(fecha.getTime() + 48*60*60*1000);
  /*
  alert(dias_semana[$scope.ayer2.getDay()]);
  alert(meses[$scope.ayer2.getMonth()].substring(0,3));
  alert($scope.ayer2.getDate());
  */
  $scope.ayer1mod=$scope.ayer1.getDate()+meses[$scope.ayer1.getMonth()].substring(0,3);
  $scope.ayer2mod=$scope.ayer2.getDate()+meses[$scope.ayer2.getMonth()].substring(0,3);

  $scope.manana1mod=$scope.manana1.getDate()+meses[$scope.manana1.getMonth()].substring(0,3);
  $scope.manana2mod=$scope.manana2.getDate()+meses[$scope.manana2.getMonth()].substring(0,3);

  $scope.dia0=new Date(fecha.getTime());
  $scope.dia1=new Date(fecha.getTime() - 24*60*60*1000);
  $scope.dia2=new Date(fecha.getTime() - 48*60*60*1000);
  $scope.dia3=new Date(fecha.getTime() - 72*60*60*1000);
  $scope.dia4=new Date(fecha.getTime() - 96*60*60*1000);
  $scope.dia5=new Date(fecha.getTime() - 120*60*60*1000);
  $scope.dia6=new Date(fecha.getTime() - 144*60*60*1000);
  $scope.formatfech=function(fec){
    var year1 = $filter('date')(fec, 'yyyy');
    var day1 = $filter('date')(fec, 'dd');
    var month1 = $filter('date')(fec, 'MM');
    var datemod1=day1+'/'+month1+'/'+year1;
    return datemod1;
  };
  var fecmoddia0=$scope.formatfech($scope.dia0);
  var fecmoddia1=$scope.formatfech($scope.dia1);
  var fecmoddia2=$scope.formatfech($scope.dia2);
  var fecmoddia3=$scope.formatfech($scope.dia3);
  var fecmoddia4=$scope.formatfech($scope.dia4);
  var fecmoddia5=$scope.formatfech($scope.dia5);
  var fecmoddia6=$scope.formatfech($scope.dia6);
  $scope.log='false';
  //alert($scope.formatfech($scope.dia0));
  var datos=userData.datos.userId;
  var idmaster=Cajas.giveEnlazado();
  var id=idmaster.idmaster;
  var fechas=[];
  fechas=[datos,id,fecmoddia0,fecmoddia1,fecmoddia2,fecmoddia3,fecmoddia4,fecmoddia5,fecmoddia6];
  //alert(fechas[0]+' '+fechas[1]+' '+fechas[2]+' '+fechas[3]+' '+fechas[4]+' '+fechas[5]+' '+fechas[6]);
  socket.emit('statventas',fechas);
  socket.removeListener('repstatventas');
  $scope.fecmonto0=0;
  $scope.fecmonto1=0;
  $scope.fecmonto2=0;
  $scope.fecmonto3=0;
  $scope.fecmonto4=0;
  $scope.fecmonto5=0;
  $scope.fecmonto6=0;
  socket.on('repstatventas',function(montos){
    //alert(montos);
    $scope.fec=montos;
    //alert($scope.dataVentas[0]);
    if ($scope.fec[0]=='f') {
      $scope.fec=[];
      $scope.log='true';
      $scope.data = [
        [$scope.fecmonto6,$scope.fecmonto5,$scope.fecmonto4,$scope.fecmonto3,$scope.fecmonto2, $scope.fecmonto1, $scope.fecmonto0]
      ];
    }
    else{
      for(n in $scope.fec){
        //alert($scope.fec[n].fecha);
        if ($scope.fec[n].fecha==fecmoddia0) {
          //alert('entro');
          $scope.fecmonto0+=parseFloat($scope.fec[n].monto);
        }else if($scope.fec[n].fecha==fecmoddia1){
          $scope.fecmonto1+=parseFloat($scope.fec[n].monto);
        }else if($scope.fec[n].fecha==fecmoddia2){
          $scope.fecmonto2+=parseFloat($scope.fec[n].monto);
        }else if($scope.fec[n].fecha==fecmoddia3){
          $scope.fecmonto3+=parseFloat($scope.fec[n].monto);
        }else if($scope.fec[n].fecha==fecmoddia4){
          $scope.fecmonto4+=parseFloat($scope.fec[n].monto);
        }else if($scope.fec[n].fecha==fecmoddia5){
          $scope.fecmonto5+=parseFloat($scope.fec[n].monto);
        }else{
          $scope.fecmonto6+=parseFloat($scope.fec[n].monto);
        }
      }
      $scope.log='true';
      //alert($scope.fecmonto0);
      $scope.data = [
        [$scope.fecmonto6,$scope.fecmonto5,$scope.fecmonto4,$scope.fecmonto3,$scope.fecmonto2, $scope.fecmonto1, $scope.fecmonto0]
      ];
    }
    //alert(JSON.parse(ventas));
  });
  $scope.dia0mod=dias_semana[$scope.dia0.getDay()];
  $scope.dia1mod=dias_semana[$scope.dia1.getDay()];
  $scope.dia2mod=dias_semana[$scope.dia2.getDay()];
  $scope.dia3mod=dias_semana[$scope.dia3.getDay()];
  $scope.dia4mod=dias_semana[$scope.dia4.getDay()];
  $scope.dia5mod=dias_semana[$scope.dia5.getDay()];
  $scope.dia6mod=dias_semana[$scope.dia6.getDay()];

  //alert(dias_semana[$scope.dia6.getDay()]+' - '+dias_semana[$scope.dia5.getDay()]+' - '+dias_semana[$scope.dia4.getDay()]+' - '+dias_semana[$scope.dia3.getDay()]+' - '+dias_semana[$scope.dia2.getDay()]+' - '+dias_semana[$scope.dia1.getDay()]+' - '+dias_semana[$scope.dia0.getDay()]);

  if (document.getElementById("cont")) {
    $scope.width=document.getElementById("cont").offsetWidth-40;
    //alert($scope.width);
    $scope.height=document.getElementById("cont").offsetHeight;
    if ($scope.width>320) {
      $scope.fontchart=($scope.width*10)/320;
    }
    else{
      $scope.fontchart=10;
    }
  }
  //alert($scope.width+' '+$scope.height);
 
  var datsqlprod={userId:userData.datos.userId};
  var idmaster=Cajas.giveEnlazado();
  var id=idmaster.idmaster;
  datsqlprod.idmaster=id;
  socket.emit('balance',datsqlprod);
  socket.removeListener('repbalance');
  socket.on('repbalance',function(bal){
    //alert(bal);
    $scope.balance=bal;
  });
  datsqlprod.fechaact=$scope.formatfech(fecha);
  //alert(JSON.stringify(datsqlprod) );
  socket.emit('ingresos',datsqlprod);
  socket.removeListener('repingresos');
  socket.on('repingresos',function(ing){
    $scope.ingresos=0;
    $scope.ingresosItems=0;
    $scope.ingresosServicios=0;
    $scope.ingresosOtros=0;
    //alert(JSON.stringify(ing));
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
  //alert($scope.fecmonto0);
  $scope.detresumprod = function () {
    alert("Productos");
    $state.go('app.detresumpro',{detresumprod:prodEdit});
  };
  $scope.detresumserv = function () {
    alert("Servicios");
    
  };
  $scope.detresumotro = function () {
    alert("Otros");
    
  };
  $scope.labels = [$scope.dia6mod, $scope.dia5mod, $scope.dia4mod, $scope.dia3mod, $scope.dia2mod, $scope.dia1mod, $scope.dia0mod];
  $scope.series = ['serie A'];

  $scope.options={scaleFontSize: $scope.fontchart};
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.colours = ['#FFD824', '#384750', '#48C8E1'];
  $scope.$on('update', function (event, data) {
    //alert("llegaron los datos");
    $scope.item=grafic.giveitem();
    //alert($scope.item);
    $scope.servicio=grafic.giveservicio();
    $scope.otros=grafic.giveotros();
    $scope.labels2 = ["Productos", "Servicios", "Otros"];
    $scope.data2 = [$scope.item, $scope.servicio, $scope.otros];
  });
})

.controller('Cajas', function($scope,$ionicPopup,aviso,EnlaceService,$stateParams,$ionicHistory,$filter,socket,$state,pagoService,$timeout,userData) {
  $scope.Swiper=null;
  aviso.av=0;
  $scope.sollog='false';
  $scope.enllog='false';
  $scope.dataEnlaces='';
  $scope.index = 0;
  $scope.pageInv = 'Cajas';
  socket.emit('sqlsolenl',userData.datos.userId);
  $scope.options = {
    onSlideChangeEnd: function(swiper){
      if(swiper.activeIndex == 0){
        $scope.pageInv ='Solicitudes';
        socket.emit('sqlsolenl',userData.datos.userId);
      }
      if(swiper.activeIndex == 1){
        $scope.pageInv ='Enlazados'; 
        socket.emit('sqlenlazados',userData.datos.userId);
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
  socket.removeListener('repsqlsolenl');
  socket.on('repsqlsolenl',function(solenl){
    //alert(enl);
    $scope.dataEnlaces=solenl;
    if ($scope.dataEnlaces[0]=='f') {
      $scope.dataEnlaces=[];
    }
    $scope.sollog='true';
    $scope.countenl=$scope.dataEnlaces.length;
  });
  socket.removeListener('repsqlenlazados');
  socket.on('repsqlenlazados',function(enlazados){
    //alert(enl);
    $scope.dataEnlazados=enlazados;
    if ($scope.dataEnlazados[0]=='f') {
      $scope.dataEnlazados=[];
    }
    $scope.enllog='true';
    $scope.countenlazados=$scope.dataEnlazados.length;
  });
  
  $scope.detSol = function(caja){
    $state.go('app.detSol',{caja:caja});
  }
  $scope.deletEnl= function(caja){

    $scope.showConfirm = function() {
       var confirmPopup = $ionicPopup.confirm({
         title: 'Alerta',
         template: 'Esta seguro de Desenlazar '+caja.userId+'?',
         buttons: [
          { text: 'No' },
          {
            text: '<b>Si</b>',
            type: 'button-positive',
            onTap: function(e) {
              
                return true;
              
            }
          }
        ]
       });

       confirmPopup.then(function(res) {
         if(res) {
           //alert('hola');
           socket.emit('desenlazar',caja);
         } else {
           console.log('You are not sure');
         }
       });
     };
     $scope.showConfirm();
  };
  socket.removeListener('repdesenlazar');
  socket.on('repdesenlazar',function(desenlazar){
    socket.emit('sqlenlazados',userData.datos.userId);
  });
})
.controller('ScanEnlace', function($scope,aviso,EnlaceService,$stateParams,$ionicHistory,socket,$state,$cordovaBarcodeScanner,pagoService,$timeout) {
  aviso.av=0;
  //$scope.datenl=EnlaceService.giveDat();
  //alert($scope.datos.ventaID);
  //$scope.datenl.enlID=$scope.datenl.enlID.toString();
  //alert($scope.datos.ventaID);
  $scope.datenl='123456789';
  /*
  socket.removeListener('serverConfirm');
  socket.on('serverConfirm', function(){
    alert("pago confirmado por el servidor");
    $ionicHistory.goBack(-1);
  });
 */
})
