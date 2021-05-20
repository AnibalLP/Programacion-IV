/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');
window.db = '';
window.generarIdUnicoDesdeFecha=()=>{
    let fecha = new Date();//03/02/2021
    return Math.floor(fecha.getTime()/1000).toString(16);
};
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
window.socket = io.connect('http://localhost:3001',{'forceNew':true});
/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i)
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

Vue.component('clientes-component', require('./components/clientes.vue').default);
Vue.component('proveedores-component', require('./components/proveedores.vue').default);
Vue.component('mensajes-component', require('./components/mensajes.vue').default);
Vue.component('categorias-component', require('./components/categorias.vue').default);
Vue.component('productos-component', require('./components/productos.vue').default);
Vue.component('chat-component', require('./components/chat.vue').default);
Vue.component('v-select-categorias', vSelect)
/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    data:{
        forms:{
            'categoria':{mostrar:false},
            'producto':{mostrar:false},
            'cliente':{mostrar:false},
            'proveedor':{mostrar:false},
            'chat':{mostrar:false},
        }
    },
    methods:{
        abrirForm(form){
            this.forms[form].mostrar=true;
            this.$refs[form].obtenerDatos();
        },
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
                tblproductos.createIndex('id','id',{unique:false});
                
                tblcategorias.createIndex('idCategoria','idCategoria',{unique:true});
                tblcategorias.createIndex('codigo','codigo',{unique:false});

                tblclientes.createIndex('idCliente','idCliente',{unique:true});
                tblclientes.createIndex('codigo','codigo',{unique:false});

                tblproveedores.createIndex('idProveedor','idProveedor',{unique:true});
                tblproveedores.createIndex('nrc','nrc',{unique:false});
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
    },
});