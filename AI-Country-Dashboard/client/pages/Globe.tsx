import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useState } from "react";
import { AdditiveBlending, BackSide } from "three";
import { fetchTop15 } from "@/lib/countries";
import type { CountrySummary } from "@shared/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return {
    x: -radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

function TexturedEarth() {
  const colorMap = useTexture("https://unpkg.com/three-globe/example/img/earth-day.jpg");
  const bumpMap = useTexture("https://unpkg.com/three-globe/example/img/earth-topology.png");
  return (
    <mesh>
      <sphereGeometry args={[1, 128, 128]} />
      <meshStandardMaterial map={colorMap} bumpMap={bumpMap} bumpScale={0.05} roughness={0.85} metalness={0} emissive="#00eaff" emissiveIntensity={0.01} />
    </mesh>
  );
}

function NeonAtmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.06, 64, 64]} />
      <meshBasicMaterial color="#00eaff" transparent opacity={0.05} blending={AdditiveBlending} side={BackSide} />
    </mesh>
  );
}

export default function Globe() {
  const [countries, setCountries] = useState<CountrySummary[]>([]);
  const [active, setActive] = useState<CountrySummary | null>(null);

  useEffect(() => {
    fetchTop15().then(setCountries);
  }, []);

  const maxPop = useMemo(() => Math.max(...countries.map((c) => c.population || 0), 1), [countries]);

  return (
    <section className="container grid gap-6 py-10 lg:grid-cols-[1fr_380px]">
      <div className="rounded-lg border bg-card p-2">
        <Canvas camera={{ position: [0, 0, 2.2] }} style={{ height: 640 }}>
          <ambientLight intensity={0.5} color="#ffffff" />
          <pointLight position={[4, 4, 4]} intensity={0.25} color="#ff00e6" />
          <pointLight position={[-4, -2, 2]} intensity={0.15} color="#00eaff" />
          <Suspense fallback={null}>
            <TexturedEarth />
            <NeonAtmosphere />
          </Suspense>
          {countries.map((c) => {
            const [lat, lng] = c.latlng || [0, 0];
            const p = latLngToVector3(lat, lng, 1.02);
            const val = (c.population || 0) / maxPop;
            const size = 0.45 + val * 0.2;
            const isActive = active?.cca3 === c.cca3;
            return (
              <group key={c.cca3} position={[p.x, p.y, p.z]}>
                <Html sprite center distanceFactor={6}>
                  <button onClick={() => setActive(c)} style={{ background: "transparent", border: 0, padding: 0, cursor: "pointer" }}>
                    <svg viewBox="0 0 24 24" style={{ filter: "drop-shadow(0 0 3px rgba(0,234,255,0.5)) drop-shadow(0 0 1.5px rgba(255,0,230,0.3))" }} fill="#00eaff" stroke="#ff00e6" strokeWidth="1" width={11 * size} height={11 * size}>
                      <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10z" />
                      <circle cx="12" cy="11" r="2.4" fill="#001018" />
                    </svg>
                  </button>
                </Html>
              </group>
            );
          })}
          <OrbitControls enablePan={false} minDistance={1.5} maxDistance={6} />
        </Canvas>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Countries</CardTitle>
        </CardHeader>
        <CardContent>
          {!active ? (
            <ul className="mt-1 space-y-2 text-sm">
              {countries.map((c) => (
                <li key={c.cca3}>
                  <button className="text-left font-medium hover:text-primary" onClick={() => setActive(c)}>{c.name}</button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-md border p-3 text-sm">
              <div className="flex items-center gap-3">
                {active.flagPng ? <img src={active.flagPng} alt="flag" className="h-4 w-6 rounded object-cover" /> : null}
                <p className="font-semibold">{active.name}</p>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {active.capital && (
                  <div><p className="text-foreground/60">Capital</p><p className="font-medium">{active.capital}</p></div>
                )}
                {active.region && (
                  <div><p className="text-foreground/60">Region</p><p className="font-medium">{active.region}</p></div>
                )}
                {active.subregion && (
                  <div><p className="text-foreground/60">Subregion</p><p className="font-medium">{active.subregion}</p></div>
                )}
                {typeof active.population === "number" && (
                  <div><p className="text-foreground/60">Population</p><p className="font-medium">{active.population.toLocaleString()}</p></div>
                )}
                {typeof active.area === "number" && (
                  <div><p className="text-foreground/60">Area</p><p className="font-medium">{active.area.toLocaleString()} km²</p></div>
                )}
              </div>
              {active.currencies && (
                <div className="mt-2">
                  <p className="text-foreground/60">Currencies</p>
                  <p className="font-medium">{active.currencies.map((x) => `${x.name} (${x.code}${x.symbol ? ` • ${x.symbol}` : ""})`).join(", ")}</p>
                </div>
              )}
              <div className="mt-3">
                <button className="text-xs text-foreground/70 underline hover:text-primary" onClick={() => setActive(null)}>Back to list</button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
