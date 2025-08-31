import { useMemo, useState } from "react";
import { Facebook, Instagram, Github, Linkedin, Youtube, X } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const mailto = useMemo(() => {
    const to = "support@aicountry.app";
    const params = new URLSearchParams({
      subject: subject || "Message from AI Country Dashboard",
      body: `${message}\n\n— ${name}${email ? ` <${email}>` : ""}`,
    });
    return `mailto:${to}?${params.toString()}`;
  }, [name, email, subject, message]);

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
      <div className="mt-2 space-y-2 text-foreground/70">
        <p>Email: support@aicountry.app</p>
        <p>Phone: +1 (555) 010-2030</p>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold">Write us a short email</h2>
          <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); window.location.href = mailto; }}>
            <div className="grid gap-2">
              <label className="text-sm text-foreground/80" htmlFor="name">Your name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-10 rounded-md border border-border bg-background px-3 text-sm" placeholder="Jane Doe" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-foreground/80" htmlFor="email">Your email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 rounded-md border border-border bg-background px-3 text-sm" placeholder="jane@example.com" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-foreground/80" htmlFor="subject">Subject</label>
              <input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="h-10 rounded-md border border-border bg-background px-3 text-sm" placeholder="Question about the dashboard" />
            </div>
            <div className="grid gap-2">
              <label className="text-sm text-foreground/80" htmlFor="message">Message</label>
              <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} className="min-h-[120px] rounded-md border border-border bg-background px-3 py-2 text-sm" placeholder="Write a short message..." />
            </div>
            <div className="flex gap-3">
              <a href={mailto} className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90" onClick={(e)=>{ if(!subject && !message){ e.preventDefault(); }}}>Send email</a>
              <button type="reset" onClick={() => { setName(""); setEmail(""); setSubject(""); setMessage(""); }} className="inline-flex h-10 items-center rounded-md border px-4 text-sm">Reset</button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-lg font-semibold">Social</h2>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary" aria-label="Facebook">
              <Facebook className="h-5 w-5" /> Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary" aria-label="Instagram">
              <Instagram className="h-5 w-5" /> Instagram
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary" aria-label="X">
              <X className="h-5 w-5" /> X
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary" aria-label="GitHub">
              <Github className="h-5 w-5" /> GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" /> LinkedIn
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary" aria-label="YouTube">
              <Youtube className="h-5 w-5" /> YouTube
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
