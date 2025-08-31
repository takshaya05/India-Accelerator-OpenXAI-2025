import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe2, BookOpenText, Bot, Gamepad2 } from "lucide-react";

const features = [
  {
    title: "3D Globe Simulator",
    to: "/globe",
    icon: Globe2,
    desc: "Explore the world with interactive zoom, rotation, and country insights.",
    badge: "Interactive",
  },
  {
    title: "Learning Hub",
    to: "/learning-hub",
    icon: BookOpenText,
    desc: "Country modules with flash cards covering geography, culture, economy, and more.",
    badge: "All Countries",
  },
  {
    title: "AI Chat Tutor",
    to: "/chat-tutor",
    icon: Bot,
    desc: "Ask anything about countries. Powered by an Ollama model.",
    badge: "AI",
  },
  {
    title: "Quiz & Games",
    to: "/quiz-games",
    icon: Gamepad2,
    desc: "Test your knowledge with quizzes and match flags with their countries.",
    badge: "Fun",
  },
];

export default function Dashboard() {
  return (
    <section className="bg-gradient-to-b from-secondary to-background py-12 md:py-16">
      <div className="container">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Interactive Education Dashboard</h1>
          <p className="mt-2 text-foreground/70">Choose a module to begin your exploration.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.to} className="group relative overflow-hidden border-muted/60">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <f.icon className="h-5 w-5 text-primary" />
                    {f.title}
                  </CardTitle>
                  <Badge variant="secondary">{f.badge}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-foreground/70">{f.desc}</p>
                <Button asChild variant="default" size="sm">
                  <Link to={f.to}>Open</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
