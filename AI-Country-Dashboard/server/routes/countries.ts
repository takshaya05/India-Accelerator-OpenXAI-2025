import type { RequestHandler } from "express";
import type { CountrySummary, TopCountriesResponse } from "@shared/api";

interface RestCountry {
  name: { common: string };
  cca3: string;
  capital?: string[];
  region?: string;
  subregion?: string;
  population?: number;
  area?: number;
  latlng?: [number, number];
  flags?: { png?: string };
  currencies?: Record<string, { name: string; symbol?: string }>;
}

let allCache: { data: RestCountry[]; ts: number } | null = null;

export const getAll: RequestHandler = async (_req, res) => {
  try {
    if (allCache && Date.now() - allCache.ts < 1000 * 60 * 60) {
      res.json(allCache.data);
      return;
    }
    const r = await fetch("https://restcountries.com/v3.1/all?fields=name,cca3,region,subregion,capital,population,area,latlng,flags,currencies");
    if (!r.ok) throw new Error(`REST Countries ${r.status}`);
    const all = (await r.json()) as RestCountry[];
    allCache = { data: all, ts: Date.now() };
    res.json(all);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch all countries" });
  }
};

export const getTop15: RequestHandler = async (_req, res) => {
  try {
    const r = await fetch("https://restcountries.com/v3.1/all?fields=name,cca3,region,subregion,capital,population,area,latlng,flags,currencies");
    const all = (await r.json()) as RestCountry[];
    const processed: CountrySummary[] = all
      .map((c) => ({
        name: c.name.common,
        cca3: c.cca3,
        region: c.region,
        subregion: c.subregion,
        capital: c.capital?.[0],
        population: c.population,
        area: c.area,
        latlng: c.latlng,
        flagPng: c.flags?.png,
        currencies: c.currencies
          ? Object.entries(c.currencies).map(([code, cur]) => ({ code, name: cur.name, symbol: cur.symbol }))
          : undefined,
      }))
      .filter((c) => typeof c.population === "number" && Array.isArray(c.latlng));

    const top = processed
      .sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
      .slice(0, 15);

    const payload: TopCountriesResponse = { countries: top, metric: "population" };
    res.json(payload);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch countries" });
  }
};
