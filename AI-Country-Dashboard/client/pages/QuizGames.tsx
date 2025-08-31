import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchTop15 } from "@/lib/countries";
import type { CountrySummary } from "@shared/api";

export default function QuizGames() {
  const [countries, setCountries] = useState<CountrySummary[]>([]);
  useEffect(() => { fetchTop15().then(setCountries); }, []);

  return (
    <section className="container py-10">
      <Tabs defaultValue="quiz">
        <TabsList>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="games">Games</TabsTrigger>
        </TabsList>
        <TabsContent value="quiz">
          <CountryQuiz countries={countries} />
        </TabsContent>
        <TabsContent value="games">
          <Games countries={countries} />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function CountryQuiz({ countries }: { countries: CountrySummary[] }) {
  const [sel, setSel] = useState<string>("");
  const country = useMemo(() => countries.find((c) => c.cca3 === sel) || null, [countries, sel]);
  const qs = useMemo(() => (country ? buildCountryQuestions(country, countries, 5) : []), [country, countries]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => { setIndex(0); setScore(0); }, [sel]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Country Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <select className="h-10 rounded-md border bg-background px-3 text-sm" value={sel} onChange={(e) => setSel(e.target.value)}>
            <option value="">Select a country module…</option>
            {countries.map((c) => (
              <option key={c.cca3} value={c.cca3}>{c.name}</option>
            ))}
          </select>
          {sel && <span className="text-sm text-foreground/70">5 questions • 1 mark each</span>}
        </div>
        {!country ? (
          <p className="text-sm text-foreground/70">Choose a country to begin.</p>
        ) : index >= qs.length ? (
          <div>
            <p className="mb-2 font-medium">Completed!</p>
            <p className="mb-4">Score: {score} / {qs.length}</p>
            <Button onClick={() => { setIndex(0); setScore(0); }}>Restart</Button>
          </div>
        ) : (
          <div>
            <p className="mb-4 font-medium">{qs[index].prompt}</p>
            <div className="grid gap-2 md:grid-cols-2">
              {qs[index].options.map((o) => (
                <Button key={o} variant="secondary" onClick={() => { if (o === qs[index].answer) setScore((s) => s + 1); setIndex((i) => i + 1); }}>{o}</Button>
              ))}
            </div>
            <p className="mt-3 text-xs text-foreground/70">Question {index + 1} / {qs.length}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function buildCountryQuestions(c: CountrySummary, pool: CountrySummary[], count: number) {
  const qs: { prompt: string; options: string[]; answer: string }[] = [];
  const others = pool.filter((x) => x.cca3 !== c.cca3);

  function add(question: { prompt: string; options: string[]; answer: string }) {
    if (qs.length >= count) return;
    const finalOptions = buildOptions(question.options, question.answer);
    qs.push({ ...question, options: finalOptions });
  }

  if (c.capital) add({ prompt: `What is the capital of ${c.name}?`, options: [c.capital, ...shuffle(others.map((o) => o.capital || "Unknown"))], answer: c.capital });
  add({ prompt: `Which continent is ${c.name} in?`, options: [c.region || "Unknown", ...shuffle(["Asia", "Africa", "Americas", "Europe", "Oceania"]).filter((x) => x !== (c.region || "Unknown"))], answer: c.region || "Unknown" });
  if (c.currencies?.[0]) add({ prompt: `Which currency code is used in ${c.name}?`, options: [c.currencies[0].code, ...shuffle(others.flatMap((o) => o.currencies?.[0]?.code ? [o.currencies![0].code] : []) )], answer: c.currencies[0].code });

  const popBracket = bracket(c.population || 0, [100_000_000, 200_000_000, 400_000_000]);
  add({ prompt: `Approximate population of ${c.name}?`, options: [popBracket, "> 400M", "100M – 200M", "< 100M"], answer: popBracket });

  if (c.area) {
    const areaBracket = bracket(c.area, [500_000, 1_500_000, 5_000_000], ["< 0.5M km²", "0.5M – 1.5M km²", "1.5M – 5M km²", "> 5M km²"]);
    add({ prompt: `Approximate area of ${c.name}?`, options: [areaBracket, "< 0.5M km²", "0.5M – 1.5M km²", "> 5M km²"], answer: areaBracket });
  }

  // Fill remaining with variations if needed
  while (qs.length < count) {
    if (c.capital) add({ prompt: `Which country has the capital city ${c.capital}?`, options: [c.name, ...shuffle(others.map((o) => o.name))], answer: c.name });
    else add({ prompt: `Select ${c.name}'s continent`, options: [c.region || "Unknown", ...shuffle(["Asia", "Africa", "Americas", "Europe", "Oceania"]).filter((x) => x !== (c.region || "Unknown"))], answer: c.region || "Unknown" });
  }

  return qs.slice(0, count);
}

function bracket(value: number, steps: number[], labels = ["< 100M", "100M – 200M", "200M – 400M", "> 400M"]) {
  if (value < steps[0]) return labels[0];
  if (value < steps[1]) return labels[1];
  if (value < steps[2]) return labels[2];
  return labels[3];
}

function buildOptions(opts: string[], answer: string) {
  const cleaned = [...new Set((opts || []).filter(Boolean))];
  const wrongs = cleaned.filter((o) => o !== answer);
  const pick = (arr: string[], n: number) => {
    const a = [...new Set(arr.filter(Boolean))];
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a.slice(0, n);
  };
  let sampled = pick(wrongs, 3);
  while (sampled.length < 3) {
    const filler = "Unknown";
    if (filler !== answer && !sampled.includes(filler)) sampled.push(filler); else break;
  }
  const final = [answer, ...sampled].slice(0, 4);
  return shuffle(final);
}

function Games({ countries }: { countries: CountrySummary[] }) {
  return (
    <Tabs defaultValue="match">
      <TabsList>
        <TabsTrigger value="match">Match</TabsTrigger>
        <TabsTrigger value="missing">Missing Letters</TabsTrigger>
      </TabsList>
      <TabsContent value="match">
        <MatchCapitals countries={countries} />
      </TabsContent>
      <TabsContent value="missing">
        <MissingLetters countries={countries} />
      </TabsContent>
    </Tabs>
  );
}

function MatchCapitals({ countries }: { countries: CountrySummary[] }) {
  const [pairs, setPairs] = useState(() => shuffle(countries).slice(0, 6));
  const [selLeft, setSelLeft] = useState<string | null>(null);
  const [selRight, setSelRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selLeft && selRight) {
      const c = pairs.find((p) => p.cca3 === selLeft);
      const isCorrect = c && c.capital === selRight;
      if (isCorrect && c) setMatched((m) => ({ ...m, [c.cca3]: true }));
      setSelLeft(null);
      setSelRight(null);
    }
  }, [selLeft, selRight, pairs]);

  function reset() {
    setPairs(shuffle(countries).slice(0, 6));
    setMatched({});
    setSelLeft(null);
    setSelRight(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match countries with their capitals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            {pairs.map((c) => (
              <button key={c.cca3} className={`flex w-full items-center gap-2 rounded-md border p-2 ${selLeft === c.cca3 ? "ring-2 ring-primary" : ""} ${matched[c.cca3] ? "opacity-50" : ""}`} onClick={() => !matched[c.cca3] && setSelLeft(c.cca3)}>
                <span className="text-sm">{c.name}</span>
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {shuffle(pairs.map((c) => c.capital || "Unknown")).map((cap) => (
              <button key={cap} className={`flex w-full items-center justify-between rounded-md border p-2 text-sm ${selRight === cap ? "ring-2 ring-primary" : ""}`} onClick={() => setSelRight(cap)}>
                <span>{cap}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={reset} variant="secondary">New Round</Button>
          <span className="text-sm text-foreground/70">Matched: {Object.values(matched).filter(Boolean).length} / {pairs.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function MissingLetters({ countries }: { countries: CountrySummary[] }) {
  const [round, setRound] = useState(0);
  const pool = useMemo(() => shuffle(countries).slice(0, 8), [countries]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const target = pool[round];

  if (!target) return (
    <Card><CardHeader><CardTitle>Game Complete</CardTitle></CardHeader><CardContent><p className="mb-3">Score: {score}/{pool.length}</p><Button onClick={() => { setRound(0); setScore(0); }}>Restart</Button></CardContent></Card>
  );

  const masked = (target.name || "").replace(/[A-Z]/gi, (ch, idx) => (idx % 2 === 0 ? "_" : ch));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guess the Country</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-lg font-semibold tracking-widest">{masked}</p>
        <div className="flex gap-2">
          <input className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm" placeholder="Type country name" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
          <Button onClick={submit}>Submit</Button>
        </div>
        <p className="mt-2 text-xs text-foreground/70">Round {round + 1} / {pool.length}</p>
      </CardContent>
    </Card>
  );

  function submit() {
    if (input.trim().toLowerCase() === (target.name || "").toLowerCase()) setScore((s) => s + 1);
    setInput("");
    setRound((r) => r + 1);
  }
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
