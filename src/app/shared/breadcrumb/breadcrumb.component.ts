import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css',
})
export class BreadCrumbComponent {
  breadcrumbs: Breadcrumb[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
    });
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = [],
  ): Breadcrumb[] {
    const children = route.children;

    for (const child of children) {
      const routeSegment = child.snapshot.url.map((segment) => segment.path).join('/');

      const nextUrl = routeSegment ? `${url}/${routeSegment}` : url;

      const breadcrumbLabel = child.snapshot.data['breadcrumb'];

      if (breadcrumbLabel) {
        const exists = breadcrumbs.some((b) => b.url === nextUrl);

        if (!exists) {
          breadcrumbs.push({
            label: breadcrumbLabel,
            url: nextUrl || '/',
          });
        }
      }

      this.createBreadcrumbs(child, nextUrl, breadcrumbs);
    }

    return breadcrumbs;
  }
}
