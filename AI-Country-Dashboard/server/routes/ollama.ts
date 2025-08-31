import type { RequestHandler } from "express";
import type { OllamaChatRequest } from "@shared/api";

const OLLAMA_BASE_URL = "http://localhost:11434";

export const chatWithOllama: RequestHandler = async (req, res) => {
  if (!OLLAMA_BASE_URL) {
    res.status(400).json({ error: "OLLAMA_BASE_URL not configured on server" });
    return;
  }

  const body = req.body as OllamaChatRequest;
  try {
    const r = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:1b", 
        messages: body.messages,
        stream: false,
        options: body.options ?? { temperature: 0.3 },
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      res.status(502).json({ error: `Ollama error: ${r.status} ${txt}` });
      return;
    }

    const data = await r.json();
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Proxy error" });
  }
};
