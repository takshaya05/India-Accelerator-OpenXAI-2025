import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Globe2, Bot, BookOpenText, Gamepad2 } from "lucide-react";

export default function Index() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_60rem_at_top_right,theme(colors.accent/20),transparent_60%)]" />
        <div className="container py-16 md:py-24">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <Badge variant="secondary">Welcome</Badge>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">AI Country Dashboard</h1>
              <p className="mt-3 max-w-prose text-lg text-foreground/70">
                Explore every country with data-rich modules, a 3D globe, quizzes and an AI tutor. Learn geography,
                culture and economy the engaging way.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl border bg-gradient-to-br from-secondary to-background p-6 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <Feature to="/globe" icon={<Globe2 className="h-5 w-5 text-[#00eaff] flex" />} title="3D Globe" desc="Clickable countries, zoom & rotate." />
                <Feature to="/learning-hub" icon={<BookOpenText className="h-5 w-5 text-[#00eaff] flex" />} title="Learning Hub" desc="All countries as flash cards." />
                <Feature to="/chat-tutor" icon={<Bot className="h-5 w-5 text-[#00eaff] flex" />} title="AI Tutor" desc="Ask anything with Ollama." />
                <Feature to="/quiz-games" icon={<Gamepad2 className="h-5 w-5 text-[#00eaff] flex" />} title="Quiz & Games" desc="MCQs and flag matching." />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-gradient-to-b from-secondary to-background py-12">
        <div className="container">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-2xl font-bold tracking-tight">Start your journey</h2>
            <p className="mt-2 text-foreground/70">Jump into the interactive dashboard with one click.</p>
          </div>
          <div className="mx-auto mt-8 max-w-4xl">
            <Card className="group overflow-hidden border-muted/70 transition hover:shadow-xl">
              <CardContent className="p-8">
                <CardHeader className="p-0">
                  <CardTitle className="text-2xl text-center">Interactive Education Dashboard</CardTitle>
                </CardHeader>
                <p className="mt-2 text-foreground/70 mx-auto text-center">Access the 3D globe, learning modules, AI tutor, and quizzes in one place.</p>
                <Button asChild size="lg" className="mt-6 mx-auto">
                  <Link to="/dashboard">Enter Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

function Feature({ to, icon, title, desc }: { to: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link to={to} className="flex gap-3 rounded-[12px] border border-[#292c3d] bg-[#0b0d13] p-4 transition hover:shadow-md">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-[rgba(29,31,42,0.8)]">{icon}</div>
      <div className="flex flex-col">
        <p className="font-medium mr-auto">{title}</p>
        <p className="text-sm text-foreground/70 mx-auto">{desc}</p>
      </div>
    </Link>
  );
}
