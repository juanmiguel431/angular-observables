import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const subscription = interval(1000).subscribe((value) => {
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
