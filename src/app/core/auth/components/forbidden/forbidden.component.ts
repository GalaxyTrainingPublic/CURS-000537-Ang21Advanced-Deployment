import { Component } from "@angular/core";

@Component({
  standalone: true,
  template: `
    <div class="text-center mt-5">
      <h1 class="text-danger">403</h1>
      <p>No tiene permisos para acceder a esta página.</p>
    </div>
  `
})
export class ForbiddenComponent {}
