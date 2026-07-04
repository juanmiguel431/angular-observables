import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { interval, map } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // https://rxjs.dev/api
    const subscription = interval(1000)
      .pipe(map((value) => value * 2))
      .subscribe((value) => {
        console.log('Hello World ' + value);
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());

    // interval(1000).subscribe({
    //   next: (value) => console.log('Hello World. ' + value),
    //   error: (err) => console.log('Error', err),
    //   complete: () => console.log('Complete')
    // });
  }
}
