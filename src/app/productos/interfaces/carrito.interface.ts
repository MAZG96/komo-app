export interface ItemCarrito {
    id:             number;
    id_producto:    string;
    foto:           string;
    cantidad:       number;
    precio:         number;
    nombre:         string;
    id_pedido?:     number;
    id_productor:   number;
    estado?:        string;
    recogida?:      string;
    pago_recogida?: number;
    zona?:          number;
    peso_producto?: number;
    cantidad_producto?: string;
    id_ups?:        string;
    frio?:          number;
}


export interface ItemCarritoZona {
    id:             number;
    id_producto:    string;
    foto:           string;
    cantidad:       number;
    precio:         number;
    nombre:         string;
    id_pedido?:     number;
    id_productor:   number;
    estado?:        string;
    recogida?:      string;
    pago_recogida?: number;
    zona:          number;
    peso_producto?: number;
    cantidad_producto?: string;
    frio?:          number;
}