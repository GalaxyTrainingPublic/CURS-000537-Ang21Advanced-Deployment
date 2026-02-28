import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductoResponse } from '../model/producto.response';
import { ProductoRequest } from '../model/producto.request';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
   //url= environment.API_BASE+'/api/v1/categorias'
  url=`${environment.API_BASE}/api/v1/productos`

  private readonly http= inject(HttpClient)

  public findAll():Observable<ProductoResponse[]>{
    return this.http.get<ProductoResponse[]>(this.url);
  }

  public findByNombre(nombre:string):Observable<ProductoResponse[]>{
    return this.http.get<ProductoResponse[]>(`${this.url}/by-nombre?nombre=${nombre}`);
  }

  public save(producto:ProductoRequest):Observable<any>{
    console.log(producto)
    JSON.stringify(producto)

    return this.http.post<any>(this.url,producto);
  }

  public delete(id?:number):Observable<any>{
    return this.http.delete<any>(`${this.url}/${id}`);
  }

}
