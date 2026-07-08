export interface Country {
  name: string;
  code: string;
  capital: string;
  latitude: number;
  longitude: number;
  continent: string;
}

export type CountryHighlightKind = 'building' | 'landmark' | 'nature' | 'resource' | 'culture';

export interface CountryHighlight {
  title: string;
  description: string;
  kind: CountryHighlightKind;
  icon?: string;
  imageUrl?: string;
}

export interface CountryProfile {
  countryCode: string;
  countryName: string;
  headline: string;
  summary: string;
  source: 'backend' | 'fallback';
  highlights: CountryHighlight[];
}

export interface Weather {
  countryName: string;
  countryCode: string;
  capital: string;
  latitude: number;
  longitude: number;
  temperature: number;
  apparentTemperature: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  precipitation: number;
  isDay: boolean;
  weatherCode: number;
  conditionKey: string;
  condition: string;
  language: string;
  time: string;
}

export interface DailyForecast {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
  windSpeedMax: number;
  weatherCode: number;
  conditionKey: string;
  condition: string;
}

export interface ForecastResponse {
  countryName: string;
  countryCode: string;
  capital: string;
  latitude: number;
  longitude: number;
  language: string;
  days: DailyForecast[];
}

export interface Language {
  code: string;
  name: string;
}
