<template>
    <div class="container">
        <vue-resizable :width="500" :drag-selector="toolbar">
            <form v-on:submit.prevent="guardarCategoria" v-on:reset="limpiar">
                <div class="card border-dark mb-3">
                    <div class="card-header bg-dark text-white toolbar">
                        <div class="row">
                            <div class="col-1">
                                <img src="../../../public/img/categorias.png" alt="Clientes">
                            </div>
                            <div class="col-10">
                                <h5>REGISTRO DE CATEGORIA</h5>
                            </div>
                            <div class="col-1">
                                <button type="button" @click="cerrar" class="btn-close bg-white" aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body text-dark">
                        <div class="row p-2">
                            <div class="col-sm">CODIGO:</div>
                            <div class="col-sm">
                                <input v-model="categoria.codigo" required type="text" class="form-control form-control-sm" >
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm">DESCRIPCION: </div>
                            <div class="col-sm">
                                <input v-model="categoria.descripcion" required pattern="[A-ZÑña-z0-9, ]{5,65}" type="text" class="form-control form-control-sm">
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
                            <h5>CATEGORIAS REGISTRADOS</h5>
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
                                    <input v-model="buscar" v-on:keyup="buscandoCategoria" type="text" class="form-control form-contro-sm" placeholder="Buscar categorias">
                                </td>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>DESCRIPCION</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="pro in categorias" :key="pro.id" v-on:click="mostrarCategoria(pro)">
                                <td>{{ pro.codigo }}</td>
                                <td>{{ pro.descripcion }}</td>
                                <td>
                                    <a @click.stop="eliminarCategoria(pro)" class="btn btn-danger">DEL</a>
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
                categoria:{
                    id          : 0,
                    idCategoria : "",
                    codigo      : '',
                    descripcion : ''
                },
                categorias:[]
            }
        },
        methods:{
            cerrar(){
                this.form['categoria'].mostrar=false;
            },
            buscandoCategoria(){
                this.categorias = this.categorias.filter((element,index,categorias) => element.descripcion.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
                if( this.buscar.length<=0){
                    this.obtenerDatos();
                }
            },
            buscandoCodigoCategoria(store){
                let buscarCodigo = new Promise( (resolver,rechazar)=>{
                    let index = store.index("codigo"),
                        data = index.get(this.categoria.codigo);
                    data.onsuccess=evt=>{
                        resolver(data);
                    };
                    data.onerror=evt=>{
                        rechazar(data);
                    };
                });
                return buscarCodigo;
            },
            async guardarCategoria(){
                /**
                 * webSQL -> DB Relacional en el navegador
                 * localStorage -> BD NOSQL clave/valor
                 * indexedDB -> BD NOSQL clave/valor
                 */
                let store = this.abrirStore("tblcategorias",'readwrite'),
                    duplicado = false;
                if( this.accion=='nuevo' ){
                    this.categoria.idCategoria = generarIdUnicoDesdeFecha();
                    
                    let data = await this.buscandoCodigoCategoria(store);
                    duplicado = data.result!=undefined;
                }
                if( duplicado==false && this.categoria.codigo.trim()!=""){
                     if( this.accion=='nuevo' ){
                        const resp = await axios.post('categorias',this.categoria);
                        this.categoria.id = resp.data;
                    } else {
                        const resp = await axios.put(`categorias/${this.categoria.id}`,this.categoria);
                    }
                    let tabla = this.abrirStore("tblcategorias",'readwrite'),
                        query = tabla.put(this.categoria);
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
                    this.mostrarMsg('Codigo de categoria duplicado, o vacio',true);
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
                let store = this.abrirStore('tblcategorias','readonly'),
                    data = store.getAll();
                data.onsuccess=async resp=>{
                    if( data.result.length==0 ){
                        const categorias = await axios.get('categorias');
                        this.categorias = categorias.data;
                        let tabla = this.abrirStore('tblcategorias','readwrite');
                        this.categorias.forEach(element => {
                            let categoria = {
                                id          : element.id,
                                idCategoria : element.idCategoria,
                                codigo      : element.codigo,
                                descripcion : element.descripcion
                            };
                            tabla.put(categoria);
                        });
                    } else {
                        this.categorias = data.result;
                    }
                };
            },
            mostrarCategoria(pro){
                this.categoria = pro;
                this.accion='modificar';
            },
            limpiar(){
                this.accion='nuevo';
                this.categoria.idCategoria='';
                this.categoria.codigo='';
                this.categoria.descripcion='';
                this.obtenerDatos();
            },
            async eliminarCategoria(pro){
                if( confirm(`Esta seguro que desea eliminar el categoria:  ${pro.descripcion}`) ){

                    this.categoria = pro;
                    this.accion = "eliminar";
                    const data = await axios.delete(`categorias/${pro.id}`);

                    let store = this.abrirStore("tblcategorias",'readwrite'),
                        req = store.delete(pro.idCategoria);
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
