<?php
include('../../Config/Config.php');

/**
 * @class categoria representa la administracion de las categorias
 */
class categoria{
    /**
     * @__construct @param $db representa la conexion a la BD
     */
    private $datos=[], $db;
    public $respuesta = ['mgs'=>'correcto'];
    public function __construct($db=''){
        $this->db = $db;
    }
    /**
     * @function recibirDatos recibe los datos de la categoria
     * @param $categoria son los datos que viene desde el FRONT-END
     */
    public function recibirDatos($categoria){
        $this->datos = json_decode($categoria, true);
        $this->validarDatos();
    }
    private function validarDatos(){
        if( empty(trim($this->datos['codigo'])) ){
            $this->respuesta['msg'] = 'Por favor digite el codigo de la categoria';
        }
        if( empty(trim($this->datos['descripcion'])) ){
            $this->respuesta['msg'] = 'Por favor digite la descripcion de la categoria';
        }
        if( empty(trim($this->datos['idCategoria'])) ){
            $this->respuesta['msg'] = 'Algo inesperado paso y no se obtuvo el ID de la categoria';
        }
        $this->almacenarDatos();
    }
    private function almacenarDatos(){
        if( $this->respuesta['msg']==='correcto' ){
            if( $this->datos['accion']==='nuevo' ){
                $this->db->consultas('
                    INSERT INTO categorias (codigo,descripcion, idC) VALUES(
                        "'.$this->datos['codigo'].'",
                        "'.$this->datos['descripcion'].'",
                        "'.$this->datos['idCategoria'].'"
                    )
                ');
            }
        }
    }
}