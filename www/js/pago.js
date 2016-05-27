

//###################Contador de Pagos###################################
var pagoId = 'pago-';
var pagoCont = 0;
db.pagos.findOne({$query:{},$orderby:{id:-1}},function(err,data){
    if (data!=null) {
        console.log(data.id);
        pagoCont = data.id+1;
    }
    else{
        pagoCont =1;
    };
    console.log(pagoCont);
});
//###################FIN Contador de pagos###################################