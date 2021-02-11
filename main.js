var generarIdUnicoDesdeFecha=()=>{
    let fecha = new Date();//03/02/2021
    return Math.floor(fecha.getTime()/1000).toString(16);
}, db;
var appVue = new Vue({
    el:'#appSistema',
    data:{
        mostrarFrmProductos: true,
        mostrarFrmCategorias: false,
        mostrarFrmClientes: false,
        mostrarFrmProveedor: false
    },
    methods:{
        abrirBd(){
            let indexDb = indexedDB.open('db_sistema_facturacion',1);
            indexDb.onupgradeneeded=event=>{
                let req=event.target.result,
                    tblproductos = req.createObjectStore('tblproductos',{keyPath:'idProducto'}),
                    tblcategorias = req.createObjectStore('tblcategorias',{keyPath:'idCategoria'}),
                    tblclientes = req.createObjectStore('tblclientes',{keyPath:'idCliente'}),
                    tblproveedores = req.createObjectStore('tblproveedores',{keyPath:'idProveedor'});
                tblproductos.createIndex('idProducto','idProducto',{unique:true});
                tblproductos.createIndex('codigo','codigo',{unique:false});
                tblcategorias.createIndex('idCategoria','idCategoria',{unique:true});
                tblcategorias.createIndex('codigo','codigo',{unique:false});
            };
            indexDb.onsuccess = evt=>{
                db=evt.target.result;
            };
            indexDb.onerror=e=>{
                console.log("Error al conectar a la BD", e);
            };
        }
    },
    created(){
        this.abrirBd();
    }
});