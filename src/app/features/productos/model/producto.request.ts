import { Categoria } from "../../categorias/model/categoria";

export interface ProductoRequest {
    id?:number;
    nombre:string;
    descripcion:string;
    precio:number,
    cantidad:number
    categoriaId:number
    estado?:string;
}
