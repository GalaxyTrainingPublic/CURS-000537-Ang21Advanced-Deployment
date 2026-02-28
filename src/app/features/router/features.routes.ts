import { Routes } from '@angular/router';
import { CategoriaListadoComponent } from '../categorias/components/categoria-listado/categoria-listado.component';
import { CategoriaRegistroComponent } from '../categorias/components/categoria-registro/categoria-registro.component';
import { ProductoRegistro } from '../productos/components/producto-registro/producto-registro';
import { HomeComponent } from '../home/home/home.component';
import { authGuard } from '../../core/auth/guards/auth.guard';
import { roleGuard } from '../../core/auth/guards/role.guard';

export const FEATURES_ROUTER: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { breadcrumb: 'Home' },
    children: [
      {
        path: 'categorias',
        data: { breadcrumb: 'Categorías' },
        children: [
          /*
          {
            path: '',
            component: CategoriaListadoComponent,
            data: { breadcrumb: 'Listado' },
          },*/
          {
            path: '',
            loadComponent: () =>
              import('../categorias/components/categoria-listado/categoria-listado.component').then(
                (m) => m.CategoriaListadoComponent,
              ),
            canActivate: [roleGuard],
            data: { role: 'ADMIN' },
          },
          {
            path: 'registro',
            component: CategoriaRegistroComponent,
            data: { breadcrumb: 'Registro' },
          },
          {
            path: 'editar/:id',
            component: CategoriaRegistroComponent,
          },
        ],
      },
      {
        path: 'productos',
        data: { breadcrumb: 'productos' },
        children: [
          /*
          {
            path: '',
            component: ProductoListado,
            data: { breadcrumb: 'Listado' }
          },*/
          {
            path: '',
            loadComponent: () =>
              import('../productos/components/producto-listado/producto-listado').then(
                (m) => m.ProductoListado,
              ),
            canActivate: [authGuard],
            data: { role: 'ADMIN' },
          },
          {
            path: 'registro',
            component: ProductoRegistro,
            data: { breadcrumb: 'Registro' },
          },
        ],
      },
    ],
  },
];
