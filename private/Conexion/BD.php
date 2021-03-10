<?php
class DB_Conexion{
    private $conexion, $result;

    public function DB_Conexion($server,$user,$pass){
        $this->conexion = new PDO($server,$user,$pass,array(PDO::ATTR_EMULATE_PREPARES=>false,PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION)) or die('No se pudo conectar a la BD...');
    }
    public function consultas($sql=''){
        try {
            $this->result = $this->conexion->query($sql);
        } catch (Exception $e) {
            echo 'Error al ejecutar al consulta '. $e->getMessage();
        }
    }
    public function obtener_datos(){
        return $this->result->fetchAll(PDO::FETCH_ASSOC);
    }
    public function obtener_respuesta(){
        return $this->result;
    }
    public function obtenerUltimoId(){
        return $this->conexion->lastInsertId();
    }
}