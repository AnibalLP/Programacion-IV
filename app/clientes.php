<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class clientes extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'idCliente', 'codigo', 'nombre', 'direccion', 'telefono'
    ];

}
