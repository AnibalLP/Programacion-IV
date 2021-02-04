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
        error  : false,
        buscar : "",
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
        buscandoProducto(){
            this.productos = this.productos.filter((element,index,productos) => element.descripcion.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
            if( this.buscar.length<=0){
                this.obtenerProductos();
            }
        },
        guardarProducto(){
            /**
             * BD localstorage
             */
            if( this.accion=='nuevo' ){
                this.producto.idProducto = generarIdUnicoDesdeFecha();   
            }
            localStorage.setItem( this.producto.idProducto, JSON.stringify(this.producto) );
            this.obtenerProductos();
            this.limpiar();
            this.status = true;
            this.msg = 'Registro almacenado con exito.';
            this.error = false;

            setTimeout(()=>{
                this.status=false;
                this.msg = '';
            }, 3000);
            
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
            this.productos = [];
            for (let index = 0; index < localStorage.length; index++) {
                let key = localStorage.key(index);
                this.productos.push( JSON.parse(localStorage.getItem(key)) );
            }
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
                localStorage.removeItem(pro.idProducto)
                this.obtenerProductos();
            }
        }
    },
    created(){
        this.obtenerProductos();
    }
});