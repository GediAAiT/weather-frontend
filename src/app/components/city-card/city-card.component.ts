import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Weather } from '../../services/models';
import { WeatherIconComponent, weatherCategory } from '../weather-icon/weather-icon.component';

@Component({
  selector: 'app-city-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe, WeatherIconComponent],
  template: `
    <button
      type="button"
      class="ccard"
      [class]="'ccard tone-' + category"
      [style.animationDelay]="(index * 70) + 'ms'"
      (click)="open.emit(weather)">

      <span class="ccard__chip">
        <app-weather-icon [conditionKey]="weather.conditionKey" [isDay]="weather.isDay" [size]="40" />
      </span>

      <span class="ccard__body">
        <span class="ccard__name">
          <span class="ccard__flag" aria-hidden="true">{{ flag }}</span>
          {{ weather.countryName }}
        </span>
        <span class="ccard__sub">
          {{ weather.capital }} · {{ ('weather.' + weather.conditionKey) | translate }}
        </span>
      </span>

      <span class="ccard__right">
        <span class="ccard__deg">{{ weather.temperature | number:'1.0-0' }}°</span>
        <span class="ccard__meta">
          {{ 'label.feelsLike' | translate }} {{ weather.apparentTemperature | number:'1.0-0' }}°
          · {{ weather.humidity }}%
        </span>
      </span>

      <span class="ccard__glow" aria-hidden="true"></span>
    </button>
  `,
  styles: [`
    :host { display: block; }

    .ccard {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 18px 20px;
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: var(--md-shape-lg);
      background: var(--md-sys-color-surface-container-lowest);
      box-shadow: var(--md-elev-1);
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      color: inherit;
      overflow: hidden;
      animation: atmos-rise .55s var(--md-motion-emphasized) both;
      transition:
        transform .35s var(--md-motion-spring),
        box-shadow .35s var(--md-motion-standard),
        border-color .35s var(--md-motion-standard);
    }
    .ccard:hover {
      transform: translateY(-5px) scale(1.015);
      box-shadow: var(--md-elev-3);
      border-color: color-mix(in srgb, var(--tone) 45%, var(--md-sys-color-outline-variant));
    }
    .ccard:active { transform: translateY(-1px) scale(.99); }
    .ccard:focus-visible {
      outline: 2px solid var(--md-sys-color-primary);
      outline-offset: 2px;
    }

    .ccard__glow {
      position: absolute;
      inset: auto -30% -65% -30%;
      height: 110%;
      background: linear-gradient(105deg, transparent, color-mix(in srgb, var(--tone) 16%, transparent), transparent);
      opacity: 0;
      transition: opacity .4s var(--md-motion-standard);
      pointer-events: none;
    }
    .ccard:hover .ccard__glow { opacity: 1; }

    .ccard__chip {
      flex: 0 0 auto;
      width: 64px;
      height: 64px;
      display: grid;
      place-items: center;
      border-radius: var(--md-shape-md);
      background: var(--tone-bg);
      transition: transform .35s var(--md-motion-spring);
    }
    .ccard:hover .ccard__chip { transform: scale(1.08) rotate(-3deg); }

    .ccard__body { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
    .ccard__name {
      font-weight: 600;
      font-size: 1.06rem;
      letter-spacing: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .ccard__flag { font-size: 1.15rem; line-height: 1; }
    .ccard__sub {
      color: var(--md-sys-color-on-surface-variant);
      font-size: .86rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ccard__right { flex: 0 0 auto; display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }
    .ccard__deg {
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 2.1rem;
      line-height: 1;
      letter-spacing: 0;
      color: var(--tone);
    }
    .ccard__meta { color: var(--md-sys-color-on-surface-variant); font-size: .76rem; }
  `]
})
export class CityCardComponent {
  @Input({ required: true }) weather!: Weather;
  @Input() index = 0;
  @Output() open = new EventEmitter<Weather>();

  get category(): string {
    return weatherCategory(this.weather.conditionKey, this.weather.isDay);
  }

  get flag(): string {
    const cc = (this.weather.countryCode || '').toUpperCase();
    if (!/^[A-Z]{2}$/.test(cc)) return '';
    return String.fromCodePoint(...[...cc].map(c => 127397 + c.charCodeAt(0)));
  }
}
