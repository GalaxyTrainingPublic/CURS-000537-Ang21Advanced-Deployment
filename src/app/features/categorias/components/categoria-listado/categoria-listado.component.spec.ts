import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriaListadoComponent } from './categoria-listado.component';
import { CategoriaService } from '../../service/categoria.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BsModalService } from 'ngx-bootstrap/modal';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { commonTestingProviders } from '../../../../test/common-testing-providers';

describe('CategoriaListadoComponent', () => {
  let component: CategoriaListadoComponent;
  let fixture: ComponentFixture<CategoriaListadoComponent>;

  let mockService: any;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockService = {

      categorias: () => ({
        value: () => [],
        reload: jasmine.createSpy('reload'),
        isLoading: () => false,
        error: () => null,
        status: () => 'idle',
      }),

      deleteResource: {
        status: () => 'idle',
        error: () => null,
      },

      delete: jasmine.createSpy('delete'),
      clearDelete: jasmine.createSpy('clearDelete'),
    };

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const modalSpy = jasmine.createSpyObj('BsModalService', ['show']);

    await TestBed.configureTestingModule({
      imports: [CategoriaListadoComponent],
      providers: [
         ...commonTestingProviders,
        { provide: CategoriaService, useValue: mockService },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: BsModalService, useValue: modalSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaListadoComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to nuevo', () => {
    component.nuevo();
    expect(router.navigate).toHaveBeenCalledWith(['home/categorias/registro']);
  });

  it('should set filtro on buscar', () => {
    component.frmCategorias.controls.nombre.setValue('Tec');
    component.buscar();

    expect(component.nombreFiltro()).toBe('Tec');
    expect(component.page()).toBe(1);
  });

  it('should limpiar form', () => {
    component.frmCategorias.controls.nombre.setValue('Test');
    component.limpiar();

    expect(component.frmCategorias.value.nombre).toBe('');
    expect(component.nombreFiltro()).toBeNull();
    expect(component.page()).toBe(1);
  });

  it('should navigate on editar', () => {
    component.editar({ id: 1, nombreCorto: 'A', nombreLargo: 'B' } as any);

    expect(router.navigate).toHaveBeenCalledWith(['home/categorias/editar', 1]);
  });

  it('should change page', () => {
    component.pageChanged({ page: 3, itemsPerPage: 10 });
    expect(component.page()).toBe(3);
  });

  it('should handle delete resolved', () => {
    const reloadSpy = jasmine.createSpy('reload');

    mockService.categorias = () => ({
      value: () => [],
      reload: reloadSpy,
      isLoading: () => false,
      error: () => null,
      status: () => 'idle',
    });

    mockService.deleteResource = {
      status: () => 'resolved',
      error: () => null,
    };

    fixture = TestBed.createComponent(CategoriaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const toastr = TestBed.inject(ToastrService) as any;

    expect(toastr.success).toHaveBeenCalled();
    expect(mockService.clearDelete).toHaveBeenCalled();
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should handle delete resolved', () => {

    const reloadSpy = jasmine.createSpy('reload');

    mockService.categorias = () => ({
      value: () => [],
      reload: reloadSpy,
      isLoading: () => false,
      error: () => null,
      status: () => 'idle',
    });

    mockService.deleteResource = {
      status: () => 'resolved',
      error: () => null,
    };

    fixture = TestBed.createComponent(CategoriaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const toastr = TestBed.inject(ToastrService) as any;

    expect(toastr.success).toHaveBeenCalled();
    expect(mockService.clearDelete).toHaveBeenCalled();
    expect(reloadSpy).toHaveBeenCalled();
  });
  it('should ignore when delete is loading', () => {
    mockService.deleteResource = {
      status: () => 'loading',
      error: () => null,
    };

    fixture = TestBed.createComponent(CategoriaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const toastr = TestBed.inject(ToastrService) as any;

    expect(toastr.success).not.toHaveBeenCalled();
    expect(toastr.error).not.toHaveBeenCalled();
  });

  it('should delete if confirmed', async () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    const categoria = { id: 10, nombreCorto: 'Test' } as any;

    await component.delete(categoria);

    expect(mockService.delete).toHaveBeenCalledWith(10);
  });

  it('should not delete if cancelled', async () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false } as any));

    const categoria = { id: 10, nombreCorto: 'Test' } as any;

    await component.delete(categoria);

    expect(mockService.delete).not.toHaveBeenCalled();
  });

  it('should open modal on verDetalle', () => {
    const modal = TestBed.inject(BsModalService) as any;

    const categoria = { id: 1 } as any;

    component.verDetalle(categoria, {} as any);

    expect(modal.show).toHaveBeenCalled();
    expect(component.categoriaSelected()).toEqual(categoria);
  });

  it('should paginate categories correctly', () => {
    const data = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
    }));

    mockService.categorias = () => ({
      value: () => data,
      reload: jasmine.createSpy('reload'),
      isLoading: () => false,
      error: () => null,
      status: () => 'idle',
    });

    fixture = TestBed.createComponent(CategoriaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.categoriasPagina().length).toBe(10);

    component.page.set(3);

    expect(component.categoriasPagina().length).toBe(5);
  });
});
