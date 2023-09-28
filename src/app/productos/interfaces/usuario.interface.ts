export interface Usuario {
    id: string;
    nombre:string;
    nombre_empresa: string;
    ubicacion: string;
    coord_x: string;
    coord_y: string;
    foto: string;
    zona?: number;
    calle?: string,
    piso?: string,
    horario?: string,
    recogida?: number,
    pago_recogida?: number,
    distancia_punto?: number
    id_usuario: number;
    certificado?: string;
    cp_envio?: string;
    telefono_envio?: string;
    pregunta1?: string;
    pregunta2?: string;
    dias_publicados?: string;
    envio_frio?: number;
    envio_individual?: number;


}