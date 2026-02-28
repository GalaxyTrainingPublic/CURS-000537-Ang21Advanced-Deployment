import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  loading = false;
  errorMessage = '';

  login() {

    if (!this.username || !this.password) {
      this.errorMessage = 'Debe ingresar usuario y contraseña';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password)
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['home']);
        },
        error: () => {
          this.loading = false;
          this.errorMessage = 'Credenciales incorrectas';
        }
      });
  }
}
