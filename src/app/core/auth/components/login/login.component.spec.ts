/*
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error if username or password are empty', () => {
    component.username = '';
    component.password = '';

    component.login();

    expect(component.errorMessage)
      .toBe('Debe ingresar usuario y contraseña');
  });
it('should navigate to home on successful login', () => {

  authService.login.and.returnValue(
    of({
      accessToken: 'fake-access',
      refreshToken: 'fake-refresh'
    })
  );

  component.username = 'admin';
  component.password = '123';

  component.login();

  expect(authService.login)
    .toHaveBeenCalledWith('admin', '123');

  expect(router.navigate)
    .toHaveBeenCalledWith(['home']);

  expect(component.loading).toBeFalse();
});

  it('should show error on failed login', () => {

    authService.login.and.returnValue(
      throwError(() => new Error('error'))
    );

    component.username = 'admin';
    component.password = 'wrong';

    component.login();

    expect(component.errorMessage)
      .toBe('Credenciales incorrectas');

    expect(component.loading).toBeFalse();
  });

});