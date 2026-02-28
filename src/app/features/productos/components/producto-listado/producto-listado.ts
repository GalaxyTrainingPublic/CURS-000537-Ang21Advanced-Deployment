import { Component, inject, OnInit } from '@angular/core';
import { ProductoService } from '../../service/producto.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { ProductoResponse } from '../../model/producto.response';

@Component({
  selector: 'app-producto-listado',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './producto-listado.html',
  styleUrl: './producto-listado.css',
})
export class ProductoListado implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly router = inject(Router);
  private toastr = inject(ToastrService);
  private frmBuilder = inject(FormBuilder);

  frmProductos = this.frmBuilder.group({
    nombre: ['']
  });

page = 0;
size = 10;
totalItems = 0;

pageSizes = [5, 10, 20, 50];
onPageChange(newPage: number) {
  this.page = newPage;
  this.buscar();
}
pages(): number[] {
  const totalPages = Math.ceil(this.totalItems / this.size);
  return Array.from({ length: totalPages }, (_, i) => i);
}

trackPage = (_: number, page: number) => page;

onSizeChange(event: Event) {
  this.size = +(event.target as HTMLSelectElement).value;
  this.page = 0;
  this.buscar();
}
  public productos: ProductoResponse[] = [];

  ngOnInit(): void {
    this.findAll();
  }

  public findAll() {
    this.productoService.findAll().subscribe({
      next: (res) => {
        console.log(res);
        this.productos = res;
      },
      error(err) {},
      complete() {},
    });
  }

  nuevo() {
    this.router.navigate(['home/productos/registro']);
  }
  limpiar(){

  }

  buscar(){

    const nombre= this.frmProductos.controls['nombre'].value||''
    console.log(nombre)
    this.productoService.findByNombre(nombre).subscribe({
          next: (res) => {
            console.log(res);
            this.productos = res;
              //this.productos = res.content;
              //this.totalItems = res.totalElements;
          },
          error(err) {},
          complete() {},
        });
  }

  delete(producto: ProductoResponse) {
    Swal.fire({
      title: 'Confirma la eliminación de la producto ' + producto.nombre,
      text: 'Este proceso no es reversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.delete(producto.id).subscribe({
          next: (res) => {
            console.log(res);
            this.toastr.success(
              'La producto fue eliminada con éxito',
              'Aviso',
            );
            this.findAll();
          },
          error: (err) => {
            this.toastr.error('Error al eliminar la producto', 'Error');
          },
          complete() {},
        });
      }
    });
  }

}
