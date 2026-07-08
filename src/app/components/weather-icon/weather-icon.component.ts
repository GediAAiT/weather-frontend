import { Component, Input } from '@angular/core';

export type WeatherCategory =
  | 'sun' | 'moon' | 'partly' | 'cloud' | 'rain' | 'snow' | 'storm' | 'fog';

export function weatherCategory(conditionKey: string, isDay: boolean): WeatherCategory {
  const k = conditionKey || '';
  if (k === 'clear' || k === 'mainly_clear') return isDay ? 'sun' : 'moon';
  if (k === 'partly_cloudy') return 'partly';
  if (k.startsWith('thunderstorm')) return 'storm';
  if (k.startsWith('snow') || k.includes('freezing')) return 'snow';
  if (k.startsWith('rain') || k.startsWith('drizzle')) return 'rain';
  if (k === 'fog' || k === 'rime_fog') return 'fog';
  return 'cloud';
}

@Component({
  selector: 'app-weather-icon',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 64 64" aria-hidden="true" [class]="'wi wi--' + category">
      @switch (category) {
        @case ('sun') {
          <g class="wi__rays" stroke="currentColor" stroke-width="3.4" stroke-linecap="round">
            <line x1="32" y1="6" x2="32" y2="13"/><line x1="32" y1="51" x2="32" y2="58"/>
            <line x1="6" y1="32" x2="13" y2="32"/><line x1="51" y1="32" x2="58" y2="32"/>
            <line x1="13.6" y1="13.6" x2="18.6" y2="18.6"/><line x1="45.4" y1="45.4" x2="50.4" y2="50.4"/>
            <line x1="50.4" y1="13.6" x2="45.4" y2="18.6"/><line x1="18.6" y1="45.4" x2="13.6" y2="50.4"/>
          </g>
          <circle class="wi__core" cx="32" cy="32" r="13" fill="currentColor"/>
        }
        @case ('moon') {
          <path class="wi__moon" d="M40 8a22 22 0 1 0 16 30A19 19 0 0 1 40 8z" fill="currentColor"/>
          <circle class="wi__star s1" cx="46" cy="14" r="2" fill="currentColor"/>
          <circle class="wi__star s2" cx="54" cy="24" r="1.5" fill="currentColor"/>
          <circle class="wi__star s3" cx="48" cy="32" r="1.2" fill="currentColor"/>
        }
        @case ('partly') {
          <g class="wi__rays" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".85">
            <line x1="24" y1="4" x2="24" y2="9"/><line x1="4" y1="24" x2="9" y2="24"/>
            <line x1="9.9" y1="9.9" x2="13.4" y2="13.4"/><line x1="38.1" y1="9.9" x2="34.6" y2="13.4"/>
          </g>
          <circle cx="24" cy="24" r="9.5" fill="currentColor" opacity=".85"/>
          <path class="wi__drift" d="M22 50a10 10 0 0 1 .6-19.9A14 14 0 0 1 49 35a9 9 0 0 1-2 15H22z"
                fill="currentColor" opacity=".5"/>
        }
        @case ('cloud') {
          <path class="wi__drift" d="M20 48a11 11 0 0 1 .8-21.9A15 15 0 0 1 49 31a10 10 0 0 1-2 17H20z" fill="currentColor"/>
          <path class="wi__drift2" d="M14 36a7 7 0 0 1 .5-13.9A9 9 0 0 1 31 26a6.5 6.5 0 0 1-1.4 10H14z"
                fill="currentColor" opacity=".45"/>
        }
        @case ('rain') {
          <path d="M20 38a11 11 0 0 1 .8-21.9A15 15 0 0 1 49 21a10 10 0 0 1-2 17H20z" fill="currentColor" opacity=".75"/>
          <g stroke="currentColor" stroke-width="3.4" stroke-linecap="round">
            <line class="wi__drop d1" x1="24" y1="44" x2="21" y2="54"/>
            <line class="wi__drop d2" x1="34" y1="44" x2="31" y2="54"/>
            <line class="wi__drop d3" x1="44" y1="44" x2="41" y2="54"/>
          </g>
        }
        @case ('snow') {
          <path d="M20 38a11 11 0 0 1 .8-21.9A15 15 0 0 1 49 21a10 10 0 0 1-2 17H20z" fill="currentColor" opacity=".7"/>
          <g fill="currentColor">
            <circle class="wi__flake d1" cx="24" cy="46" r="2.6"/>
            <circle class="wi__flake d2" cx="34" cy="50" r="2.6"/>
            <circle class="wi__flake d3" cx="44" cy="46" r="2.6"/>
          </g>
        }
        @case ('storm') {
          <path d="M20 36a11 11 0 0 1 .8-21.9A15 15 0 0 1 49 19a10 10 0 0 1-2 17H20z" fill="currentColor" opacity=".65"/>
          <path class="wi__bolt" d="M33 34l-9 13h7.4L28 58l13-16h-7.4L38 34z" fill="currentColor"/>
        }
        @case ('fog') {
          <g stroke="currentColor" stroke-width="3.6" stroke-linecap="round">
            <line class="wi__haze h1" x1="12" y1="24" x2="52" y2="24"/>
            <line class="wi__haze h2" x1="12" y1="34" x2="52" y2="34"/>
            <line class="wi__haze h3" x1="16" y1="44" x2="48" y2="44"/>
          </g>
        }
      }
    </svg>
  `,
  styles: [`
    :host { display: inline-flex; line-height: 0; }
    .wi { color: var(--tone, currentColor); overflow: visible; }

    .wi__rays {
      transform-origin: 50% 50%;
      animation: wi-spin 22s linear infinite;
    }
    .wi--partly .wi__rays { transform-origin: 37.5% 37.5%; }
    .wi__core { animation: wi-breathe 3.6s ease-in-out infinite; transform-origin: 50% 50%; }

    .wi__moon { animation: wi-sway 6s ease-in-out infinite; transform-origin: 50% 50%; }
    .wi__star { animation: wi-twinkle 2.4s ease-in-out infinite; }
    .wi__star.s2 { animation-delay: .7s; }
    .wi__star.s3 { animation-delay: 1.3s; }

    .wi__drift  { animation: wi-drift 5.5s ease-in-out infinite; }
    .wi__drift2 { animation: wi-drift 7s ease-in-out infinite reverse; }

    .wi__drop  { animation: wi-fall 1.3s ease-in infinite; }
    .wi__flake { animation: wi-fall 2.2s ease-in infinite; }
    .d2 { animation-delay: .4s; }
    .d3 { animation-delay: .8s; }

    .wi__bolt {
      animation: wi-flash 2.6s steps(1) infinite;
      transform-origin: 50% 40%;
    }

    .wi__haze { animation: wi-haze 4.5s ease-in-out infinite; }
    .h2 { animation-delay: .8s; }
    .h3 { animation-delay: 1.6s; }

    @keyframes wi-spin    { to { transform: rotate(360deg); } }
    @keyframes wi-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.07); } }
    @keyframes wi-sway    { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
    @keyframes wi-twinkle { 0%, 100% { opacity: .25; } 50% { opacity: 1; } }
    @keyframes wi-drift   { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(3.5px); } }
    @keyframes wi-fall {
      0%   { transform: translateY(-4px); opacity: 0; }
      30%  { opacity: 1; }
      85%  { opacity: 1; }
      100% { transform: translateY(7px); opacity: 0; }
    }
    @keyframes wi-flash {
      0%, 100% { opacity: 1; }
      42% { opacity: 1; } 46% { opacity: .15; } 50% { opacity: 1; }
      54% { opacity: .3; } 58% { opacity: 1; }
    }
    @keyframes wi-haze {
      0%, 100% { transform: translateX(-3px); opacity: .55; }
      50%      { transform: translateX(3px);  opacity: 1; }
    }
  `]
})
export class WeatherIconComponent {
  @Input({ required: true }) conditionKey = '';
  @Input() isDay = true;
  @Input() size = 44;

  get category(): WeatherCategory {
    return weatherCategory(this.conditionKey, this.isDay);
  }
}
