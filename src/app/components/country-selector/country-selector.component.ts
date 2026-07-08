import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Country } from '../../services/models';

@Component({
  selector: 'app-country-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  template: `
    <div class="picker">
      <div class="picker__field" [class.is-open]="open">
        <span class="msr picker__icon" aria-hidden="true">search</span>
        <input
          class="picker__search"
          type="search"
          [placeholder]="'search.placeholder' | translate"
          [(ngModel)]="query"
          (ngModelChange)="open = true"
          (focus)="open = true"
          [attr.aria-expanded]="open"
          aria-label="Search countries" />

        <button
          *ngIf="query"
          type="button"
          class="picker__clear"
          (click)="clear()"
          aria-label="Clear search">
          <span class="msr" aria-hidden="true">close</span>
        </button>
      </div>

      <ul class="picker__list" *ngIf="open && filtered().length">
        <li *ngFor="let c of filtered()">
          <button
            type="button"
            class="picker__item"
            [class.is-selected]="c.code === selectedCode"
            (click)="pick(c)">
            <span class="picker__flag" aria-hidden="true">{{ flagFor(c.code) }}</span>
            <span class="picker__name">
              <span>{{ c.name }}</span>
              <span class="picker__capital">{{ c.capital }}</span>
            </span>
            <span class="picker__continent">{{ c.continent }}</span>
          </button>
        </li>
      </ul>

      <p class="picker__empty" *ngIf="open && query && !filtered().length">
        {{ 'state.noResults' | translate }}
      </p>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .picker {
      position: relative;
      z-index: 5;
    }

    .picker__field {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      min-height: 60px;
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: var(--md-shape-lg);
      background:
        linear-gradient(180deg, var(--md-sys-color-surface-container-lowest), var(--md-sys-color-surface-container-low));
      box-shadow: var(--md-elev-1);
      overflow: hidden;
      transition:
        transform .25s var(--md-motion-spring),
        border-color .25s var(--md-motion-standard),
        box-shadow .25s var(--md-motion-standard);
    }

    .picker__field:hover,
    .picker__field.is-open {
      transform: translateY(-2px);
      border-color: color-mix(in srgb, var(--md-sys-color-primary) 42%, var(--md-sys-color-outline-variant));
      box-shadow: var(--md-elev-2);
    }

    .picker__field:focus-within {
      border-color: var(--md-sys-color-primary);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--md-sys-color-primary-container) 72%, transparent), var(--md-elev-2);
    }

    .picker__field::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(110deg, transparent 0 35%, rgba(255, 255, 255, .76), transparent 64%);
      transform: translateX(-120%);
      transition: transform .65s var(--md-motion-emphasized);
      pointer-events: none;
    }

    .picker__field:hover::after,
    .picker__field.is-open::after {
      transform: translateX(120%);
    }

    .picker__icon {
      flex: 0 0 auto;
      margin-left: 18px;
      color: var(--md-sys-color-primary);
      font-size: 24px;
    }

    .picker__search {
      min-width: 0;
      flex: 1 1 auto;
      height: 58px;
      border: 0;
      outline: 0;
      background: transparent;
      color: var(--md-sys-color-on-surface);
      padding: 0 14px;
      font-size: 1rem;
      font-family: inherit;
      font-weight: 600;
    }

    .picker__search::-webkit-search-cancel-button {
      appearance: none;
    }

    .picker__search::placeholder {
      color: var(--md-sys-color-on-surface-variant);
      font-weight: 500;
    }

    .picker__clear {
      position: relative;
      z-index: 1;
      width: 40px;
      height: 40px;
      flex: 0 0 auto;
      display: grid;
      place-items: center;
      margin-right: 10px;
      border: 0;
      border-radius: var(--md-shape-full);
      color: var(--md-sys-color-on-surface-variant);
      background: var(--md-sys-color-surface-container);
      cursor: pointer;
      transition:
        transform .25s var(--md-motion-spring),
        background .25s var(--md-motion-standard),
        color .25s var(--md-motion-standard);
    }

    .picker__clear:hover {
      transform: scale(1.06);
      color: var(--md-sys-color-primary);
      background: var(--md-sys-color-primary-container);
    }

    .picker__list {
      position: absolute;
      left: 0;
      right: 0;
      z-index: 20;
      max-height: min(430px, 58vh);
      overflow-y: auto;
      list-style: none;
      margin: 10px 0 0;
      padding: 8px;
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: var(--md-shape-lg);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, .94), rgba(246, 247, 255, .9));
      box-shadow: var(--md-elev-3);
      backdrop-filter: blur(22px) saturate(1.2);
      animation: picker-menu .28s var(--md-motion-emphasized) both;
    }

    .picker__list li {
      animation: picker-row .32s var(--md-motion-emphasized) both;
    }

    .picker__list li:nth-child(2n) { animation-delay: 18ms; }
    .picker__list li:nth-child(3n) { animation-delay: 36ms; }
    .picker__list li:nth-child(4n) { animation-delay: 54ms; }

    .picker__item {
      width: 100%;
      display: grid;
      grid-template-columns: 34px minmax(0, 1fr) auto;
      align-items: center;
      gap: 10px;
      border: 0;
      border-radius: var(--md-shape-md);
      background: transparent;
      color: var(--md-sys-color-on-surface);
      padding: 10px 12px;
      font-family: inherit;
      font-size: .96rem;
      text-align: left;
      cursor: pointer;
      transition:
        transform .24s var(--md-motion-spring),
        background .24s var(--md-motion-standard),
        color .24s var(--md-motion-standard);
    }

    .picker__item:hover,
    .picker__item.is-selected {
      transform: translateX(4px);
      background: var(--md-sys-color-primary-container);
      color: var(--md-sys-color-on-primary-container);
    }

    .picker__item:focus-visible {
      outline: 2px solid var(--md-sys-color-primary);
      outline-offset: 2px;
    }

    .picker__flag {
      font-size: 1.18rem;
      line-height: 1;
    }

    .picker__name {
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 3px;
      font-weight: 800;
    }

    .picker__name > span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .picker__capital,
    .picker__continent {
      color: var(--md-sys-color-on-surface-variant);
      font-size: .78rem;
      font-weight: 600;
    }

    .picker__item:hover .picker__capital,
    .picker__item:hover .picker__continent,
    .picker__item.is-selected .picker__capital,
    .picker__item.is-selected .picker__continent {
      color: color-mix(in srgb, var(--md-sys-color-on-primary-container) 74%, transparent);
    }

    .picker__continent {
      max-width: 112px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      justify-self: end;
    }

    .picker__empty {
      position: absolute;
      left: 0;
      right: 0;
      z-index: 20;
      margin: 10px 0 0;
      padding: 18px;
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: var(--md-shape-lg);
      background: rgba(255, 255, 255, .92);
      box-shadow: var(--md-elev-2);
      color: var(--md-sys-color-on-surface-variant);
      text-align: center;
      animation: picker-menu .28s var(--md-motion-emphasized) both;
    }

    @keyframes picker-menu {
      from { opacity: 0; transform: translateY(-8px) scale(.98); }
      to { opacity: 1; transform: none; }
    }

    @keyframes picker-row {
      from { opacity: 0; transform: translateX(-6px); }
      to { opacity: 1; transform: none; }
    }

    @media (max-width: 520px) {
      .picker__item {
        grid-template-columns: 30px minmax(0, 1fr);
      }

      .picker__continent {
        display: none;
      }
    }
  `]
})
export class CountrySelectorComponent {
  @Input() countries: Country[] = [];
  @Input() selectedCode = '';
  @Output() selected = new EventEmitter<Country>();

  query = '';
  open = false;

  filtered(): Country[] {
    const q = this.query.trim().toLowerCase();
    const list = q
      ? this.countries.filter(c => c.name.toLowerCase().includes(q) || c.capital.toLowerCase().includes(q))
      : this.countries;
    return list.slice(0, 60);
  }

  clear(): void {
    this.query = '';
    this.open = true;
  }

  pick(c: Country): void {
    this.query = c.name;
    this.open = false;
    this.selected.emit(c);
  }

  flagFor(code: string): string {
    const cc = code.toUpperCase();
    if (!/^[A-Z]{2}$/.test(cc)) return '';
    return String.fromCodePoint(...[...cc].map(c => 127397 + c.charCodeAt(0)));
  }
}
