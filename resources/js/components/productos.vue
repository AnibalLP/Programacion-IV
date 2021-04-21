<template>
    <div class="container">
        <vue-resizable :width="500" :drag-selector="toolbar">
            <form v-on:submit.prevent="guardarProducto" v-on:reset="limpiar">
                <div class="card border-dark mb-3">
                    <div class="card-header bg-dark text-white toolbar">
                        <div class="row">
                            <div class="col-1">
                                <img src="../../../public/img/productos.png" alt="Clientes">
                            </div>
                            <div class="col-10">
                                <h5>REGISTRO DE PRODUCTO</h5>
                            </div>
                            <div class="col-1">
                                <button type="button" @click="cerrar" class="btn-close bg-white" aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body text-dark">
                        <div class="row p-2">
                            <div class="col-sm">CATEGORIA:</div>
                            <div class="col-sm">
                                <v-select-categorias v-model="producto.categoria" :options="categorias" placeholder="Por favor seleccione la categoria"/>
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm">CODIGO:</div>
                            <div class="col-sm">
                                <input v-model="producto.codigo" required type="text" class="form-control form-control-sm" >
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm">DESCRIPCION: </div>
                            <div class="col-sm">
                                <input v-model="producto.descripcion" required pattern="[A-ZÑña-z0-9, ]{5,65}" type="text" class="form-control form-control-sm">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm">PRECIO:</div>
                            <div class="col-sm">
                                <input v-model="producto.precio" required type="text" class="form-control form-control-sm" >
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent">
                        <div class="row p-2">
                            <div class="col-sm text-center">
                                <input type="submit" value="Guardar" class="btn btn-dark">
                                <input type="reset" value="Limpiar" class="btn btn-warning">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm text-center">
                                <mensajes-component :msg="msg" :error="error" v-show="status" ></mensajes-component>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </vue-resizable>
        <vue-resizable :width="600" :drag-selector="toolbar">
            <div class="card border-dark mb-3">
                <div class="card-header bg-dark text-white toolbar">
                    <div class="row">
                        <div class="col-1">
                            <img src="../../../public/img/buscar.png" alt="Clientes">
                        </div>
                        <div class="col-10">
                            <h5>PRODUCTOS REGISTRADOS</h5>
                        </div>
                        <div class="col-1">
                            <button type="button" @click="cerrar" class="btn-close bg-white" aria-label="Close"></button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <table class="table table-sm table-hover">
                        <thead>
                            <tr>
                                <td colspan="5">
                                    <input v-model="buscar" v-on:keyup="buscandoProducto" type="text" class="form-control form-contro-sm" placeholder="Buscar productos">
                                </td>
                            </tr>
                            <tr>
                                <th>CATEGORIA</th>
                                <th>CODIGO</th>
                                <th>DESCRIPCION</th>
                                <th>PRECIO</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="pro in productos" :key="pro.id" v-on:click="mostrarProducto(pro)">
                                <td>{{ pro.categoria.label }}</td>
                                <td>{{ pro.codigo }}</td>
                                <td>{{ pro.descripcion }}</td>
                                <td>{{ pro.precio }}</td>
                                <td>
                                    <a @click.stop="eliminarProducto(pro)" class="btn btn-danger">DEL</a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </vue-resizable>
    </div>
</template>
<script>
    //https://github.com/nikitasnv/vue-resizable
    Vue.component('vue-resizable',VueResizable.default);
    export default {
        props:['form'],
        data(){
            return {
                toolbar: '.toolbar',
                accion : 'nuevo',
                msg    : '',
                status : false,
                error  : false,
                buscar : "",
                producto:{
                    id          : 0,
                    idProducto  : "",
                     categoria  : {
                        id      : 0,
                        label   : '' 
                    },
                    codigo      : '',
                    descripcion : '',
                    precio      : ''
                },
                productos:[],
                categorias:[]
            }
        },
        methods:{
            cerrar(){
                this.form['producto'].mostrar=false;
            },
            buscandoProducto(){
                this.productos = this.productos.filter((element,index,productos) => element.descripcion.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
                if( this.buscar.length<=0){
                    this.obtenerDatos();
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
                if( duplicado==false && this.producto.codigo.trim()!=""){
                     if( this.accion=='nuevo' ){
                        const resp = await axios.post('productos',this.producto);
                        this.producto.id = resp.data;
                    } else {
                        const resp = await axios.put(`productos/${this.producto.id}`,this.producto);
                    }
                    let tabla = this.abrirStore("tblproductos",'readwrite'),
                        query = tabla.put(this.producto);
                    query.onsuccess=event=>{
                        this.obtenerDatos();
                        this.limpiar();
                        
                        this.mostrarMsg('Registro se guardo con exito',false);
                    };
                    query.onerror=event=>{
                        this.mostrarMsg('Error al guardar el registro',true);
                        console.log( event );
                    };
                } else{
                    this.mostrarMsg('Codigo de producto duplicado, o vacio',true);
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
            obtenerDatos(){
                let store = this.abrirStore('tblproductos','readonly'),
                    data = store.getAll();
                data.onsuccess=async resp=>{
                    if( data.result.length==0 ){
                        const productos = await axios.get('productos');
                        this.productos = productos.data;
                        let tabla = this.abrirStore('tblproductos','readwrite');
                        this.productos.forEach(element => {
                            let producto = {
                                id          : element.id,
                                categoria   : {
                                    id      : element.idCategoria,
                                    label   : element.categoria
                                },
                                idProducto  : element.idProducto,
                                codigo      : element.codigo,
                                descripcion : element.descripcion,
                                precio      : element.precio
                            };
                            tabla.put(producto);
                        });
                    } else {
                        this.productos = data.result;
                    }
                };
                let storeCategoria = this.abrirStore('tblcategorias','readonly'),
                dataCategoria = storeCategoria.getAll();
                this.categorias = [];
                dataCategoria.onsuccess=resp=>{
                    this.categorias = [];
                    dataCategoria.result.forEach(element => {
                        this.categorias.push({id:element.idCategoria, label:element.descripcion});
                    });
                };
            },
            mostrarProducto(pro){
                this.producto = pro;
                this.accion='modificar';
            },
            limpiar(){
                this.accion='nuevo';
                this.producto.idCategoria='';
                this.producto.idProducto='';
                this.producto.codigo='';
                this.producto.descripcion='';
                this.producto.precio='';
                this.obtenerDatos();
            },
            async eliminarProducto(pro){
                if( confirm(`Esta seguro que desea eliminar el producto:  ${pro.descripcion}`) ){

                    this.producto = pro;
                    this.accion = "eliminar";
                    const data = await axios.delete(`productos/${pro.id}`);

                    let store = this.abrirStore("tblproductos",'readwrite'),
                        req = store.delete(pro.idProducto);
                    req.onsuccess=resp=>{
                        this.mostrarMsg('Registro eliminado con exito',true);
                        this.obtenerDatos();
                    };
                    req.onerror=resp=>{
                        this.mostrarMsg('Error al eliminar el registro',true);
                        console.log( resp );
                    };
                }
            },
            abrirStore(store,modo){
                let tx = db.transaction(store,modo);
                return tx.objectStore(store);
            }
        },
        created(){
            //this.obtenerDatos();
        },
    }
</script>
