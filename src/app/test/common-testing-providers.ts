import { provideAnimations } from "@angular/platform-browser/animations";
import { ActivatedRoute, provideRouter } from "@angular/router";
import { provideToastr } from "ngx-toastr";
import { of } from "rxjs";

export const commonTestingProviders = [
  provideRouter([]),
  provideToastr(),
  provideAnimations(),
  {
    provide: ActivatedRoute,
    useValue: {
      snapshot: { paramMap: new Map() },
      params: of({})
    }
  }
];
