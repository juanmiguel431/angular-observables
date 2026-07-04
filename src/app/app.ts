import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { interval, map, Observable } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';

type CustomValue = { message: string; value: number };

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected counter = signal(0);
  protected counter$ = toObservable(this.counter);
  private interval = interval(1000);
  protected intervalSignal = toSignal(this.interval, { initialValue: 0 });
  protected customInterval$ = new Observable<CustomValue>((subscriber) => {
    let counter = 0;
    const intervalRef = setInterval(() => {
      console.log('Emitting value ' + counter);
      subscriber.next({ message: 'new value', value: counter });

      if (counter === 5) {
        clearInterval(intervalRef);
        subscriber.complete();
      }

      counter++;
    }, 2000);
  });

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

    this.counter$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      console.log('(observable) Counter value:', value);
    });

    this.customInterval$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (value) => console.log('(observable) Custom interval value:', value),
      complete: () => console.log('(observable) Custom interval COMPLETED!'),
    });
  }

  protected incrementCounter() {
    this.counter.update((value) => value + 1);
  }
}
