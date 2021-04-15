<template>
    <div class="container">
        <vue-resizable :width="500" :drag-selector="toolbar">
            <form v-on:submit.prevent="guardarProveedor" v-on:reset="limpiar">
                <div class="card border-dark mb-3">
                    <div class="card-header bg-dark text-white toolbar">
                        <div class="row">
                             <div class="col-1">
                                <img src="../../../public/img/proveedores.png" alt="Proveedores">
                            </div>
                            <div class="col-10">
                                <h5>REGISTRO DE PROVEEDORES</h5>
                            </div>
                            <div class="col-1">
                                <button type="button" @click="cerrar" class="btn-close bg-white" aria-label="Close"></button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body text-dark">
                        <div class="row p-2">
                            <div class="col-sm">NRC:</div>
                            <div class="col-sm">
                                <input v-model="proveedor.nrc" required type="text" class="form-control form-control-sm" >
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm">NOMBRE: </div>
                            <div class="col-sm">
                                <input v-model="proveedor.nombre" required pattern="[A-ZÑña-z0-9, ]{3,65}" type="text" class="form-control form-control-sm">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm">DIRECCION: </div>
                            <div class="col-sm">
                                <input v-model="proveedor.direccion" required pattern="[A-ZÑña-z0-9, ]{5,65}" type="text" class="form-control form-control-sm">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm">TEL: </div>
                            <div class="col-sm">
                                <input v-model="proveedor.telefono" required pattern="[0-9]{4}-[0-9]{4}" type="text" class="form-control form-control-sm">
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
                            <img src="../../../public/img/buscar.png" alt="Proveedores">
                        </div>
                        <div class="col-10">
                            <h5>PROVEEDORES REGISTRADOS</h5>
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
                                    <input v-model="buscar" v-on:keyup="buscandoProveedor" type="text" class="form-control form-contro-sm" placeholder="Buscar proveedores">
                                </td>
                            </tr>
                            <tr>
                                <th>NRC</th>
                                <th>NOMBRE</th>
                                <th>DIRECCION</th>
                                <th>TEL</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="pro in proveedores" v-bind:key="pro.idProveedor" v-on:click="mostrarProveedor(pro)">
                                <td>{{ pro.nrc }}</td>
                                <td>{{ pro.nombre }}</td>
                                <td>{{ pro.direccion }}</td>
                                <td>{{ pro.telefono }}</td>
                                <td>
                                    <a @click.stop="eliminarProveedor(pro)" class="btn btn-danger">DEL</a>
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
                proveedor:{
                    id          : 0,
                    idProveedor : 0,
                    nrc         : '',
                    nombre      : '',
                    direccion   : '',
                    telefono    : '',
                },
                proveedores:[]
            }
        },
        methods:{
            buscandoProveedor(){
                this.proveedores = this.proveedores.filter((element,index,proveedores) => element.nombre.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.nrc.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
                if( this.buscar.length<=0){
                    this.obtenerDatos();
                }
            },
            cerrar(){
                this.form['proveedor'].mostrar=false;
            },
            buscandoNrcProveedor(store){
                let buscarNrc = new Promise( (resolver,rechazar)=>{
                    let index = store.index("nrc"),
                        data = index.get(this.proveedor.nrc);
                    data.onsuccess=evt=>{
                        resolver(data);
                    };
                    data.onerror=evt=>{
                        rechazar(data);
                    };
                });
                return buscarNrc;
            },
            async guardarProveedor(){
                /**
                 * webSQL -> DB Relacional en el navegador
                 * localStorage -> BD NOSQL clave/valor
                 * indexedDB -> BD NOSQL clave/valor
                 */
                let store = this.abrirStore("tblproveedores",'readwrite'),
                    duplicado = false;
                if( this.accion=='nuevo' ){
                    this.proveedor.idProveedor = generarIdUnicoDesdeFecha();
                    
                    let data = await this.buscandoNrcProveedor(store);
                    duplicado = data.result!=undefined;
                }
                if( duplicado==false){
                    if( this.accion=='nuevo' ){
                        const resp = await axios.post('proveedores',this.proveedor);
                        this.proveedor.id = resp.data;
                    } else {
                        const resp = await axios.put(`proveedores/${this.proveedor.id}`,this.proveedor);
                    }
                    let tabla = this.abrirStore("tblproveedores",'readwrite'),
                        query = tabla.put(this.proveedor);
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
                    this.mostrarMsg('Nrc de proveedor duplicado',true);
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
                let store = this.abrirStore('tblproveedores','readonly'),
                    data = store.getAll();
                data.onsuccess=async resp=>{
                    if( data.result.length===0 ){
                        const proveedores = await axios.get('proveedores');
                        this.proveedores = proveedores.data;

                        let tabla = this.abrirStore('tblproveedores','readwrite');
                        this.proveedores.forEach(element => {
                            let proveedor = {
                                id        : element.id,
                                idProveedor : element.idProveedor,
                                nrc    : element.nrc,
                                nombre    : element.nombre,
                                direccion : element.direccion,
                                telefono  : element.telefono,
                            };
                            tabla.put(proveedor);
                        });
                    } else {
                        this.proveedores = data.result;
                    }
                };
            },
            mostrarProveedor(pro){
                this.proveedor = pro;
                this.accion='modificar';
            },
            limpiar(){
                this.accion='nuevo';
                this.proveedor.idProveedor='';
                this.proveedor.nrc='';
                this.proveedor.nombre='';
                this.proveedor.direccion='';
                this.proveedor.telefono='';
                this.obtenerDatos();
            },
            async eliminarProveedor(pro){
                if( confirm(`Esta seguro que desea eliminar el proveedor:  ${pro.nombre}`) ){
                    const data = await axios.delete(`proveedores/${pro.id}`);
                    
                    let store = this.abrirStore("tblproveedores",'readwrite'),
                        req = store.delete(pro.idProveedor);
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
