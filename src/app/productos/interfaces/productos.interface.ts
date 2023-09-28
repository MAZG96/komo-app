export interface Producto {
    id:             string;
    nombre:         string;
    descripcion:    string;
    precio:         number;
    cantidad:       string;
    peso_total:      number;
    stock:          number;
    foto:           string;
    dias_publicados: string;
    distancia_punto?: number;
    id_categoria:   number;
    id_usuario:     number;

}

