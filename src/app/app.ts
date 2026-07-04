import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { interval, map } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected counter = signal(0);
  protected counter$ = toObservable(this.counter);
  private destroyRef = inject(DestroyRef);

  constructor() {
    // effect(() => {
    //   console.log('(signal) Counter value:', this.counter());
    // });
  }

  ngOnInit(): void {
    // https://rxjs.dev/api
    const subscription = interval(1000)
      .pipe(map((value) => value * 2))
      .subscribe((value) => {
        // console.log('Hello World ' + value);
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());

    // interval(1000).subscribe({
    //   next: (value) => console.log('Hello World. ' + value),
    //   error: (err) => console.log('Error', err),
    //   complete: () => console.log('Complete')
    // });

    this.counter$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        console.log('(observable) Counter value:', value);
      });
  }

  protected incrementCounter() {
    this.counter.update((value) => value + 1);
  }
}
