<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class proveedores extends Model
{
     /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'idProveedor', 'nrc', 'nombre', 'direccion', 'telefono'
    ];
    
}
