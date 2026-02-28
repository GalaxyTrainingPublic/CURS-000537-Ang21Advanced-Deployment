import { Component, computed, effect, inject, OnInit, signal, TemplateRef } from '@angular/core';
import { CategoriaService } from '../../service/categoria.service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormBuilder, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Categoria } from '../../model/categoria';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-categoria-listado.component',
  imports: [CommonModule, ReactiveFormsModule, PaginationModule,RouterLink],
  templateUrl: './categoria-listado.component.html',
  styleUrl: './categoria-listado.component.css',
})
export class CategoriaListadoComponent {
  private readonly categoriaService = inject(CategoriaService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly modalService = inject(BsModalService);
  public modalRef?: BsModalRef;

  itemsPerPage = 10;
  page = signal(1);

  frmCategorias = this.fb.group({
    nombre: [''],
  });

  nombreFiltro = signal<string | null>(null);

  categoriasResource = this.categoriaService.categorias(() => this.nombreFiltro());
  
  deleteResult = this.categoriaService.deleteResource;

  trackCategoria = (categoria: Categoria) => categoria.id!;

  categoriaSelected = signal<Categoria | null>(null);

  categoriasPagina = computed(() => {
    const data = this.categoriasResource.value() ?? [];
    const start = (this.page() - 1) * this.itemsPerPage;
    const end = this.page() * this.itemsPerPage;
    return data.slice(start, end);
  });

  constructor() {
    effect(() => {
      //console.log('effect...');

      const status = this.deleteResult.status();
      const error = this.deleteResult.error();

      if (status === 'loading') return;

      if (error) {
        this.toastr.error('Error al eliminar la categoría', 'Error');
        return;
      }

      if (status === 'resolved') {
        this.toastr.success('La categoría fue eliminada con éxito', 'Aviso');
        this.categoriaService.clearDelete();
        this.categoriasResource.reload();
      }
    });
    this.frmCategorias.controls.nombre.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe((nombre) => {
        this.nombreFiltro.set(nombre && nombre.length >= 2 ? nombre : null);
        this.page.set(1);
      });
  }

  nuevo(): void {
    this.router.navigate(['home/categorias/registro']);
  }

  buscar(): void {
    const { nombre } = this.frmCategorias.getRawValue();
    this.nombreFiltro.set(nombre.length >= 2 ? nombre : null);
    this.page.set(1);
  }

  limpiar(): void {
    this.frmCategorias.reset();
    this.nombreFiltro.set(null);
    this.page.set(1);
  }

  delete(categoria: Categoria): void {
    Swal.fire({
      title: `Confirma la eliminación de la categoría ${categoria.nombreCorto}`,
      text: 'Este proceso no es reversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (!result.isConfirmed) return;
      console.log('id={}', categoria.id);
      this.categoriaService.delete(categoria.id!);
    });
  }

  editar(categoria: Categoria): void {
    this.router.navigate(['home/categorias/editar', categoria.id]);
  }

  verDetalle(categoria: Categoria, template: TemplateRef<void>) {
    this.categoriaSelected.set(categoria);
    this.modalRef = this.modalService.show(template);
  }

  pageChanged(event: PageChangedEvent): void {
    this.page.set(event.page);
  }
}
