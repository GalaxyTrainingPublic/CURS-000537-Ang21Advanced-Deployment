import { Categoria } from "../../categorias/model/categoria";

export interface ProductoResponse {
    id?:number;
    nombre:string;
    descripcion:string;
    precio:number,
    cantidad:number
    categoria:Categoria
    estado?:string;
}
