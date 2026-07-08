import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './services/api.service';
import { Country, CountryProfile, Language, Weather } from './services/models';
import { WeatherCardComponent } from './components/weather-card/weather-card.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { CountrySelectorComponent } from './components/country-selector/country-selector.component';
import { WeatherCategory, WeatherIconComponent, weatherCategory } from './components/weather-icon/weather-icon.component';
import { CountryProfileComponent } from './components/country-profile/country-profile.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    WeatherCardComponent,
    LanguageSwitcherComponent,
    CountrySelectorComponent,
    WeatherIconComponent,
    CountryProfileComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly spotlightCodes = ['KE', 'JP', 'IS', 'BR', 'AE', 'ZA'];
  private selectionToken = 0;
  private weatherSubscription: Subscription | null = null;
  private profileSubscription: Subscription | null = null;

  countries: Country[] = [];
  languages: Language[] = [];
  currentLang = 'en';

  weather: Weather | null = null;
  profile: CountryProfile | null = null;
  selected: Country | null = null;
  spotlight: Weather[] = [];

  loading = false;
  error = false;

  constructor(private api: ApiService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.setFallbackLang('en');
    this.translate.use(this.currentLang);
    document.documentElement.lang = this.currentLang;

    this.api.getCountries().subscribe({
      next: (c) => {
        this.countries = c;
        this.loadSpotlight();
      },
      error: () => (this.error = true)
    });

    this.api.getLanguages().subscribe({
      next: (l) => (this.languages = l),
      // Fallback list if the backend meta call fails for any reason.
      error: () =>
        (this.languages = [
          { code: 'en', name: 'English' },
          { code: 'fr', name: 'Français' },
          { code: 'es', name: 'Español' },
          { code: 'nl', name: 'Nederlands' },
          { code: 'de', name: 'Deutsch' },
          { code: 'it', name: 'Italiano' },
          { code: 'ru', name: 'Русский' },
          { code: 'am', name: 'አማርኛ' }
        ])
    });
  }

  ngOnDestroy(): void {
    this.weatherSubscription?.unsubscribe();
    this.profileSubscription?.unsubscribe();
  }

  onLanguageChange(lang: string): void {
    this.currentLang = lang;
    this.translate.use(lang);
    document.documentElement.lang = lang;

    const selectedCountry = this.selected ?? this.findCountry(this.weather?.countryCode);
    if (selectedCountry) {
      this.loadCountryExperience(selectedCountry);
    }
    this.loadSpotlight();
  }

  onCountrySelected(country: Country): void {
    this.loadCountryExperience(country);
  }

  onSpotlightSelected(weather: Weather): void {
    this.api.rememberWeather(weather);
    const country = this.findCountry(weather.countryCode);
    if (country) {
      this.loadCountryExperience(country, weather);
    } else {
      this.weather = weather;
      this.loading = false;
      this.error = false;
    }
  }

  categoryFor(weather: Weather): WeatherCategory {
    return weatherCategory(weather.conditionKey, weather.isDay);
  }

  flagFor(code: string | undefined): string {
    const countryCode = (code ?? '').toUpperCase();
    if (!/^[A-Z]{2}$/.test(countryCode)) return '';
    return String.fromCodePoint(...[...countryCode].map(c => 127397 + c.charCodeAt(0)));
  }

  get themeClass(): string {
    if (!this.weather) return 'theme-default';
    return `theme-${weatherCategory(this.weather.conditionKey, this.weather.isDay)}`;
  }

  get activeCountryCode(): string {
    return this.weather?.countryCode ?? this.selected?.code ?? '';
  }

  private loadCountryExperience(country: Country, immediateWeather: Weather | null = null): void {
    const token = ++this.selectionToken;
    const cachedWeather = immediateWeather ?? this.api.getCachedWeather(country.code, this.currentLang);
    const cachedProfile = this.api.getCachedCountryProfile(country.code, this.currentLang);

    this.selected = country;
    this.profile = cachedProfile ?? this.api.getFallbackCountryProfile(country);
    this.weather = cachedWeather;
    this.loading = !cachedWeather;
    this.error = false;

    this.loadProfile(country, token);
    this.loadWeather(country, token, Boolean(cachedWeather));
  }

  private loadWeather(country: Country, token: number, hasImmediateWeather: boolean): void {
    this.weatherSubscription?.unsubscribe();
    this.weatherSubscription = this.api.getWeather(country.code, this.currentLang).subscribe({
      next: (w) => {
        if (!this.isCurrentSelection(country, token)) return;
        this.weather = w;
        this.loading = false;
      },
      error: () => {
        if (!this.isCurrentSelection(country, token)) return;
        this.error = true;
        this.loading = false;
        if (!hasImmediateWeather) {
          this.weather = null;
        }
      }
    });
  }

  private loadProfile(country: Country, token: number): void {
    this.profileSubscription?.unsubscribe();
    this.profileSubscription = this.api.getCountryProfile(country, this.currentLang).subscribe((profile) => {
      if (!this.isCurrentSelection(country, token)) return;
      this.profile = profile;
    });
  }

  private loadSpotlight(): void {
    if (!this.countries.length) return;

    const availableCodes = new Set(this.countries.map(country => country.code));
    const preferred = this.spotlightCodes.filter(code => availableCodes.has(code));
    const codes = (preferred.length ? preferred : this.countries.slice(0, 6).map(country => country.code)).slice(0, 6);

    if (!codes.length) return;

    this.api.getWeatherBatch(codes, this.currentLang)
      .pipe(catchError(() => of([] as Weather[])))
      .subscribe((weather) => {
        this.spotlight = weather;
      });
  }

  private findCountry(code: string | undefined): Country | null {
    if (!code) return null;
    return this.countries.find(country => country.code === code) ?? null;
  }

  private isCurrentSelection(country: Country, token: number): boolean {
    return token === this.selectionToken && this.selected?.code === country.code;
  }
}
