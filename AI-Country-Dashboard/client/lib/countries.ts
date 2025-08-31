import type { CountrySummary, TopCountriesResponse } from "@shared/api";
import { TOP15_POPULOUS } from "@shared/top15";

export async function fetchTop15(): Promise<CountrySummary[]> {
  // Prefer external REST Countries first (works on any host), then same-origin /api, then static fallback
  try {
    const all = await safeFetchJson<any[]>(
      "https://restcountries.com/v3.1/all?fields=name,cca3,region,subregion,capital,population,area,latlng,flags,currencies"
    );
    if (Array.isArray(all)) {
      const processed: CountrySummary[] = all
        .map((c) => ({
          name: c?.name?.common,
          cca3: c?.cca3,
          region: c?.region,
          subregion: c?.subregion,
          capital: c?.capital?.[0],
          population: c?.population,
          area: c?.area,
          latlng: c?.latlng,
          flagPng: c?.flags?.png,
          currencies: c?.currencies
            ? Object.entries(c.currencies).map(([code, cur]: any) => ({ code, name: cur.name, symbol: cur.symbol }))
            : undefined,
        }))
        .filter((c) => c.name && typeof c.population === "number" && Array.isArray(c.latlng));
      return processed.sort((a, b) => (b.population ?? 0) - (a.population ?? 0)).slice(0, 15);
    }
  } catch {}
  try {
    const data = await safeFetchJson<TopCountriesResponse>("/api/countries/top15");
    if (data?.countries?.length) return data.countries;
  } catch {}
  return TOP15_POPULOUS;
}

async function safeFetchJson<T>(url: string, timeoutMs = 5000): Promise<T | null> {
  try {
    const c = new AbortController();
    const id = setTimeout(() => c.abort(), timeoutMs);
    const r = await fetch(url, { cache: "no-store", signal: c.signal });
    clearTimeout(id);
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

export function density(c: CountrySummary) {
  return c.population && c.area ? c.population / c.area : undefined;
}
