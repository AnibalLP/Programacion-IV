var miDBProductos = openDatabase('dbProductos','1.0','Aplicacion de Productos',5*1024*1024);
var generarIdUnicoDesdeFecha=()=>{
    let fecha = new Date();//03/02/2021
    return Math.floor(fecha.getTime()/1000).toString(16);
};
if(!miDBProductos){
    alert("Elnavegador no soporta Web SQL");
}
var appVue = new Vue({
    el:'#appProductos',
    data:{
        accion : 'nuevo',
        msg    : '',
        status : false,
        error : false,
        producto:{
            idProducto  : 0,
            codigo      : '',
            descripcion : '',
            precio      : '',
            img         : '/images/No-image-available.png',
            img2        : '/images/No-image-available.png'
        },
        productos:[]
    },
    methods:{
        guardarProducto(){
            /**
             * BD Web SQL
             */
            let sql = '';
            if( this.accion=='nuevo' ){
                this.producto.idProducto= generarIdUnicoDesdeFecha();
                sql = 'INSERT INTO productos(codigo,descripcion,precio,img,idProducto) VALUES(?,?,?,?,?)';
            } else if(this.accion=='modificar'){
                sql = 'UPDATE productos SET codigo=?,descripcion=?,precio=?,img=? WHERE idProducto=?';
            }
            miDBProductos.transaction(tran=>{
                tran.executeSql(sql,
                    [this.producto.codigo,this.producto.descripcion,this.producto.precio, this.producto.img,this.producto.idProducto]);
                this.obtenerProductos();
                this.limpiar();
                this.status = true;
                this.msg = 'Registro almacenado con exito.';
                this.error = false;

                setTimeout(()=>{
                    this.status=false;
                    this.msg = '';
                }, 3000)
            }, err=>{
                this.status = true;
                this.msg = err.message;
                this.error = true;
            });
        },
        obtenerImg(e){
            //IMG 1
            let rutaTemp = URL.createObjectURL(e.target.files[0]);
            this.producto.img = rutaTemp;
            //IMG2
            /*rutaTemp = URL.createObjectURL(e.target.files[1]);
            this.producto.img2 = rutaTemp;*/
        },
        obtenerProductos(){
            miDBProductos.transaction(tran=>{
                tran.executeSql('SELECT * FROM productos',[],(index,data)=>{
                    this.productos = data.rows;
                    id=data.rows.length;
                });
            }, err=>{
                console.log( err );
            });
        },
        mostrarProducto(pro){
            this.producto = pro;
            this.accion='modificar';
        },
        limpiar(){
            this.accion='nuevo';
            this.producto.idProducto='';
            this.producto.codigo='';
            this.producto.descripcion='';
            this.producto.precio='';
            this.producto.img='';
        },
        eliminarProducto(pro){
            if( confirm(`Esta seguro que desea eliminar el producto:  ${pro.descripcion}`) ){
                miDBProductos.transaction(tran=>{
                    tran.executeSql('DELETE FROM productos WHERE idProducto=?',
                        [pro.idProducto]);
                    this.obtenerProductos();
                }, err=>{
                    console.log( err );
                });
            }
        }
    },
    created(){
        miDBProductos.transaction(tran=>{
            tran.executeSql('CREATE TABLE IF NOT EXISTS productos(idProducto int PRIMARY KEY NOT NULL, codigo varchar(10), descripcion varchar(65), precio decimal(4,2),img varchar(100))');
        }, err=>{
            console.log( err );
        });
        this.obtenerProductos();
    }
});