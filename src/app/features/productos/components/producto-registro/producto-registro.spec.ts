import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoRegistro } from './producto-registro';
import { commonTestingProviders } from '../../../../test/common-testing-providers';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProductoRegistro', () => {
  let component: ProductoRegistro;
  let fixture: ComponentFixture<ProductoRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoRegistro],
      providers: [
        ...commonTestingProviders,
        provideHttpClientTesting()
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
