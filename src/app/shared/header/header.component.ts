import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
      RouterLink,
      RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  username = this.authService.getUsername();
  fullaName = this.authService.getFullName();

  logout() {

    this.authService.logout();

    //this.router.navigate(['/login']);
     this.router.navigate(['/login'], { replaceUrl: true });
  }
}
