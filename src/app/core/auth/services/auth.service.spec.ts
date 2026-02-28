import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController }
  from '@angular/common/http/testing';
import { TokenService } from './token.service';
import { IdleService } from './idle.service';

describe('AuthService', () => {

  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenService: jasmine.SpyObj<TokenService>;
  let idleService: jasmine.SpyObj<IdleService>;

  beforeEach(() => {

    const tokenSpy = jasmine.createSpyObj('TokenService', [
      'setAccessToken',
      'setRefreshToken',
      'getRefreshToken',
      'getAccessToken',
      'clearTokens'
    ]);

    const idleSpy = jasmine.createSpyObj('IdleService', [
      'startWatching',
      'stopWatching'
    ]);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: tokenSpy },
        { provide: IdleService, useValue: idleSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    idleService = TestBed.inject(IdleService) as jasmine.SpyObj<IdleService>;
  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should call login endpoint and save tokens', () => {

    service.login('admin', '123').subscribe();

    const req = httpMock.expectOne('http://localhost:8081/auth/login');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      username: 'admin',
      password: '123'
    });

    req.flush({
      accessToken: 'fake-access',
      refreshToken: 'fake-refresh'
    });

    expect(tokenService.setAccessToken)
      .toHaveBeenCalledWith('fake-access');

    expect(tokenService.setRefreshToken)
      .toHaveBeenCalledWith('fake-refresh');

    expect(idleService.startWatching)
      .toHaveBeenCalled();
  });


  it('should refresh token correctly', () => {

    tokenService.getRefreshToken.and.returnValue('old-refresh');

    service.refreshToken().subscribe();

    const req = httpMock.expectOne('http://localhost:8081/auth/refresh');

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      refreshToken: 'old-refresh'
    });

    req.flush({
      accessToken: 'new-access',
      refreshToken: 'new-refresh'
    });

    expect(tokenService.setAccessToken)
      .toHaveBeenCalledWith('new-access');

    expect(tokenService.setRefreshToken)
      .toHaveBeenCalledWith('new-refresh');
  });


  it('should logout and clear tokens', () => {

    tokenService.getRefreshToken.and.returnValue('refresh');

    service.logout();

    const req = httpMock.expectOne('http://localhost:8081/auth/logout');
    expect(req.request.method).toBe('POST');

    req.flush({});

    expect(idleService.stopWatching).toHaveBeenCalled();
    expect(tokenService.clearTokens).toHaveBeenCalled();
  });


  it('should return username from token', () => {

    const fakeToken = createFakeJwt({ sub: 'admin' });
    tokenService.getAccessToken.and.returnValue(fakeToken);

    const username = service.getUsername();

    expect(username).toBe('admin');
  });


  it('should return fullName from token', () => {

    const fakeToken = createFakeJwt({ fullName: 'Administrador' });
    tokenService.getAccessToken.and.returnValue(fakeToken);

    const fullName = service.getFullName();

    expect(fullName).toBe('Administrador');
  });

});


function createFakeJwt(payload: any): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.signature`;
}
