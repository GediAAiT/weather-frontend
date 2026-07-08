import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Language } from '../../services/models';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <label class="lang">
      <span class="msr lang__icon" aria-hidden="true">translate</span>
      <select
        class="lang__select"
        [ngModel]="current"
        (ngModelChange)="changed.emit($event)"
        aria-label="Language">
        @for (l of languages; track l.code) {
          <option [value]="l.code">{{ l.name }}</option>
        }
      </select>
      <span class="msr lang__chev" aria-hidden="true">expand_more</span>
    </label>
  `,
  styles: [`
    .lang {
      position: relative;
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--md-sys-color-outline-variant);
      border-radius: var(--md-shape-full);
      background: var(--md-sys-color-surface-container-lowest);
      padding: 0 6px 0 12px;
      height: 44px;
      transition: box-shadow .3s var(--md-motion-standard), border-color .3s;
    }
    .lang:hover {
      box-shadow: var(--md-elev-1);
      border-color: var(--md-sys-color-outline);
    }
    .lang:focus-within {
      border-color: var(--md-sys-color-primary);
      box-shadow: 0 0 0 3px var(--md-sys-color-primary-container);
    }
    .lang__icon { font-size: 20px; color: var(--md-sys-color-primary); }
    .lang__chev {
      font-size: 20px;
      color: var(--md-sys-color-on-surface-variant);
      margin-left: -26px;
      pointer-events: none;
    }
    .lang__select {
      appearance: none;
      border: 0;
      background: transparent;
      color: var(--md-sys-color-on-surface);
      font: inherit;
      font-weight: 500;
      font-size: .92rem;
      padding: 0 32px 0 8px;
      height: 100%;
      cursor: pointer;
      outline: none;
    }
  `]
})
export class LanguageSwitcherComponent {
  @Input() languages: Language[] = [];
  @Input() current = 'en';
  @Output() changed = new EventEmitter<string>();
}
