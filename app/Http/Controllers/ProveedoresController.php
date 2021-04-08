<?php

namespace App\Http\Controllers;

use App\proveedores;
use Illuminate\Http\Request;

class ProveedoresController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return proveedores::get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $id = Proveedores::create($request->all())->id;
        return response()->json($id, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\proveedores  $proveedor
     * @return \Illuminate\Http\Response
     */
    public function show(proveedores $proveedor)
    {
        return $proveedor;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\proveedores  $proveedor
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, proveedores $proveedor)
    {
        $proveedor->update($request->all());
        return response()->json($request->id,200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\proveedores  $proveedor
     * @return \Illuminate\Http\Response
     */
    public function destroy(proveedores $proveedor)
    {
        $proveedor->delete();
        return response()->json($proveedor->id,200);
    }
}
