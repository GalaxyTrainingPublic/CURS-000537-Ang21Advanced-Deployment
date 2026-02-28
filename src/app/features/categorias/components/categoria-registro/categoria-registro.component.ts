import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoriaService } from '../../service/categoria.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Categoria } from '../../model/categoria';

@Component({
  selector: 'app-categoria-registro.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categoria-registro.component.html',
  styleUrl: './categoria-registro.component.css',
})
export class CategoriaRegistroComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly categoriaService = inject(CategoriaService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly toastr = inject(ToastrService);

  saveResult = this.categoriaService.saveResource;
  categoriaResource = this.categoriaService.categoriaByIdResource;
  submitted = false;

  frmCategorias = this.fb.group({
    nombreCorto: [
      'Categoria 1',
      [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
    ],
    nombreLargo: [
      'Categoria 1 - Largo',
      [Validators.required, Validators.minLength(5), Validators.maxLength(60)],
    ],
  });

  constructor() {
    effect(() => {
      const value = this.saveResult.value();
      const error = this.saveResult.error();

      if (value) {
        this.toastr.success('El producto fue registrado con éxito', 'Aviso');
        this.frmCategorias.reset();
        this.submitted = false;
      }

      if (error) {
        this.toastr.error('Error al registrar el producto', 'Error');
      }

      // Edit
      //console.log('this.categoriaResource.status()=>{}', this.categoriaResource.status());
      if (this.categoriaResource.status() === 'loading') return;

      if (this.categoriaResource.status() !== 'resolved') return;

      const categoria = this.categoriaResource.value();

      if (!categoria) return;

      this.frmCategorias.patchValue(categoria);
    });
  }
  ngOnInit() {
    const id = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.categoriaService.loadCategoria(id);
  }

  cancelar() {
    this.router.navigate(['home/categorias']);
  }

  save() {
    this.submitted = true;
    if (this.frmCategorias.invalid) return;
    const formValue = this.frmCategorias.getRawValue();

    const categoria = new Categoria(formValue.nombreCorto, formValue.nombreLargo);

    this.categoriaService.saveHttpResource(categoria.toApi());
  }

  get fc() {
    return this.frmCategorias.controls;
  }
}
