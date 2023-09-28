export interface Notificacion {
    endpoint:       string;
    expirationTime: null;
    keys:           Keys;
    id_usuario:     number;
}

export interface Keys {
    p256dh: string;
    auth:   string;
}
