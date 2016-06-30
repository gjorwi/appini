angular.module('starter.service', [])

.service('pagoService', function(){
 this.pago = {};

 	this.givePago = function(){

 		return this.pago;
 	}
})
.service('EnlaceService', function(){
 this.datenl = {};

 	this.giveDat = function(){

 		return this.datenl;
 	}
})
.service('Cajas', function(){
 this.enlazado = {idmaster:0};

 	this.giveEnlazado = function(){

 		return this.enlazado;
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
.service('grafic', function(){
 this.datgraf = [];
 this.fecgraf = [];
 this.serie = [];

 	this.giveitem = function(){

 		return this.datgraf.item;
 	}
 	this.giveservicio = function(){

 		return this.datgraf.servicio;
 	}
 	this.giveotros = function(){

 		return this.datgraf.otros;
 	}
})
.service('pag', function(){
 this.ivap = 0;
 this.tpagt = 0;

 	this.giveivap = function(){

 		return this.ivap;
 	}
 	this.givetpagt = function(){

 		return this.tpagt;
 	}

})
.service('histcob', function(){
 this.cob = [];
 this.cobext = [];
 this.totcob='';
 this.counthist=0;

 	this.giveHistcob = function(){

 		return this.cob;
 	}
 	this.givecounthist = function(){

 		return this.counthist;
 	}
})
.service('detalle', function(){
 this.detprod = {};

 	this.giveDet = function(){

 		return this.detprod;
 	}
})
.service('aviso', function(){
 this.av = 0;

 	this.giveav = function(){

 		return this.av;
 	}
})
.factory('socket',function(socketFactory){
    //Create socket and connect to http://chat.socket.io 
    var myIoSocket = io.connect('https://54.149.254.78:1443',{secure:true});

    mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    return mySocket;
});