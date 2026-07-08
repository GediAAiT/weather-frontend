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
  sourceUrl?: string;
  category?: string;
}

export interface CountryProfile {
  countryCode: string;
  countryName: string;
  headline: string;
  summary: string;
  source: 'backend' | 'fallback';
  highlights: CountryHighlight[];
}

export interface LiveCountryHighlight {
  title?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  sourceUrl?: string;
  wikidataId?: string;
}

export interface CountryHighlightsResponse {
  countryName?: string;
  countryCode?: string;
  source?: string;
  retrievedAt?: string;
  live?: boolean;
  highlights?: LiveCountryHighlight[];
}

export interface CountryExperience {
  weather: Weather;
  profile: CountryProfile;
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

export interface WeatherOverviewResponse {
  weather?: Weather;
  highlights?: CountryHighlightsResponse;
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
