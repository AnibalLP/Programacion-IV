<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Sistema Facturacion</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@200;600&display=swap" rel="stylesheet">

    <!-- Styles -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
    <style>

    </style>
</head>
<body>
    <div id="app" class="container-fluid">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">::.. SISTEMA FACTURACION ..::</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText"
                    aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarText">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" @click="abrirForm('proveedor')" href="#">Proveedores</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" @click="abrirForm('cliente')" href="#">Clientes</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" @click="abrirForm('categoria')" href="#">Categorias</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" @click="abrirForm('producto')" href="#">Productos</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <clientes-component v-bind:form="forms" ref="cliente" v-show="forms['cliente'].mostrar"></clientes-component>
        <proveedores-component v-bind:form="forms" ref="proveedor" v-show="forms['proveedor'].mostrar"></proveedores-component>
        <categorias-component v-bind:form="forms" ref="categoria" v-show="forms['categoria'].mostrar"></categorias-component>
    </div>
    <script src="https://unpkg.com/vue-resizable@1"></script>
    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>