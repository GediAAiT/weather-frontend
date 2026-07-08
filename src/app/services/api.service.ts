import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Country,
  CountryExperience,
  CountryHighlight,
  CountryHighlightKind,
  CountryHighlightsResponse,
  CountryProfile,
  ForecastResponse,
  Language,
  LiveCountryHighlight,
  Weather,
  WeatherOverviewResponse
} from './models';

type ProfileSeed = Pick<CountryProfile, 'headline' | 'summary' | 'highlights'>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = environment.apiBaseUrl;
  private readonly weatherRequests = new Map<string, Observable<Weather>>();
  private readonly weatherValues = new Map<string, Weather>();
  private readonly profileRequests = new Map<string, Observable<CountryProfile>>();
  private readonly profileValues = new Map<string, CountryProfile>();
  private readonly overviewRequests = new Map<string, Observable<CountryExperience>>();

  private readonly profileSeeds: Record<string, ProfileSeed> = {
    AE: {
      headline: 'A skyline engineered for extremes',
      summary: 'The Emirates are known for record-setting towers, desert engineering, luxury coastlines, and oil-era infrastructure.',
      highlights: [
        { title: 'Burj Khalifa', description: 'The world-famous Dubai tower and the country skyline signal.', kind: 'building', icon: 'apartment' },
        { title: 'Palm Jumeirah', description: 'A landmark artificial island shaped into Dubai coastline.', kind: 'landmark', icon: 'waves' },
        { title: 'Arabian Desert', description: 'Dunes, wadis, and desert reserves define the natural backdrop.', kind: 'nature', icon: 'landscape' },
        { title: 'Oil and logistics', description: 'Energy, ports, aviation, and free-zone trade power the economy.', kind: 'resource', icon: 'local_shipping' }
      ]
    },
    AU: {
      headline: 'Reefs, iron country, and iconic harbors',
      summary: 'Australia is recognized for vast mineral wealth, unique ecosystems, coral reefs, and highly visible cultural landmarks.',
      highlights: [
        { title: 'Sydney Opera House', description: 'A globally recognized harbor landmark and performance venue.', kind: 'landmark', icon: 'theater_comedy' },
        { title: 'Great Barrier Reef', description: 'The world-renowned coral reef system off Queensland.', kind: 'nature', icon: 'scuba_diving' },
        { title: 'Uluru', description: 'A sacred sandstone monolith in the Northern Territory.', kind: 'nature', icon: 'terrain' },
        { title: 'Iron ore', description: 'A major export resource from Western Australia.', kind: 'resource', icon: 'deployed_code' }
      ]
    },
    BR: {
      headline: 'Rainforest scale and monumental city views',
      summary: 'Brazil is known for the Amazon, dramatic waterfalls, mineral wealth, football culture, and iconic coastal cities.',
      highlights: [
        { title: 'Christ the Redeemer', description: 'Rio de Janeiro landmark overlooking Guanabara Bay.', kind: 'landmark', icon: 'statue' },
        { title: 'Amazon Rainforest', description: 'One of Earth’s largest tropical rainforest systems.', kind: 'nature', icon: 'forest' },
        { title: 'Iguazu Falls', description: 'A huge waterfall system shared with Argentina.', kind: 'nature', icon: 'waterfall_chart' },
        { title: 'Iron ore and coffee', description: 'Two globally known Brazilian export strengths.', kind: 'resource', icon: 'coffee' }
      ]
    },
    CA: {
      headline: 'Freshwater, forests, and northern scale',
      summary: 'Canada is recognized for mountain parks, major freshwater systems, forests, energy resources, and tall urban landmarks.',
      highlights: [
        { title: 'CN Tower', description: 'Toronto’s signature tower and one of Canada’s best-known structures.', kind: 'building', icon: 'cell_tower' },
        { title: 'Rocky Mountains', description: 'Alpine parks, glaciers, lakes, and mountain rail corridors.', kind: 'nature', icon: 'filter_hdr' },
        { title: 'Niagara Falls', description: 'A famous waterfall system on the Canada-US border.', kind: 'nature', icon: 'waterfall_chart' },
        { title: 'Forests and freshwater', description: 'Large reserves of timber, lakes, rivers, and hydro power.', kind: 'resource', icon: 'water' }
      ]
    },
    CN: {
      headline: 'Ancient walls beside supertall skylines',
      summary: 'China is known for historic megastructures, dense high-rise cities, major rivers, manufacturing, and rare earth resources.',
      highlights: [
        { title: 'Great Wall', description: 'A vast historic defensive structure and national symbol.', kind: 'landmark', icon: 'fort' },
        { title: 'Shanghai Tower', description: 'One of the world’s tallest skyscrapers.', kind: 'building', icon: 'apartment' },
        { title: 'Yangtze River', description: 'A major river corridor for cities, transport, and energy.', kind: 'nature', icon: 'water' },
        { title: 'Rare earths', description: 'Strategic minerals used in electronics and clean-energy systems.', kind: 'resource', icon: 'memory' }
      ]
    },
    DE: {
      headline: 'Engineering culture and forested highlands',
      summary: 'Germany is known for industrial engineering, historic gates and castles, the Black Forest, and Alpine landscapes.',
      highlights: [
        { title: 'Brandenburg Gate', description: 'Berlin’s most recognized historic landmark.', kind: 'landmark', icon: 'account_balance' },
        { title: 'Zugspitze', description: 'Germany’s highest mountain peak in the Alps.', kind: 'nature', icon: 'filter_hdr' },
        { title: 'Black Forest', description: 'A famous wooded region with villages, trails, and craft culture.', kind: 'nature', icon: 'forest' },
        { title: 'Automotive engineering', description: 'A globally known industrial strength.', kind: 'culture', icon: 'directions_car' }
      ]
    },
    EG: {
      headline: 'Ancient stone, Nile water, desert routes',
      summary: 'Egypt is recognized for ancient monuments, Nile agriculture, desert landscapes, and the strategic Suez corridor.',
      highlights: [
        { title: 'Pyramids of Giza', description: 'Ancient monumental tombs near Cairo.', kind: 'landmark', icon: 'change_history' },
        { title: 'Nile River', description: 'The country’s defining river and agricultural lifeline.', kind: 'nature', icon: 'water' },
        { title: 'Suez Canal', description: 'A globally important shipping route linking seas.', kind: 'landmark', icon: 'directions_boat' },
        { title: 'Desert oases', description: 'Distinct landscapes across the Sahara and Western Desert.', kind: 'nature', icon: 'landscape' }
      ]
    },
    ET: {
      headline: 'Highlands, coffee origins, and ancient stone churches',
      summary: 'Ethiopia is known for highland terrain, coffee heritage, the Blue Nile, rock-hewn churches, and unique biodiversity.',
      highlights: [
        { title: 'Lalibela churches', description: 'Rock-hewn churches carved into volcanic stone.', kind: 'landmark', icon: 'church' },
        { title: 'Simien Mountains', description: 'High escarpments, rare wildlife, and dramatic trekking country.', kind: 'nature', icon: 'terrain' },
        { title: 'Blue Nile source region', description: 'A major Nile tributary begins around Lake Tana.', kind: 'nature', icon: 'water' },
        { title: 'Coffee heritage', description: 'Ethiopia is widely associated with coffee origins and varieties.', kind: 'resource', icon: 'coffee' }
      ]
    },
    FR: {
      headline: 'Monuments, mountains, museums, and wine regions',
      summary: 'France is known for instantly recognizable landmarks, Alpine nature, art institutions, food culture, and wine landscapes.',
      highlights: [
        { title: 'Eiffel Tower', description: 'Paris landmark and one of the world’s most recognizable structures.', kind: 'building', icon: 'cell_tower' },
        { title: 'Mont Blanc', description: 'The highest peak in the Alps region.', kind: 'nature', icon: 'filter_hdr' },
        { title: 'Louvre Museum', description: 'A major global art museum and historic palace complex.', kind: 'culture', icon: 'museum' },
        { title: 'Wine regions', description: 'Bordeaux, Burgundy, Champagne, and other famed landscapes.', kind: 'resource', icon: 'local_bar' }
      ]
    },
    GB: {
      headline: 'Historic institutions and modern vertical London',
      summary: 'The United Kingdom is recognized for royal and parliamentary landmarks, creative culture, coastal landscapes, and energy history.',
      highlights: [
        { title: 'Palace of Westminster', description: 'London’s historic parliament complex and clock tower skyline.', kind: 'landmark', icon: 'account_balance' },
        { title: 'The Shard', description: 'A signature modern skyscraper in London.', kind: 'building', icon: 'apartment' },
        { title: 'Lake District', description: 'A mountain and lake landscape known for walking and literature.', kind: 'nature', icon: 'landscape' },
        { title: 'North Sea energy', description: 'Oil, gas, and offshore wind shape the energy story.', kind: 'resource', icon: 'wind_power' }
      ]
    },
    IN: {
      headline: 'Sacred rivers, Himalayan edges, and monumental stone',
      summary: 'India is known for historic architecture, large river systems, Himalayan landscapes, spice regions, and technology hubs.',
      highlights: [
        { title: 'Taj Mahal', description: 'A famous marble mausoleum in Agra.', kind: 'landmark', icon: 'account_balance' },
        { title: 'Himalayas', description: 'High mountain regions across northern India.', kind: 'nature', icon: 'filter_hdr' },
        { title: 'Ganges River', description: 'A major river with deep cultural and agricultural importance.', kind: 'nature', icon: 'water' },
        { title: 'Spices and technology', description: 'A country known for both agricultural variety and IT services.', kind: 'resource', icon: 'developer_board' }
      ]
    },
    IT: {
      headline: 'Ancient urban icons and dramatic mountain edges',
      summary: 'Italy is known for Roman structures, Renaissance cities, volcanic landscapes, the Alps, marble, fashion, and food culture.',
      highlights: [
        { title: 'Colosseum', description: 'Rome’s ancient amphitheater and a global landmark.', kind: 'landmark', icon: 'stadium' },
        { title: 'Dolomites', description: 'Distinct Alpine peaks with dramatic stone faces.', kind: 'nature', icon: 'terrain' },
        { title: 'Venice canals', description: 'A unique lagoon city built around water routes.', kind: 'landmark', icon: 'directions_boat' },
        { title: 'Carrara marble', description: 'A famous stone resource used in sculpture and architecture.', kind: 'resource', icon: 'view_in_ar' }
      ]
    },
    JP: {
      headline: 'Volcanic beauty, temples, towers, and precision transit',
      summary: 'Japan is known for Mount Fuji, dense modern skylines, Shinkansen rail, temples, forests, and coastal engineering.',
      highlights: [
        { title: 'Mount Fuji', description: 'A famous volcanic peak and national symbol.', kind: 'nature', icon: 'filter_hdr' },
        { title: 'Tokyo Skytree', description: 'A major broadcasting tower and skyline marker.', kind: 'building', icon: 'cell_tower' },
        { title: 'Kyoto temples', description: 'Historic temple districts and preserved cultural landscapes.', kind: 'culture', icon: 'temple_buddhist' },
        { title: 'Shinkansen', description: 'High-speed rail recognized for precision and reliability.', kind: 'culture', icon: 'train' }
      ]
    },
    KE: {
      headline: 'Savannah wildlife, highland peaks, and Rift Valley energy',
      summary: 'Kenya is known for safari ecosystems, Mount Kenya, the Great Rift Valley, tea highlands, geothermal power, and Nairobi’s skyline.',
      highlights: [
        { title: 'Maasai Mara', description: 'World-famous savannah reserve known for wildlife migrations.', kind: 'nature', icon: 'pets' },
        { title: 'Mount Kenya', description: 'A major equatorial mountain and UNESCO-listed landscape.', kind: 'nature', icon: 'terrain' },
        { title: 'Great Rift Valley', description: 'Lakes, escarpments, geothermal fields, and volcanic terrain.', kind: 'nature', icon: 'landscape' },
        { title: 'Tea and geothermal', description: 'Highland agriculture and Rift Valley geothermal energy stand out.', kind: 'resource', icon: 'energy_savings_leaf' }
      ]
    },
    NL: {
      headline: 'Water engineering, canals, ports, and compact cities',
      summary: 'The Netherlands is known for canals, polders, wind and water engineering, Rotterdam’s port, and dense cycling cities.',
      highlights: [
        { title: 'Delta Works', description: 'A major flood-protection engineering system.', kind: 'landmark', icon: 'flood' },
        { title: 'Amsterdam canals', description: 'Historic canal rings and narrow waterfront architecture.', kind: 'landmark', icon: 'water' },
        { title: 'Rotterdam skyline', description: 'A modern high-rise port city skyline.', kind: 'building', icon: 'apartment' },
        { title: 'Water engineering', description: 'Polders, dikes, pumps, and coastal defense define the country.', kind: 'resource', icon: 'engineering' }
      ]
    },
    RU: {
      headline: 'Vast forests, deep lakes, and monumental city symbols',
      summary: 'Russia is known for enormous land scale, forests, energy resources, Lake Baikal, rail corridors, and historic architecture.',
      highlights: [
        { title: 'Saint Basil’s Cathedral', description: 'A colorful Moscow landmark on Red Square.', kind: 'landmark', icon: 'church' },
        { title: 'Lake Baikal', description: 'A very deep freshwater lake in Siberia.', kind: 'nature', icon: 'water' },
        { title: 'Trans-Siberian Railway', description: 'A famous long-distance rail route across Eurasia.', kind: 'landmark', icon: 'train' },
        { title: 'Gas and forests', description: 'Major natural gas reserves and vast boreal forest areas.', kind: 'resource', icon: 'forest' }
      ]
    },
    US: {
      headline: 'National parks, supertall skylines, and resource scale',
      summary: 'The United States is known for iconic city towers, national parks, technology regions, agriculture, energy, and varied landscapes.',
      highlights: [
        { title: 'One World Trade Center', description: 'A major New York skyscraper and skyline symbol.', kind: 'building', icon: 'apartment' },
        { title: 'Grand Canyon', description: 'A famous canyon carved by the Colorado River.', kind: 'nature', icon: 'terrain' },
        { title: 'Yellowstone', description: 'A landmark national park with geysers and wildlife.', kind: 'nature', icon: 'park' },
        { title: 'Technology and agriculture', description: 'Major technology hubs and large agricultural regions.', kind: 'resource', icon: 'hub' }
      ]
    },
    ZA: {
      headline: 'Mountain coastlines, wildlife reserves, and mineral depth',
      summary: 'South Africa is known for Table Mountain, wildlife parks, wine regions, gold and platinum resources, and distinctive city landscapes.',
      highlights: [
        { title: 'Table Mountain', description: 'Cape Town’s flat-topped mountain landmark.', kind: 'nature', icon: 'terrain' },
        { title: 'Kruger National Park', description: 'A major wildlife reserve with globally known safari routes.', kind: 'nature', icon: 'pets' },
        { title: 'Gold and platinum', description: 'Mineral resources that shaped industrial history.', kind: 'resource', icon: 'diamond' },
        { title: 'Cape Winelands', description: 'Mountain-backed vineyards and historic towns.', kind: 'culture', icon: 'local_bar' }
      ]
    }
  };

  constructor(private http: HttpClient) {}

  getCountries(continent?: string): Observable<Country[]> {
    let params = new HttpParams();
    if (continent) {
      params = params.set('continent', continent);
    }
    return this.http.get<Country[]>(`${this.base}/countries`, { params });
  }

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`${this.base}/meta/languages`);
  }

  getWeather(code: string, lang: string): Observable<Weather> {
    const key = this.cacheKey(code, lang);
    const cachedRequest = this.weatherRequests.get(key);
    if (cachedRequest) return cachedRequest;

    const params = new HttpParams().set('code', code).set('lang', lang);
    const request = this.http.get<Weather>(`${this.base}/weather`, { params }).pipe(
      tap((weather) => this.weatherValues.set(key, weather)),
      shareReplay({ bufferSize: 1, refCount: false })
    );
    this.weatherRequests.set(key, request);
    return request;
  }

  getCountryOverview(country: Country, lang: string): Observable<CountryExperience> {
    const key = this.cacheKey(country.code, lang);
    const cachedRequest = this.overviewRequests.get(key);
    if (cachedRequest) return cachedRequest;

    const params = new HttpParams().set('code', country.code).set('lang', lang);
    const fallbackProfile = this.getFallbackCountryProfile(country);
    const request = this.http.get<WeatherOverviewResponse>(`${this.base}/weather/overview`, { params }).pipe(
      map((overview) => {
        if (!overview.weather) {
          throw new Error(`Missing weather overview for ${country.code}`);
        }
        return {
          weather: overview.weather,
          profile: this.normalizeHighlightsProfile(country, overview.highlights)
        };
      }),
      tap(({ weather, profile }) => {
        this.weatherValues.set(key, weather);
        this.profileValues.set(key, profile);
      }),
      catchError(() => {
        this.overviewRequests.delete(key);
        return this.getWeather(country.code, lang).pipe(
          map((weather) => ({ weather, profile: fallbackProfile }))
        );
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

    this.overviewRequests.set(key, request);
    return request;
  }

  getWeatherByCity(q: string, lang: string): Observable<Weather> {
    const params = new HttpParams().set('q', q).set('lang', lang);
    return this.http.get<Weather>(`${this.base}/weather/city`, { params });
  }

  getWeatherByCoords(lat: number, lon: number, lang: string): Observable<Weather> {
    const params = new HttpParams().set('lat', lat).set('lon', lon).set('lang', lang);
    return this.http.get<Weather>(`${this.base}/weather/coords`, { params });
  }

  getForecast(code: string, days: number, lang: string): Observable<ForecastResponse> {
    const params = new HttpParams().set('code', code).set('days', days).set('lang', lang);
    return this.http.get<ForecastResponse>(`${this.base}/weather/forecast`, { params });
  }

  getWeatherBatch(codes: string[], lang: string): Observable<Weather[]> {
    const params = new HttpParams().set('codes', codes.join(',')).set('lang', lang);
    return this.http.get<Weather[]>(`${this.base}/weather/batch`, { params });
  }

  getCountryProfile(country: Country, lang: string): Observable<CountryProfile> {
    const key = this.cacheKey(country.code, lang);
    const cachedRequest = this.profileRequests.get(key);
    if (cachedRequest) return cachedRequest;

    const params = new HttpParams().set('lang', lang);
    const fallback = this.getFallbackCountryProfile(country);
    const request = this.http.get<CountryHighlightsResponse>(`${this.base}/countries/${country.code}/highlights`, { params }).pipe(
      map((profile) => this.normalizeHighlightsProfile(country, profile)),
      tap((profile) => this.profileValues.set(key, profile)),
      catchError(() => {
        this.profileRequests.delete(key);
        return of(fallback);
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );
    this.profileRequests.set(key, request);
    return request;
  }

  getCachedWeather(code: string, lang: string): Weather | null {
    return this.weatherValues.get(this.cacheKey(code, lang)) ?? null;
  }

  getCachedCountryProfile(code: string, lang: string): CountryProfile | null {
    return this.profileValues.get(this.cacheKey(code, lang)) ?? null;
  }

  rememberWeather(weather: Weather): void {
    this.weatherValues.set(this.cacheKey(weather.countryCode, weather.language), weather);
  }

  getFallbackCountryProfile(country: Country): CountryProfile {
    const seed = this.profileSeeds[country.code] ?? this.genericProfileSeed(country);
    return {
      countryCode: country.code,
      countryName: country.name,
      headline: seed.headline,
      summary: seed.summary,
      source: 'fallback',
      highlights: seed.highlights
    };
  }

  private normalizeHighlightsProfile(country: Country, profile: CountryHighlightsResponse | undefined): CountryProfile {
    const fallback = this.getFallbackCountryProfile(country);
    const liveHighlights = Array.isArray(profile?.highlights) && profile.highlights.length
      ? profile.highlights
          .map((item) => this.normalizeHighlight(item))
          .filter((item): item is CountryHighlight => Boolean(item))
      : [];

    const countryName = profile?.countryName || country.name;
    const hasLiveHighlights = liveHighlights.length > 0;
    const highlights = hasLiveHighlights ? liveHighlights : fallback.highlights;

    return {
      countryCode: profile?.countryCode || country.code,
      countryName,
      headline: hasLiveHighlights
        ? `${countryName}'s most recognized places and features`
        : fallback.headline,
      summary: hasLiveHighlights
        ? `${countryName} is shown with live highlights from the backend, including notable buildings, natural features, resources, landmarks, and unique places.`
        : fallback.summary,
      source: hasLiveHighlights ? 'backend' : 'fallback',
      highlights
    };
  }

  private normalizeHighlight(item: LiveCountryHighlight): CountryHighlight | null {
    const title = item?.title?.trim();
    if (!title) return null;

    const category = item.category?.trim();
    const kind = this.kindForCategory(category);
    return {
      title,
      description: item.description?.trim() || `${title} is a recognized ${category || 'feature'} associated with this country.`,
      kind,
      category,
      imageUrl: item.imageUrl,
      sourceUrl: item.sourceUrl,
      icon: this.iconForKind(kind, category)
    };
  }

  private kindForCategory(category: string | undefined): CountryHighlightKind {
    const value = (category ?? '').toLowerCase();
    if (/(skyscraper|tower|building|structure|castle|palace|bridge|stadium)/.test(value)) {
      return 'building';
    }
    if (/(mountain|waterfall|lake|river|park|island|forest|desert|reef|volcano|canyon|natural)/.test(value)) {
      return 'nature';
    }
    if (/(resource|mine|mineral|oil|gas|coal|field|reservoir)/.test(value)) {
      return 'resource';
    }
    if (/(museum|temple|church|cathedral|mosque|festival|culture|heritage|archaeological)/.test(value)) {
      return 'culture';
    }
    return 'landmark';
  }

  private iconForKind(kind: CountryHighlightKind, category: string | undefined): string {
    const value = (category ?? '').toLowerCase();
    if (/skyscraper|tower/.test(value)) return 'cell_tower';
    if (/building|palace|castle/.test(value)) return 'apartment';
    if (/mountain|volcano|canyon/.test(value)) return 'terrain';
    if (/waterfall/.test(value)) return 'waterfall_chart';
    if (/lake|river|reef|island/.test(value)) return 'water';
    if (/park|forest/.test(value)) return 'forest';
    if (/resource|mine|mineral/.test(value)) return 'diamond';
    if (/oil|gas|coal/.test(value)) return 'local_gas_station';
    if (/temple/.test(value)) return 'temple_buddhist';
    if (/church|cathedral|mosque/.test(value)) return 'church';
    if (/museum/.test(value)) return 'museum';

    switch (kind) {
      case 'building': return 'apartment';
      case 'nature': return 'landscape';
      case 'resource': return 'diamond';
      case 'culture': return 'museum';
      default: return 'travel_explore';
    }
  }

  private genericProfileSeed(country: Country): ProfileSeed {
    return {
      headline: `${country.name} at a glance`,
      summary: `${country.name} is in ${country.continent}, with ${country.capital} as its capital. Add a backend country profile to show live landmarks, resources, nature, and unique national features.`,
      highlights: [
        { title: country.capital, description: 'Capital city and primary weather location for this selection.', kind: 'landmark', icon: 'location_city' },
        { title: country.continent, description: 'Regional context for landscape, climate, and travel identity.', kind: 'nature', icon: 'public' },
        { title: 'Country coordinates', description: `${country.latitude.toFixed(2)}, ${country.longitude.toFixed(2)} are used for live weather lookup.`, kind: 'resource', icon: 'explore' }
      ]
    };
  }

  private cacheKey(code: string, lang: string): string {
    return `${lang}:${code}`;
  }
}
