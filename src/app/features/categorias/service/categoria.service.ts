import { inject, Injectable, signal } from '@angular/core';
import { Categoria } from '../model/categoria';
import { SaveResponse } from '../../../core/models/save-response';
import { HttpClient, httpResource } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private readonly url = `${environment.API_BASE}/api/v1/categorias`;
  private categoriaData = signal<Categoria | null>(null);
  private deleteId = signal<number | null>(null);
  private categoriaId = signal<number | null>(null);

  categoriaByIdResource = httpResource<Categoria>(() => {
    const id = this.categoriaId();
    if (!id) return undefined;
    return `${this.url}/${id}`;
  });

  loadCategoria(id: number) {
    this.categoriaId.set(id);
  }

  categorias(nombre?: () => string | null) {
    return httpResource<Categoria[]>(() => {
      const filtro = nombre?.();
      return filtro ? `${this.url}/by-nombre?nombre=${filtro}` : this.url;
    });
  }

  saveResource = httpResource(() => {
    const data = this.categoriaData();
    if (!data) return undefined;
    return {
      url: this.url,
      method: 'POST',
      body: data,
    };
  });

  saveHttpResource(data: any) {
    this.categoriaData.set(data);
  }

  deleteResource = httpResource(() => {
    const id = this.deleteId();
    if (!id) return undefined;
    return {
      url: `${this.url}/${id}`,
      method: 'DELETE',
    };
  });

  delete(id: number) {
    this.deleteId.set(id);
  }
  clearDelete() {
  this.deleteId.set(null);
}
}
