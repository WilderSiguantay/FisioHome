import { Timestamp } from "rxjs/internal/operators/timestamp";

export interface User{
    uid: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
    phoneNumber: string;
    photoURL: string;
}

export interface Usuario{
    uid:string;
    displayName: string;
    DPI: string;
    photoURL: string;
    email : string;
    phoneNumber: string;
    emailVerified: boolean;
}

export interface Cita{
    id:string;
    paciente:string;
    profesional:string;
    estado:EstadoCita;
    fecha:string;
    fechaCreacion: Date;
    precio:number;
    direccion: string;
}

export interface Direccion{
    id:string;
    usuario:string;
    direccion:any;
    referencia:string;
}

export type EstadoCita = 'solicitada' | 'visto'| 'camino'| 'finalizada'