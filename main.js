var generarIdUnicoDesdeFecha=()=>{
    let fecha = new Date();//03/02/2021
    return Math.floor(fecha.getTime()/1000).toString(16);
}, db;
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
        buscandoCodigoProducto(store){
            let buscarCodigo = new Promise( (resolver,rechazar)=>{
                let index = store.index("codigo"),
                    data = index.get(this.producto.codigo);
                data.onsuccess=evt=>{
                    resolver(data);
                };
                data.onerror=evt=>{
                    rechazar(data);
                };
            });
            return buscarCodigo;
        },
        async guardarProducto(){
            /**
             * webSQL -> DB Relacional en el navegador
             * localStorage -> BD NOSQL clave/valor
             * indexedDB -> BD NOSQL clave/valor
             */
            let store = this.abrirStore("tblproductos",'readwrite'),
                duplicado = false;
            if( this.accion=='nuevo' ){
                this.producto.idProducto = generarIdUnicoDesdeFecha();
                
                let data = await this.buscandoCodigoProducto(store);
                duplicado = data.result!=undefined;
            }
            if( duplicado==false){
                let query = store.put(this.producto);
                query.onsuccess=event=>{
                    this.obtenerProductos();
                    this.limpiar();
                    
                    this.mostrarMsg('Registro se guardo con exito',false);
                };
                query.onerror=event=>{
                    this.mostrarMsg('Error al guardar el registro',true);
                    console.log( event );
                };
            } else{
                this.mostrarMsg('Codigo de producto duplicado',true);
            }
        },
        mostrarMsg(msg, error){
            this.status = true;
            this.msg = msg;
            this.error = error;
            this.quitarMsg(3);
        },
        quitarMsg(time){
            setTimeout(()=>{
                this.status=false;
                this.msg = '';
                this.error = false;
            }, time*1000);
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
            let store = this.abrirStore('tblproductos','readonly'),
                data = store.getAll();
            data.onsuccess=resp=>{
                this.productos = data.result;
            };
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
            this.obtenerProductos();
        },
        eliminarProducto(pro){
            if( confirm(`Esta seguro que desea eliminar el producto:  ${pro.descripcion}`) ){
                let store = this.abrirStore("tblproductos",'readwrite'),
                    req = store.delete(pro.idProducto);
                req.onsuccess=resp=>{
                    this.mostrarMsg('Registro eliminado con exito',true);
                    this.obtenerProductos();
                };
                req.onerror=resp=>{
                    this.mostrarMsg('Error al eliminar el registro',true);
                    console.log( resp );
                };
            }
        },
        abrirBd(){
            let indexDb = indexedDB.open('db_productos',1);
            indexDb.onupgradeneeded=event=>{
                let req=event.target.result,
                    tblproductos = req.createObjectStore('tblproductos',{keyPath:'idProducto'});
                tblproductos.createIndex('idProducto','idProducto',{unique:true});
                tblproductos.createIndex('codigo','codigo',{unique:false});
            };
            indexDb.onsuccess = evt=>{
                db=evt.target.result;
                this.obtenerProductos();
            };
            indexDb.onerror=e=>{
                console.log("Error al conectar a la BD", e);
            };
        },
        abrirStore(store,modo){
            let tx = db.transaction(store,modo);
            return tx.objectStore(store);
        }
    },
    created(){
        this.abrirBd();
    }
});