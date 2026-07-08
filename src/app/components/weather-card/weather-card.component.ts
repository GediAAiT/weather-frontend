import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { Weather } from '../../services/models';
import { WeatherCategory, WeatherIconComponent, weatherCategory } from '../weather-icon/weather-icon.component';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe, WeatherIconComponent],
  template: `
    <article class="weather-card" [ngClass]="['tone-' + category, !weather.isDay ? 'is-night' : 'is-day']">
      <div class="weather-card__energy" aria-hidden="true"></div>

      <header class="weather-card__head">
        <div class="weather-card__place">
          <span class="weather-card__flag" aria-hidden="true">{{ flag }}</span>
          <div class="weather-card__copy">
            <h2>{{ weather.countryName }}</h2>
            <p>
              <span class="msr" aria-hidden="true">location_city</span>
              {{ 'label.capital' | translate }} · {{ weather.capital }}
            </p>
          </div>
        </div>

        <div class="weather-card__orbit" aria-hidden="true">
          <span></span>
          <span></span>
          <app-weather-icon [conditionKey]="weather.conditionKey" [isDay]="weather.isDay" [size]="86" />
        </div>
      </header>

      <section class="weather-card__hero">
        <div>
          <div class="weather-card__temp">
            <span class="weather-card__deg">{{ weather.temperature | number:'1.0-0' }}</span>
            <span class="weather-card__unit">°C</span>
          </div>
          <p class="weather-card__condition">
            <span class="msr fill" aria-hidden="true">{{ weather.isDay ? 'light_mode' : 'dark_mode' }}</span>
            {{ ('weather.' + weather.conditionKey) | translate }}
          </p>
        </div>

        <div class="weather-card__feels">
          <span>{{ 'label.feelsLike' | translate }}</span>
          <strong>{{ weather.apparentTemperature | number:'1.0-0' }}°</strong>
        </div>
      </section>

      <section class="insight-strip" aria-label="Weather details">
        <div class="insight-strip__track">
          <span [style.width.%]="humidityPercent"></span>
        </div>
        <div class="insight-strip__copy">
          <span>{{ 'label.humidity' | translate }}</span>
          <strong>{{ weather.humidity }}%</strong>
        </div>
      </section>

      <dl class="weather-card__grid">
        <div class="metric">
          <dt>
            <span class="msr" aria-hidden="true">air</span>
            {{ 'label.wind' | translate }}
          </dt>
          <dd>
            {{ weather.windSpeed | number:'1.0-0' }}
            <span>{{ 'unit.kmh' | translate }}</span>
          </dd>
        </div>

        <div class="metric">
          <dt>
            <span class="msr" aria-hidden="true">humidity_percentage</span>
            {{ 'label.humidity' | translate }}
          </dt>
          <dd>
            {{ weather.humidity }}
            <span>%</span>
          </dd>
        </div>

        <div class="metric">
          <dt>
            <span class="msr" aria-hidden="true">water_drop</span>
            {{ 'label.precipitation' | translate }}
          </dt>
          <dd>
            {{ weather.precipitation | number:'1.0-1' }}
            <span>{{ 'unit.mm' | translate }}</span>
          </dd>
        </div>
      </dl>

      <footer class="weather-card__foot">
        <span>
          <span class="msr" aria-hidden="true">schedule</span>
          {{ 'label.localTime' | translate }}
        </span>
        <time>{{ weather.time | date:'short' }}</time>
      </footer>
    </article>
  `,
  styles: [`
    :host { display: block; }

    .weather-card {
      position: relative;
      min-height: 540px;
      display: flex;
      flex-direction: column;
      padding: clamp(22px, 4vw, 38px);
      border: 1px solid rgba(92, 102, 118, .18);
      border-radius: var(--md-shape-xl);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, .8), rgba(255, 255, 255, .48)),
        linear-gradient(122deg, transparent 0 46%, color-mix(in srgb, var(--tone-bg) 58%, transparent) 47% 61%, transparent 74%),
        linear-gradient(38deg, color-mix(in srgb, var(--tone) 14%, transparent), transparent 42%);
      box-shadow: var(--md-elev-3);
      backdrop-filter: blur(26px) saturate(1.22);
      overflow: hidden;
      animation: weather-enter .65s var(--md-motion-emphasized) both;
      isolation: isolate;
    }

    .weather-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(28, 27, 31, .048) 1px, transparent 1px),
        linear-gradient(90deg, rgba(28, 27, 31, .048) 1px, transparent 1px);
      background-size: 42px 42px;
      mask-image: linear-gradient(180deg, rgba(0, 0, 0, .72), transparent 75%);
      animation: data-grid 16s linear infinite;
      z-index: -2;
    }

    .weather-card__energy {
      position: absolute;
      inset: -12% -18% auto auto;
      width: 78%;
      height: 42%;
      background:
        linear-gradient(112deg, transparent, color-mix(in srgb, var(--tone) 36%, transparent), transparent, color-mix(in srgb, var(--md-sys-color-secondary) 24%, transparent), transparent);
      filter: blur(18px);
      opacity: .62;
      transform: skewY(-8deg);
      animation: energy-sweep 9s var(--md-motion-emphasized) infinite alternate;
      z-index: -1;
    }

    .is-night {
      background:
        linear-gradient(180deg, rgba(255, 255, 255, .72), rgba(242, 239, 255, .5)),
        linear-gradient(122deg, transparent 0 44%, color-mix(in srgb, var(--tone-bg) 72%, transparent) 45% 62%, transparent 76%),
        linear-gradient(38deg, rgba(67, 85, 185, .14), transparent 44%);
    }

    .weather-card__head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 18px;
    }

    .weather-card__place {
      display: flex;
      align-items: center;
      min-width: 0;
      gap: 14px;
    }

    .weather-card__flag {
      width: 54px;
      height: 54px;
      display: grid;
      place-items: center;
      flex: 0 0 auto;
      border-radius: 18px;
      background: rgba(255, 255, 255, .64);
      box-shadow: var(--md-elev-1);
      font-size: 1.7rem;
    }

    .weather-card__copy {
      min-width: 0;
    }

    .weather-card__copy h2 {
      margin: 0;
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 2.8rem;
      line-height: 1;
      letter-spacing: 0;
    }

    .weather-card__copy p {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 9px 0 0;
      color: var(--md-sys-color-on-surface-variant);
      font-size: .95rem;
      font-weight: 600;
    }

    .weather-card__copy .msr {
      color: var(--md-sys-color-primary);
      font-size: 18px;
    }

    .weather-card__orbit {
      position: relative;
      width: 132px;
      height: 132px;
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      border-radius: 42px;
      color: var(--tone);
      background:
        linear-gradient(145deg, rgba(255, 255, 255, .76), color-mix(in srgb, var(--tone-bg) 70%, rgba(255, 255, 255, .2)));
      box-shadow: var(--md-elev-glow);
    }

    .weather-card__orbit > span {
      position: absolute;
      inset: 13px;
      border: 1px solid color-mix(in srgb, var(--tone) 48%, transparent);
      border-radius: 34px;
      animation: orbit 9s linear infinite;
    }

    .weather-card__orbit > span:nth-child(2) {
      inset: 27px;
      border-color: color-mix(in srgb, var(--md-sys-color-secondary) 42%, transparent);
      animation-duration: 6s;
      animation-direction: reverse;
    }

    .weather-card__hero {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 24px;
      margin: clamp(28px, 5vw, 52px) 0 26px;
    }

    .weather-card__temp {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      color: var(--tone);
      text-shadow: 0 18px 38px color-mix(in srgb, var(--tone) 18%, transparent);
    }

    .weather-card__deg {
      font-family: var(--font-display);
      font-size: 8.8rem;
      font-weight: 900;
      line-height: .78;
      letter-spacing: 0;
    }

    .weather-card__unit {
      margin-top: .35em;
      font-family: var(--font-display);
      font-size: 2.2rem;
      font-weight: 900;
    }

    .weather-card__condition {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      max-width: 100%;
      margin: 18px 0 0;
      padding: 10px 14px;
      border-radius: var(--md-shape-full);
      background: color-mix(in srgb, var(--tone-bg) 70%, rgba(255, 255, 255, .66));
      color: color-mix(in srgb, var(--tone) 72%, #1a1b23);
      box-shadow: var(--md-elev-1);
      font-weight: 800;
    }

    .weather-card__condition .msr {
      font-size: 20px;
    }

    .weather-card__feels {
      min-width: 132px;
      padding: 18px;
      border: 1px solid rgba(92, 102, 118, .16);
      border-radius: var(--md-shape-lg);
      background: rgba(255, 255, 255, .54);
      box-shadow: var(--md-elev-1);
      text-align: right;
    }

    .weather-card__feels span,
    .insight-strip__copy span,
    .metric dt {
      color: var(--md-sys-color-on-surface-variant);
      font-size: .78rem;
      font-weight: 800;
      letter-spacing: .06em;
      text-transform: uppercase;
    }

    .weather-card__feels strong {
      display: block;
      margin-top: 8px;
      color: var(--md-sys-color-on-surface);
      font-family: var(--font-display);
      font-size: 2.2rem;
      line-height: 1;
    }

    .insight-strip {
      display: grid;
      gap: 10px;
      margin-bottom: 18px;
      padding: 16px;
      border-radius: var(--md-shape-lg);
      background: rgba(255, 255, 255, .5);
      border: 1px solid rgba(92, 102, 118, .14);
      box-shadow: var(--md-elev-1);
    }

    .insight-strip__track {
      height: 12px;
      border-radius: var(--md-shape-full);
      background: var(--md-sys-color-surface-container-high);
      overflow: hidden;
    }

    .insight-strip__track span {
      display: block;
      width: 0;
      height: 100%;
      border-radius: inherit;
      background:
        linear-gradient(90deg, var(--md-sys-color-secondary), var(--tone));
      animation: track-fill .85s var(--md-motion-emphasized) both;
    }

    .insight-strip__copy {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .insight-strip__copy strong {
      font-family: var(--font-display);
      font-size: 1.3rem;
      color: var(--tone);
    }

    .weather-card__grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin: 0;
    }

    .metric {
      position: relative;
      min-height: 126px;
      padding: 16px;
      border: 1px solid rgba(92, 102, 118, .14);
      border-radius: var(--md-shape-lg);
      background: rgba(255, 255, 255, .52);
      box-shadow: var(--md-elev-1);
      overflow: hidden;
      animation: atmos-rise .55s var(--md-motion-emphasized) both;
    }

    .metric::after {
      content: '';
      position: absolute;
      inset: auto -20% -42% -20%;
      height: 80%;
      background: linear-gradient(105deg, transparent, color-mix(in srgb, var(--tone) 15%, transparent), transparent);
      transform: translateX(-34%) skewX(-10deg);
      animation: metric-sheen 5.5s var(--md-motion-emphasized) infinite alternate;
      pointer-events: none;
    }

    .metric:nth-child(2) { animation-delay: 80ms; }
    .metric:nth-child(3) { animation-delay: 160ms; }

    .metric dt {
      display: flex;
      align-items: center;
      gap: 7px;
    }

    .metric dt .msr {
      color: var(--tone);
      font-size: 20px;
    }

    .metric dd {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin: 26px 0 0;
      color: var(--md-sys-color-on-surface);
      font-family: var(--font-display);
      font-weight: 900;
      font-size: 2.4rem;
      line-height: 1;
    }

    .metric dd span {
      color: var(--md-sys-color-on-surface-variant);
      font-family: var(--font-ui);
      font-size: .82rem;
      font-weight: 800;
    }

    .weather-card__foot {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      margin-top: auto;
      padding-top: 22px;
      color: var(--md-sys-color-on-surface-variant);
      font-size: .9rem;
      font-weight: 700;
    }

    .weather-card__foot span {
      display: inline-flex;
      align-items: center;
      gap: 7px;
    }

    .weather-card__foot .msr {
      color: var(--md-sys-color-primary);
      font-size: 19px;
    }

    .weather-card__foot time {
      color: var(--md-sys-color-on-surface);
    }

    @keyframes weather-enter {
      from { opacity: 0; transform: translateY(22px) scale(.98); }
      to { opacity: 1; transform: none; }
    }

    @keyframes data-grid {
      to { background-position: 42px 42px; }
    }

    @keyframes energy-sweep {
      from { transform: translateX(-8%) skewY(-8deg); }
      to { transform: translateX(8%) skewY(-8deg); }
    }

    @keyframes orbit {
      to { transform: rotate(360deg); }
    }

    @keyframes track-fill {
      from { transform: translateX(-100%); }
      to { transform: none; }
    }

    @keyframes metric-sheen {
      from { transform: translateX(-44%) skewX(-10deg); }
      to { transform: translateX(44%) skewX(-10deg); }
    }

    @media (max-width: 720px) {
      .weather-card {
        min-height: 460px;
      }

      .weather-card__copy h2 {
        font-size: 2.2rem;
      }

      .weather-card__hero {
        align-items: stretch;
        flex-direction: column;
      }

      .weather-card__feels {
        text-align: left;
      }

      .weather-card__grid {
        grid-template-columns: 1fr;
      }

      .metric {
        min-height: auto;
      }

      .metric dd {
        font-size: 2rem;
      }
    }

    @media (max-width: 520px) {
      .weather-card__head {
        flex-direction: column;
      }

      .weather-card__orbit {
        align-self: flex-end;
        width: 112px;
        height: 112px;
        border-radius: 34px;
      }

      .weather-card__flag {
        width: 48px;
        height: 48px;
      }

      .weather-card__condition {
        border-radius: var(--md-shape-lg);
      }

      .weather-card__copy h2 {
        font-size: 1.8rem;
      }

      .weather-card__deg {
        font-size: 5.1rem;
      }

      .weather-card__unit {
        font-size: 1.5rem;
      }

      .weather-card__foot {
        align-items: flex-start;
        flex-direction: column;
      }
    }
  `]
})
export class WeatherCardComponent {
  @Input({ required: true }) weather!: Weather;

  get category(): WeatherCategory {
    return weatherCategory(this.weather.conditionKey, this.weather.isDay);
  }

  get humidityPercent(): number {
    return Math.max(0, Math.min(100, this.weather.humidity));
  }

  get flag(): string {
    const cc = (this.weather.countryCode || '').toUpperCase();
    if (!/^[A-Z]{2}$/.test(cc)) return '';
    return String.fromCodePoint(...[...cc].map(c => 127397 + c.charCodeAt(0)));
  }
}
