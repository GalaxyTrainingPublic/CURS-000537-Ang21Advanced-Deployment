import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { commonTestingProviders } from '../../test/common-testing-providers';
import { AuthService } from '../../core/auth/services/auth.service';

const mockAuthService = {
  getUsername: () => 'admin',
  getFullName: () => 'Administrador',
  logout: jasmine.createSpy('logout')
};

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
       providers: [
        ...commonTestingProviders,
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
