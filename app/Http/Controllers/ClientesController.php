<?php

namespace App\Http\Controllers;

use App\clientes;
use Illuminate\Http\Request;

class ClientesController extends Controller
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
        return clientes::get();//select * from clientes
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $id = Clientes::create($request->all())->id;
        return response()->json($id, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\clientes  $cliente
     * @return \Illuminate\Http\Response
     */
    public function show(clientes $cliente)
    {
        return $cliente;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\clientes  $cliente
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, clientes $cliente)
    {
        $cliente->update($request->all());
        return response()->json($request->id,200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\clientes  $cliente
     * @return \Illuminate\Http\Response
     */
    public function destroy(clientes $cliente)
    {
        $cliente->delete();
        return response()->json($cliente->id,200);
    }
}
