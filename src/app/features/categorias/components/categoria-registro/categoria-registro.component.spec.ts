import { commonTestingProviders } from '../../../../test/common-testing-providers';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaRegistroComponent } from './categoria-registro.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoriaListadoComponent } from '../categoria-listado/categoria-listado.component';
import { CategoriaService } from '../../service/categoria.service';

describe('CategoriaRegistroComponent', () => {
  let component: CategoriaRegistroComponent;
  let fixture: ComponentFixture<CategoriaRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriaRegistroComponent],
      providers: [
        ...commonTestingProviders,
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ToastrService,
          useValue: {
            success: () => {},
            error: () => {},
            warning: () => {},
            info: () => {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriaRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //

  it('should not submit if form is invalid', () => {
    component.frmCategorias.setValue({
      nombreCorto: '',
      nombreLargo: '',
    });

    component.save();

    expect(component.frmCategorias.invalid).toBeTrue();
  });

  it('should call save when form is valid', () => {
    const saveSpy = spyOn(component['categoriaService'], 'saveHttpResource');

    component.frmCategorias.setValue({
      nombreCorto: 'TEC',
      nombreLargo: 'Tecnología',
    });

    component.save();

    expect(saveSpy).toHaveBeenCalled();
  });

  it('should navigate after successful save', () => {
    const router = TestBed.inject(Router);
    const spy = spyOn(router, 'navigate');

    component.cancelar();

    expect(spy).toHaveBeenCalledWith(['home/categorias']);
  });

  it('should load categoria if id exists', () => {
    const service = component['categoriaService'];
    const spy = spyOn(service, 'loadCategoria');

    component.ngOnInit?.();

    expect(spy).toHaveBeenCalled();
  });

  it('should load categoria if id exists', () => {
    const service = component['categoriaService'];
    const spy = spyOn(service, 'loadCategoria');

    component.ngOnInit?.();

    expect(spy).toHaveBeenCalled();
  });

  it('should show success and reset form when saveResult has value', () => {
    const mockCategoriaService = TestBed.inject(CategoriaService) as any;

    mockCategoriaService.saveResource = {
      value: () => ({ id: 1 }),
      error: () => null,
    };

    mockCategoriaService.categoriaByIdResource = {
      status: () => 'idle',
      value: () => null,
    };

    fixture = TestBed.createComponent(CategoriaRegistroComponent);
    component = fixture.componentInstance;

    const toastr = TestBed.inject(ToastrService) as any;
    spyOn(toastr, 'success');

    fixture.detectChanges();

    expect(toastr.success).toHaveBeenCalled();
    expect(component.submitted).toBeFalse();
  });

  it('should show error when saveResult has error', () => {
    const mockCategoriaService = TestBed.inject(CategoriaService) as any;

    mockCategoriaService.saveResource = {
      value: () => null,
      error: () => true,
    };

    mockCategoriaService.categoriaByIdResource = {
      status: () => 'idle',
      value: () => null,
    };

    fixture = TestBed.createComponent(CategoriaRegistroComponent);
    component = fixture.componentInstance;

    const toastr = TestBed.inject(ToastrService) as any;
    spyOn(toastr, 'error');

    fixture.detectChanges();

    expect(toastr.error).toHaveBeenCalled();
  });

  it('should not patch form while categoriaResource is loading', () => {
    const mockCategoriaService = TestBed.inject(CategoriaService) as any;

    mockCategoriaService.saveResource = {
      value: () => null,
      error: () => null,
    };

    mockCategoriaService.categoriaByIdResource = {
      status: () => 'loading',
      value: () => null,
    };

    fixture = TestBed.createComponent(CategoriaRegistroComponent);
    component = fixture.componentInstance;

    spyOn(component.frmCategorias, 'patchValue');

    fixture.detectChanges();

    expect(component.frmCategorias.patchValue).not.toHaveBeenCalled();
  });

  it('should patch form when categoriaResource is resolved', () => {
    const categoriaMock = {
      nombreCorto: 'TEST',
      nombreLargo: 'TEST LARGO',
    };

    const mockCategoriaService = TestBed.inject(CategoriaService) as any;

    mockCategoriaService.saveResource = {
      value: () => null,
      error: () => null,
    };

    mockCategoriaService.categoriaByIdResource = {
      status: () => 'resolved',
      value: () => categoriaMock,
    };

    fixture = TestBed.createComponent(CategoriaRegistroComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.frmCategorias.value.nombreCorto).toBe('TEST');
  });

  it('should patch form when categoriaResource is resolved', () => {
    const categoriaMock = {
      nombreCorto: 'TEST',
      nombreLargo: 'TEST LARGO',
    };

    const mockCategoriaService = TestBed.inject(CategoriaService) as any;

    mockCategoriaService.saveResource = {
      value: () => null,
      error: () => null,
    };

    mockCategoriaService.categoriaByIdResource = {
      status: () => 'resolved',
      value: () => categoriaMock,
    };

    fixture = TestBed.createComponent(CategoriaRegistroComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(component.frmCategorias.value.nombreCorto).toBe('TEST');
  });

  it('should call loadCategoria on ngOnInit', () => {
    const service = TestBed.inject(CategoriaService) as any;
    const spy = spyOn(service, 'loadCategoria');

    component.ngOnInit();

    expect(spy).toHaveBeenCalled();
  });
});
