import { useEffect, useMemo, useRef, useState } from "react";
import type { OllamaChatMessage, OllamaChatRequest } from "@shared/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader as DHeader, DialogTitle as DTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";

const MODEL = "llama3.2:1b";
const SYSTEM_PROMPT: OllamaChatMessage = { role: "system", content: "You are an educational tutor about world countries." };

export default function ChatTutor() {
  const [messages, setMessages] = useState<OllamaChatMessage[]>(() => {
    const raw = localStorage.getItem("chat:tutor");
    return raw ? (JSON.parse(raw) as OllamaChatMessage[]) : [SYSTEM_PROMPT];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [sessions, setSessions] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem("chat:tutor:sessions") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("chat:tutor", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function send() {
    if (!canSend) return;
    const user: OllamaChatMessage = { role: "user", content: input.trim() };
    const payload: OllamaChatRequest = { model: "llama3.2:1b", messages: [...messages, user] };
    setInput("");
    setMessages((m) => [...m, user]);
    setLoading(true);
    try {
      const r = await fetch("/api/ollama/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        setMessages((m) => [...m, { role: "assistant", content: `AI unavailable: ${err.error ?? r.statusText}. Ask admin to set OLLAMA_BASE_URL.` }]);
      } else {
        const data = await r.json();
        const answer = (data.message?.content as string) || JSON.stringify(data);
        setMessages((m) => [...m, { role: "assistant", content: answer }]);
      }
    } catch (e: any) {
      setMessages((m) => [...m, { role: "assistant", content: `Error: ${e.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container py-10">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>AI Chat Tutor</CardTitle>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    try { setSessions(JSON.parse(localStorage.getItem("chat:tutor:sessions") || "[]")); } catch { setSessions([]); }
                  }}
                >
                  History
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DHeader>
                  <DTitle>Chat history</DTitle>
                </DHeader>
                {sessions.length === 0 ? (
                  <p className="text-sm text-foreground/70">No saved chats yet.</p>
                ) : (
                  <div className="max-h-[50vh] overflow-auto space-y-2">
                    {[...sessions].reverse().map((s, idx) => {
                      const realIdx = sessions.length - 1 - idx;
                      const preview = (s.messages || []).filter((m: any) => m.role !== "system").map((m: any) => m.content).join(" \u2022 ").slice(0, 100);
                      return (
                        <div key={s.ts ?? idx} className="flex items-center justify-between rounded-md border p-2">
                          <div className="text-sm">
                            <div className="font-medium">{new Date(s.ts || Date.now()).toLocaleString()}</div>
                            <div className="text-foreground/70">{preview || "(empty)"}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DialogClose asChild>
                              <Button size="sm" onClick={() => { setMessages(s.messages || [SYSTEM_PROMPT]); setInput(""); }}>Load</Button>
                            </DialogClose>
                            <Button variant="secondary" size="sm" onClick={() => {
                              const next = [...sessions];
                              next.splice(realIdx, 1);
                              localStorage.setItem("chat:tutor:sessions", JSON.stringify(next));
                              setSessions(next);
                            }}>Delete</Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {sessions.length > 0 && (
                  <div className="mt-3 flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => { localStorage.removeItem("chat:tutor:sessions"); setSessions([]); }}>Clear all</Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            <Button
              size="sm"
              disabled={loading}
              onClick={() => {
                if (loading) return;
                const nonSystem = messages.filter((m) => m.role !== "system");
                if (nonSystem.length) {
                  const raw = localStorage.getItem("chat:tutor:sessions");
                  const saved = raw ? (JSON.parse(raw) as any[]) : [];
                  const next = [...saved, { ts: Date.now(), messages }];
                  localStorage.setItem("chat:tutor:sessions", JSON.stringify(next));
                  setSessions(next);
                }
                setMessages([SYSTEM_PROMPT]);
                setInput("");
                listRef.current?.scrollTo({ top: 0 });
              }}
            >
              New chat
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={loading || messages.filter((m) => m.role !== "system").length === 0}
              onClick={() => {
                if (!loading && confirm("Clear all chat history?")) {
                  setMessages([SYSTEM_PROMPT]);
                  setInput("");
                  listRef.current?.scrollTo({ top: 0 });
                }
              }}
            >
              Clear history
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={listRef} className="mb-4 max-h-[55vh] overflow-auto rounded-md border p-3 text-sm">
            {messages.filter((m) => m.role !== "system").map((m, i) => (
              <div key={i} className={m.role === "user" ? "mb-3 text-right" : "mb-3"}>
                <div className={m.role === "user" ? "inline-block rounded-md bg-primary px-3 py-2 text-primary-foreground" : "inline-block rounded-md bg-secondary px-3 py-2"}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <p className="text-foreground/70">Thinking…</p>}
          </div>
          <div className="flex gap-2">
            <input
              className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm"
              placeholder="Ask about any country…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <Button onClick={send} disabled={!canSend}>{loading ? "Sending" : "Send"}</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
