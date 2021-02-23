export interface User{
    uid: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
    phoneNumber: string;
    photoURL: string;
}


export interface Cita{
    id:string;
    paciente:User;
    profesional:User;
    estado:EstadoCita;
    fecha:string;
    fechaCreacion: Date;
    precio:number;
    direccion: Direccion;
    valoracion: number
}

export interface Direccion{
    id:string;
    usuario:User;
    direccion:any;
    referencia:string;
}

export type EstadoCita = 'Solicitada' | 'Cancelada'| 'Visto'| 'Camino'| 'Finalizada';