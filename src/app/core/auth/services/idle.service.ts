import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IdleService {

  private timeoutId: any;
  private readonly idleTime = 1 * 60 * 1000; // 1 minutos

  private idleSubject = new Subject<void>();
  idle$ = this.idleSubject.asObservable();

  constructor(private ngZone: NgZone) {}

  startWatching() {
    this.resetTimer();
    this.addListeners();
  }

  stopWatching() {
    clearTimeout(this.timeoutId);
    this.removeListeners();
  }

  private addListeners() {
    ['click', 'mousemove', 'keydown', 'scroll', 'touchstart']
      .forEach(event =>
        window.addEventListener(event, () => this.resetTimer())
      );
  }

  private removeListeners() {
    ['click', 'mousemove', 'keydown', 'scroll', 'touchstart']
      .forEach(event =>
        window.removeEventListener(event, () => this.resetTimer())
      );
  }

  private resetTimer() {
    clearTimeout(this.timeoutId);

    this.timeoutId = this.ngZone.runOutsideAngular(() =>
      setTimeout(() => {
        this.ngZone.run(() => {
          this.idleSubject.next();
        });
      }, this.idleTime)
    );
  }
}
