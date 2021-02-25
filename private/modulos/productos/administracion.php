<?php
include('../../Config/Config.php');
EXTRACT($_REQUEST);

$class_producto = new producto($conexion);
$producto = isset($producto) ? $producto : '[]';
print_r($class_producto->recibirDatos($producto));

/**
 * @class producto representa la administracion de las productos
 */
class producto{
    /**
     * @__construct @param $db representa la conexion a la BD
     */
    private $datos=[], $db;
    public $respuesta = ['msg'=>'correcto'];
    public function __construct($db=''){
        $this->db = $db;
    }
    /**
     * @function recibirDatos recibe los datos de la producto
     * @param $producto son los datos que viene desde el FRONT-END
     */
    public function recibirDatos($producto){
        $this->datos = json_decode($producto, true);
        return $this->validarDatos();
    }
    private function validarDatos(){
        if( empty(trim($this->datos['codigo'])) ){
            $this->respuesta['msg'] = 'Por favor digite el codigo de la producto';
        }
        if( empty(trim($this->datos['descripcion'])) ){
            $this->respuesta['msg'] = 'Por favor digite la descripcion de la producto';
        }
        if( empty(trim($this->datos['idProducto'])) ){
            $this->respuesta['msg'] = 'Algo inesperado paso y no se obtuvo el ID de la producto';
        }
        if( empty(trim($this->datos['precio'])) ){
            $this->respuesta['msg'] = 'Por favor ingrese el precio del producto';
        }
        return $this->almacenarDatos();
    }
    private function almacenarDatos(){
        if( $this->respuesta['msg']==='correcto' ){
            if( $this->datos['accion']==='nuevo' ){
                $this->db->consultas('
                    INSERT INTO productos (idC,codigo,descripcion,precio,idP) VALUES(
                        "'.$this->datos['categoria']['id'].'",
                        "'.$this->datos['codigo'].'",
                        "'.$this->datos['descripcion'].'",
                        "'.$this->datos['precio'].'",
                        "'.$this->datos['idProducto'].'"
                    )
                ');
                return $this->db->obtenerUltimoId();
            } else if( $this->datos['accion']==='modificar' ){
                $this->db->consultas('
                    UPDATE productos SET
                        idC         = "'.$this->datos['categoria']['id'].'",
                        codigo      = "'.$this->datos['codigo'].'",
                        descripcion = "'.$this->datos['descripcion'].'",
                        precio      = "'.$this->datos['precio'].'",
                    WHERE idP       = "'.$this->datos['idProducto'].'"
                ');
                return $this->db->obtener_respuesta();
            } else if( $this->datos['accion']==='eliminar' ){
                $this->db->consultas('
                    DELETE productos 
                    FROM productos
                    WHERE idP = "'.$this->datos['idProducto'].'"
                ');
                return $this->db->obtener_respuesta();
            }
        } else{
            return $this->respuesta;
        }
    }
}