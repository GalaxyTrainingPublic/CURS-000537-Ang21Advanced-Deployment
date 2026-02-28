import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { BreadCrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-home.component',
  imports: [
      RouterOutlet,
      HeaderComponent,
      FooterComponent,
      BreadCrumbComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

}
