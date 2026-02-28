import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoListado } from './producto-listado';
import { commonTestingProviders } from '../../../../test/common-testing-providers';
import { provideHttpClientTesting } from '@angular/common/http/testing';


describe('ProductoListado', () => {
  let component: ProductoListado;
  let fixture: ComponentFixture<ProductoListado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoListado],
          providers: [
            ...commonTestingProviders,
            provideHttpClientTesting()
          ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoListado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
