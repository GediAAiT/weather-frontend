import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { CountryProfile } from '../../services/models';

@Component({
  selector: 'app-country-profile',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <article class="profile" *ngIf="profile">
      <header class="profile__head">
        <div>
          <span class="profile__eyebrow">
            <span class="msr" aria-hidden="true">auto_awesome</span>
            {{ 'label.knownFor' | translate }}
          </span>
          <h3>{{ profile.headline }}</h3>
        </div>
        <span class="profile__source" [class.is-live]="profile.source === 'backend'">
          {{ (profile.source === 'backend' ? 'label.liveProfile' : 'label.instantProfile') | translate }}
        </span>
      </header>

      <p class="profile__summary">{{ profile.summary }}</p>

      <div class="profile__grid">
        <section
          class="highlight"
          *ngFor="let item of profile.highlights; let i = index"
          [class]="'highlight kind-' + item.kind"
          [style.animationDelay]="(i * 70) + 'ms'">
          <span class="highlight__icon" [class.has-image]="item.imageUrl" aria-hidden="true">
            <img
              *ngIf="item.imageUrl"
              class="highlight__image"
              [src]="item.imageUrl"
              alt=""
              loading="lazy"
              decoding="async"
              referrerpolicy="no-referrer"
              (error)="hideBrokenImage($event)" />
            <span class="msr fill">{{ item.icon || iconFor(item.kind) }}</span>
          </span>
          <div class="highlight__copy">
            <span class="highlight__kind">{{ ('highlight.' + item.kind) | translate }}</span>
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
          </div>
        </section>
      </div>
    </article>
  `,
  styles: [`
    :host { display: block; }

    .profile {
      position: relative;
      padding: 22px;
      border: 1px solid rgba(92, 102, 118, .18);
      border-radius: var(--md-shape-xl);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, .76), rgba(255, 255, 255, .5)),
        linear-gradient(116deg, transparent 0 34%, color-mix(in srgb, var(--md-sys-color-tertiary-container) 54%, transparent) 35% 52%, transparent 70%);
      box-shadow: var(--md-elev-3);
      backdrop-filter: blur(24px) saturate(1.2);
      overflow: hidden;
      animation: profile-enter .55s var(--md-motion-emphasized) both;
    }

    .profile::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(28, 27, 31, .04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(28, 27, 31, .04) 1px, transparent 1px);
      background-size: 38px 38px;
      mask-image: linear-gradient(180deg, rgba(0, 0, 0, .66), transparent 76%);
      pointer-events: none;
    }

    .profile__head {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .profile__eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--md-sys-color-primary);
      font-size: .78rem;
      font-weight: 900;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    .profile__eyebrow .msr {
      font-size: 18px;
    }

    .profile h3 {
      margin: 9px 0 0;
      max-width: 720px;
      font-family: var(--font-display);
      font-size: 2rem;
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: 0;
    }

    .profile__source {
      flex: 0 0 auto;
      padding: 8px 12px;
      border-radius: var(--md-shape-full);
      background: var(--md-sys-color-surface-container);
      color: var(--md-sys-color-on-surface-variant);
      font-size: .76rem;
      font-weight: 900;
      white-space: nowrap;
    }

    .profile__source.is-live {
      background: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-secondary);
    }

    .profile__summary {
      position: relative;
      z-index: 1;
      max-width: 860px;
      margin: 14px 0 18px;
      color: var(--md-sys-color-on-surface-variant);
      font-size: .98rem;
      font-weight: 600;
      line-height: 1.55;
    }

    .profile__grid {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .highlight {
      position: relative;
      display: grid;
      grid-template-columns: 52px minmax(0, 1fr);
      gap: 12px;
      min-height: 128px;
      padding: 14px;
      border: 1px solid rgba(92, 102, 118, .14);
      border-radius: var(--md-shape-lg);
      background: rgba(255, 255, 255, .58);
      box-shadow: var(--md-elev-1);
      overflow: hidden;
      animation: atmos-rise .5s var(--md-motion-emphasized) both;
      transition:
        transform .28s var(--md-motion-spring),
        box-shadow .28s var(--md-motion-standard);
    }

    .highlight::after {
      content: '';
      position: absolute;
      inset: auto -20% -38% -20%;
      height: 76%;
      background: linear-gradient(105deg, transparent, color-mix(in srgb, var(--kind-color) 14%, transparent), transparent);
      transform: translateX(-42%) skewX(-10deg);
      animation: highlight-sheen 6s var(--md-motion-emphasized) infinite alternate;
      pointer-events: none;
    }

    .highlight:hover {
      transform: translateY(-3px);
      box-shadow: var(--md-elev-2);
    }

    .kind-building { --kind-color: var(--md-sys-color-primary); }
    .kind-landmark { --kind-color: var(--md-sys-color-tertiary); }
    .kind-nature { --kind-color: #15803d; }
    .kind-resource { --kind-color: #b45309; }
    .kind-culture { --kind-color: #7c3aed; }

    .highlight__icon {
      position: relative;
      width: 52px;
      height: 52px;
      display: grid;
      place-items: center;
      border-radius: 18px;
      color: var(--kind-color);
      background: color-mix(in srgb, var(--kind-color) 15%, white);
      box-shadow: var(--md-elev-1);
      overflow: hidden;
      isolation: isolate;
    }

    .highlight__icon.has-image {
      color: white;
      background: color-mix(in srgb, var(--kind-color) 42%, #1f2937);
    }

    .highlight__icon.has-image::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: -1;
      background: linear-gradient(180deg, rgba(15, 23, 42, .04), rgba(15, 23, 42, .58));
    }

    .highlight__image {
      position: absolute;
      inset: 0;
      z-index: -2;
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: saturate(1.08);
    }

    .highlight__icon .msr {
      font-size: 27px;
    }

    .highlight__icon.has-image .msr {
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      background: rgba(15, 23, 42, .38);
      text-shadow: 0 2px 8px rgba(0, 0, 0, .38);
      backdrop-filter: blur(6px);
      font-size: 20px;
    }

    .highlight__copy {
      min-width: 0;
    }

    .highlight__kind {
      color: var(--kind-color);
      font-size: .72rem;
      font-weight: 900;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    .highlight h4 {
      margin: 4px 0 6px;
      font-size: 1rem;
      font-weight: 900;
      line-height: 1.18;
      letter-spacing: 0;
    }

    .highlight p {
      margin: 0;
      color: var(--md-sys-color-on-surface-variant);
      font-size: .86rem;
      font-weight: 600;
      line-height: 1.42;
    }

    @keyframes profile-enter {
      from { opacity: 0; transform: translateY(18px) scale(.98); }
      to { opacity: 1; transform: none; }
    }

    @keyframes highlight-sheen {
      from { transform: translateX(-42%) skewX(-10deg); }
      to { transform: translateX(42%) skewX(-10deg); }
    }

    @media (max-width: 720px) {
      .profile__head {
        flex-direction: column;
      }

      .profile h3 {
        font-size: 1.55rem;
      }

      .profile__grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 420px) {
      .profile {
        padding: 18px;
        border-radius: var(--md-shape-lg);
      }

      .highlight {
        grid-template-columns: 44px minmax(0, 1fr);
        min-height: auto;
      }

      .highlight__icon {
        width: 44px;
        height: 44px;
        border-radius: 15px;
      }
    }
  `]
})
export class CountryProfileComponent {
  @Input() profile: CountryProfile | null = null;

  hideBrokenImage(event: Event): void {
    const image = event.target as HTMLImageElement;
    image.hidden = true;
    image.parentElement?.classList.remove('has-image');
  }

  iconFor(kind: string): string {
    switch (kind) {
      case 'building': return 'apartment';
      case 'landmark': return 'account_balance';
      case 'nature': return 'landscape';
      case 'resource': return 'diamond';
      case 'culture': return 'festival';
      default: return 'auto_awesome';
    }
  }
}
