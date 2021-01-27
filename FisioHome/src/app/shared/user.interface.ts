import { Timestamp } from "rxjs/internal/operators/timestamp";

export interface User{
    uid: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
}

export interface Cliente{
    id:string;
    nombre: string;
    DPI: string;
    foto: string;
    email : string;
    telefono: string;
    contrasena: string;
    direccion: string;
}

export interface Cita{
    id:string;
    paciente:string;
    profesional:string;
    estado:string;
    fecha:string;
    precio:number;
    direccion: string;
}

export interface Direccion{
    id:string;
    usuario:string;
    direccion:any;
    referencia:string;
}