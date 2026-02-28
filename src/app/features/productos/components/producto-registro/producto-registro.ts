import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductoService } from '../../service/producto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductoRequest } from '../../model/producto.request';
import { CategoriaService } from '../../../categorias/service/categoria.service';
import { Categoria } from '../../../categorias/model/categoria';

@Component({
  selector: 'app-producto-registro',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './producto-registro.html',
  styleUrl: './producto-registro.css',
})
export class ProductoRegistro{

  private frmBuilder = inject(FormBuilder);

  private readonly productoSerice= inject(ProductoService);
  private readonly categoriaService= inject(CategoriaService);

  private readonly router= inject(Router);
  private readonly route= inject(ActivatedRoute);

  private toastr= inject(ToastrService);

  public submitted=false;

  public categorias= this.categoriaService.categorias();

  frmProductos = this.frmBuilder.group({
     nombre: [
        'Producto 10x',
        [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
      ],

    descripcion: [
        'Producto 10x - descripcion',
        [Validators.required, Validators.minLength(5), Validators.maxLength(50)],
      ],
    precio: [
        '80',
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
    cantidad: [
        '8',
        [Validators.required, Validators.min(0), Validators.max(10)],
      ],
    categoriaId: [
        '1',
        [Validators.required],
      ]
  });

cancelar(){
  this.router.navigate(['home/productos'])
}

save(){
   this.submitted = true;
  if(!this.frmProductos.valid){
    return;
  }

    const nombre= this.frmProductos.controls['nombre'].value|| ''
    const descripcion= this.frmProductos.controls['descripcion'].value|| ''

    const producto:ProductoRequest={
        nombre:nombre,
        descripcion:descripcion,
        precio: Number(this.frmProductos.controls['precio'].value)|| 0,
        cantidad:Number(this.frmProductos.controls['cantidad'].value)|| 1,
        categoriaId:Number(this.frmProductos.controls['categoriaId'].value)|| 1,
    }

    console.log(producto)

   this.productoSerice.save(producto).subscribe({
     next: (res) => {
          console.log(res)
          if(res){
            const id= res["id"]
            this.toastr.success('El producto fue registrad con éxito','Aviso')
          }
      },
      error:(err) =>{
         this.toastr.error('Error al regigrar la producto','Error')
      },
      complete() {

      },
    })

}



  get fp(): { [key: string]: AbstractControl } {
    return this.frmProductos.controls;
  }

}
