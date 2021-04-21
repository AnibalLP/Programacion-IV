<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class productos extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'idProducto', 'idCategoria', 'codigo', 'descripcion', 'precio'
    ];

}
