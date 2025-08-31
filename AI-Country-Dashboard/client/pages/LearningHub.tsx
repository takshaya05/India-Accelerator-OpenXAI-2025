import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TOP15_POPULOUS } from "@shared/top15";

interface Country {
  name: { common: string; official: string };
  cca2: string;
  cca3: string;
  flags: { svg?: string; png?: string; alt?: string };
  coatOfArms?: { svg?: string; png?: string };
  capital?: string[];
  region?: string;
  subregion?: string;
  languages?: Record<string, string>;
  borders?: string[];
  area?: number;
  population?: number;
  latlng?: [number, number];
  maps?: { googleMaps?: string; openStreetMaps?: string };
  currencies?: Record<string, { name: string; symbol?: string }>;
  timezones?: string[];
  car?: { side?: string };
  demonyms?: Record<string, { f: string; m: string }>;
  continents?: string[];
}

export default function LearningHub() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [selected, setSelected] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);

  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        let data: unknown = null;
        try {
          const res1 = await fetch("/api/countries/all", { signal: controller.signal, cache: "no-store" });
          if (res1.ok) data = await res1.json();
        } catch {}
        if (!Array.isArray(data)) {
          try {
            const res2 = await fetch("https://restcountries.com/v3.1/all", { signal: controller.signal, cache: "no-store" });
            if (res2.ok) data = await res2.json();
          } catch {}
        }
        let arr: Country[] | null = null;
        if (Array.isArray(data)) {
          arr = data as Country[];
        } else {
          arr = TOP15_POPULOUS.map((c) => ({
            name: { common: c.name, official: c.name },
            cca2: c.cca3.slice(0, 2),
            cca3: c.cca3,
            flags: { png: c.flagPng, svg: c.flagPng },
            capital: c.capital ? [c.capital] : [],
            region: c.region,
            subregion: c.subregion,
            languages: undefined,
            borders: [],
            area: c.area,
            population: c.population,
            latlng: c.latlng,
            maps: {},
            currencies: c.currencies?.reduce<Record<string, { name: string; symbol?: string }>>((acc, x) => {
              acc[x.code] = { name: x.name, symbol: x.symbol };
              return acc;
            }, {}),
            timezones: [],
            car: undefined,
            demonyms: undefined,
            continents: [c.region || ""],
          } as Country));
        }
        arr.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(arr);
      } catch (e) {
        if ((e as any)?.name !== "AbortError") console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, []);

  const regions = useMemo(() => {
    const r = new Set<string>(["All"]);
    countries.forEach((c) => c.region && r.add(c.region));
    return Array.from(r);
  }, [countries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return countries.filter((c) => {
      const matchesQuery = !q || c.name.common.toLowerCase().includes(q);
      const matchesRegion = region === "All" || c.region === region;
      return matchesQuery && matchesRegion;
    });
  }, [countries, query, region]);

  return (
    <section className="py-10">
      <div className="container">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Learning Hub</h1>
            <p className="mt-1 text-foreground/70">Explore all countries as flash cards. Click for detailed modules.</p>
          </div>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
            <Input
              placeholder="Search countries..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="md:w-72"
            />
            <select
              className="h-10 rounded-md border bg-background px-3 text-sm"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-foreground/70">Loading countries…</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((c) => (
              <Card
                key={c.cca3}
                className="group cursor-pointer overflow-hidden border-muted/70 transition hover:shadow-lg"
                onClick={() => setSelected(c)}
              >
                <CardHeader className="p-0">
                  {c.flags?.svg || c.flags?.png ? (
                    <img
                      src={c.flags.svg || c.flags.png}
                      alt={c.flags.alt || `${c.name.common} flag`}
                      className="h-28 w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </CardHeader>
                <CardContent className="p-3">
                  <CardTitle className="text-base">{c.name.common}</CardTitle>
                  <div className="mt-2 flex items-center gap-2">
                    {c.region ? <Badge variant="secondary">{c.region}</Badge> : null}
                    {c.capital?.[0] ? (
                      <span className="truncate text-xs text-foreground/60">Capital: {c.capital[0]}</span>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="max-w-3xl">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    {selected.flags?.png ? (
                      <img src={selected.flags.png} alt="flag" className="h-5 w-8 rounded object-cover" />
                    ) : null}
                    {selected.name.common}
                    {selected.continents?.[0] ? (
                      <Badge variant="secondary" className="ml-1">
                        {selected.continents[0]}
                      </Badge>
                    ) : null}
                  </DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="geography" className="mt-2">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="geography">Geography</TabsTrigger>
                    <TabsTrigger value="economy">Economy & Trade</TabsTrigger>
                    <TabsTrigger value="affairs">Current Affairs</TabsTrigger>
                  </TabsList>
                  <TabsContent value="geography" className="space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
                      {selected.capital?.[0] && (
                        <div>
                          <p className="text-foreground/60">Capital</p>
                          <p className="font-medium">{selected.capital[0]}</p>
                        </div>
                      )}
                      {selected.region && (
                        <div>
                          <p className="text-foreground/60">Region</p>
                          <p className="font-medium">{selected.region}</p>
                        </div>
                      )}
                      {selected.subregion && (
                        <div>
                          <p className="text-foreground/60">Subregion</p>
                          <p className="font-medium">{selected.subregion}</p>
                        </div>
                      )}
                      {selected.area && (
                        <div>
                          <p className="text-foreground/60">Area</p>
                          <p className="font-medium">{selected.area.toLocaleString()} km²</p>
                        </div>
                      )}
                      {selected.population && (
                        <div>
                          <p className="text-foreground/60">Population</p>
                          <p className="font-medium">{selected.population.toLocaleString()}</p>
                        </div>
                      )}
                      {selected.latlng && (
                        <div>
                          <p className="text-foreground/60">Coordinates</p>
                          <p className="font-medium">{selected.latlng[0]}, {selected.latlng[1]}</p>
                        </div>
                      )}
                    </div>
                    {selected.maps?.googleMaps && (
                      <Button asChild variant="secondary" size="sm">
                        <a href={selected.maps.googleMaps} target="_blank" rel="noreferrer">
                          View on Google Maps
                        </a>
                      </Button>
                    )}
                  </TabsContent>
                  <TabsContent value="economy" className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      {selected.currencies && (
                        <div className="col-span-2 md:col-span-1">
                          <p className="text-foreground/60">Currencies</p>
                          <p className="font-medium">
                            {Object.entries(selected.currencies)
                              .map(([code, cur]) => `${cur.name} (${code}${cur.symbol ? ` • ${cur.symbol}` : ""})`)
                              .join(", ")}
                          </p>
                        </div>
                      )}
                      {selected.borders && selected.borders.length > 0 && (
                        <div className="col-span-2">
                          <p className="text-foreground/60">Borders</p>
                          <p className="font-medium">{selected.borders.join(", ")}</p>
                        </div>
                      )}
                      {selected.car?.side && (
                        <div>
                          <p className="text-foreground/60">Driving Side</p>
                          <p className="font-medium capitalize">{selected.car.side}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="affairs" className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      {selected.timezones && (
                        <div className="col-span-2">
                          <p className="text-foreground/60">Timezones</p>
                          <p className="font-medium">{selected.timezones.join(", ")}</p>
                        </div>
                      )}
                      <div className="col-span-2">
                        <p className="text-foreground/60">More Info</p>
                        <a
                          className="font-medium text-primary underline underline-offset-4"
                          href={`https://en.wikipedia.org/wiki/${encodeURIComponent(selected.name.common)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Wikipedia: {selected.name.common}
                        </a>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
