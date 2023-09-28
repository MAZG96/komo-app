import { trigger, transition, style, query, animateChild, group, animate } from "@angular/animations";

export const fader =
trigger('routeAnimations', [
    transition('* <=> *', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        })
      ], { optional: true }),
      query(':enter', [
        style({ left: '-100%' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('700ms ease-in-out', style({ opacity: 0.1, transform: 'scale(1) translateY(0)' }))
        ]),
        query(':enter', [
          animate('700ms ease-out', style({ opacity: 1, left: '0%' }))
        ]),
      ]),
    ]),
]);
