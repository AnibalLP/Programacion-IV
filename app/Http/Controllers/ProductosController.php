<?php

namespace App\Http\Controllers;

use App\productos;
use Illuminate\Http\Request;

class ProductosController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return productos::get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //$id = Productos::create($request->all())->id;
        $producto = Productos::create();
        $producto->idProducto = $request['idProducto'];
        $producto->idCategoria = $request['categoria']['id'];
        $producto->codigo = $request['codigo'];
        $producto->descripcion = $request['descripcion'];
        $producto->precio = $request['precio'];
        $producto->save();
        return response()->json($producto['id'], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\productos  $producto
     * @return \Illuminate\Http\Response
     */
    public function show(productos $producto)
    {
        return $producto;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\productos  $producto
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, productos $producto)
    {
        //$producto->update($request->all());
        $producto->idProducto = $request['idProducto'];
        $producto->idCategoria = $request['categoria']['id'];
        $producto->codigo = $request['codigo'];
        $producto->descripcion = $request['descripcion'];
        $producto->precio = $request['precio'];
        $producto->save();
        return response()->json($request->id,200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\productos  $producto
     * @return \Illuminate\Http\Response
     */
    public function destroy(productos $producto)
    {
        $producto->delete();
        return response()->json($producto->id,200);
    }
}
