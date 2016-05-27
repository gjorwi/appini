angular.module('starter.servicio', [])

.service("datos", function(){
	this.id=null;
	this.musica=[{

		id:'1',
		nombre:"andas en mi cabeza",
		duracion:"3min"
	},{

		id:'2',
		nombre:"andas",
		duracion:"3min"
	},{

		id:'3',
		nombre:"andas en mi",
		duracion:"3min"
	}]
	this.cancion=function(){
		return this.musica[this.id-1];
	}
	this.musicas=function(){
		return this.musica;
	}
});