angular.module('starter.service', [])

.service('pagoService', function(){
 this.pago = {};

 	this.givePago = function(){

 		return this.pago;
 	}
})
.service('userData', function(){
 this.datos = {};

 	this.givePago = function(){

 		return this.datos;
 	}
})
.service('ventas', function(){
 this.ventas = {};

 	this.giveVentas = function(){

 		return this.ventas;
 	}
})
.service('invent', function(){
 this.inventario = '';

 	this.giveInven = function(){

 		return this.inventario;
 	}
})
.service('detalle', function(){
 this.detprod = {};

 	this.giveDet = function(){

 		return this.detprod;
 	}
})
.factory('socket',function(socketFactory){
    //Create socket and connect to http://chat.socket.io 
    var myIoSocket = io.connect('http://54.149.254.78:443');

    mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    return mySocket;
});