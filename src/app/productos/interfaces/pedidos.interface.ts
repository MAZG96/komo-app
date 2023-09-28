export interface Pedido {
    id:             number;
    nombre:         string;
    apellidos:      string;
    calle:          string;
    piso:           string;
    localidad:      string;
    provincia:      string;
    telefono:       string;
    email:          string;
    codigo_postal:  string,
    total?:         number;
    tipo_venta?:    number;
    id_usuario:     number;
    estado?:        string;
    createdAt?:     string;
    updatedAt?:     string;

}
