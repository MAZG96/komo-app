export interface Comentario {
    id:              number,
    texto:           string;
    valoracion:      number;
    estado:          string;
    id_producto:     number;
    id_productor:     number;
    id_usuario:      number;
    createdAt?:     string;

}
