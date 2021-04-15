<template>
    <div class="container">
        <vue-resizable :width="500" :drag-selector="toolbar">
            <form v-on:submit.prevent="guardarCliente" v-on:reset="limpiar">
                <div class="card border-dark mb-3">
                    <div class="card-header bg-dark text-white toolbar">
                        <div class="row">
                            <div class="col-1">
                                <img src="../../../public/img/cliente.png" alt="Clientes">
                            </div>
                            <div class="col-10">
                                <h5>REGISTRO DE CLIENTES</h5>
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
                                <input v-model="cliente.codigo" required type="text" class="form-control form-control-sm" >
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm">NOMBRE: </div>
                            <div class="col-sm">
                                <input v-model="cliente.nombre" required pattern="[A-ZÑña-z0-9, ]{5,65}" type="text" class="form-control form-control-sm">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm">DIRECCION: </div>
                            <div class="col-sm">
                                <input v-model="cliente.direccion" required pattern="[A-ZÑña-z0-9, ]{5,65}" type="text" class="form-control form-control-sm">
                            </div>
                        </div>
                        <div class="row p-2">
                            <div class="col-sm">TEL: </div>
                            <div class="col-sm">
                                <input v-model="cliente.telefono" required pattern="[0-9]{4}-[0-9]{4}" type="text" class="form-control form-control-sm">
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
                            <h5>CLIENTES REGISTRADOS</h5>
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
                                    <input v-model="buscar" v-on:keyup="buscandoCliente" type="text" class="form-control form-contro-sm" placeholder="Buscar clientes">
                                </td>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>DIRECCION</th>
                                <th>TEL</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="pro in clientes" v-bind:key="pro.idCliente" v-on:click="mostrarCliente(pro)">
                                <td>{{ pro.codigo }}</td>
                                <td>{{ pro.nombre }}</td>
                                <td>{{ pro.direccion }}</td>
                                <td>{{ pro.telefono }}</td>
                                <td>
                                    <a @click.stop="eliminarCliente(pro)" class="btn btn-danger">DEL</a>
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
                cliente:{
                    id        : 0,
                    idCliente : 0,
                    codigo    : '',
                    nombre    : '',
                    direccion : '',
                    telefono  : '',
                },
                clientes:[]
            }
        },
        methods:{
            buscandoCliente(){
                this.clientes = this.clientes.filter((element,index,clientes) => element.nombre.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 || element.codigo.toUpperCase().indexOf(this.buscar.toUpperCase())>=0 );
                if( this.buscar.length<=0){
                    this.obtenerDatos();
                }
            },
            cerrar(){
                this.form['cliente'].mostrar=false;
            },
            buscandoCodigoCliente(store){
                let buscarCodigo = new Promise( (resolver,rechazar)=>{
                    let index = store.index("codigo"),
                        data = index.get(this.cliente.codigo);
                    data.onsuccess=evt=>{
                        resolver(data);
                    };
                    data.onerror=evt=>{
                        rechazar(data);
                    };
                });
                return buscarCodigo;
            },
            async guardarCliente(){
                /**
                 * webSQL -> DB Relacional en el navegador
                 * localStorage -> BD NOSQL clave/valor
                 * indexedDB -> BD NOSQL clave/valor
                 */
                let store = this.abrirStore("tblclientes",'readwrite'),
                    duplicado = false;
                if( this.accion=='nuevo' ){
                    this.cliente.idCliente = generarIdUnicoDesdeFecha();
                    
                    let data = await this.buscandoCodigoCliente(store);
                    duplicado = data.result!=undefined;
                }
                if( duplicado==false){
                    if( this.accion=='nuevo' ){
                        const resp = await axios.post('clientes',this.cliente);
                        this.cliente.id = resp.data;
                    } else {
                        const resp = await axios.put(`clientes/${this.cliente.id}`,this.cliente);
                    }
                    let tabla = this.abrirStore("tblclientes",'readwrite'),
                        query = tabla.put(this.cliente);
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
                    this.mostrarMsg('Codigo de cliente duplicado',true);
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
                let store = this.abrirStore('tblclientes','readonly'),
                    data = store.getAll();
                data.onsuccess=async resp=>{
                    if( data.result.length===0 ){
                        const clientes = await axios.get('clientes');
                        this.clientes = clientes.data;

                        let tabla = this.abrirStore('tblclientes','readwrite');
                        this.clientes.forEach(element => {
                            let cliente = {
                                id        : element.id,
                                idCliente : element.idCliente,
                                codigo    : element.codigo,
                                nombre    : element.nombre,
                                direccion : element.direccion,
                                telefono  : element.telefono,
                            };
                            tabla.put(cliente);
                        });
                    } else {
                        this.clientes = data.result;
                    }
                };
            },
            mostrarCliente(pro){
                this.cliente = pro;
                this.accion='modificar';
            },
            limpiar(){
                this.accion='nuevo';
                this.cliente.idCliente='';
                this.cliente.codigo='';
                this.cliente.nombre='';
                this.cliente.direccion='';
                this.cliente.telefono='';
                this.obtenerDatos();
            },
            async eliminarCliente(pro){
                if( confirm(`Esta seguro que desea eliminar el cliente:  ${pro.nombre}`) ){
                    const data = await axios.delete(`clientes/${pro.id}`);
                    
                    let store = this.abrirStore("tblclientes",'readwrite'),
                        req = store.delete(pro.idCliente);
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
