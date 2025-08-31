import { Link } from "react-router-dom";
import { Github, Linkedin, Facebook, Instagram, Youtube, X } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container grid gap-6 py-10 md:grid-cols-3">
        <div className="space-y-2">
          <h3 className="text-sm font-semibold tracking-wide text-foreground/80">Contact Us</h3>
          <p className="text-sm text-foreground/70">Email: support@aicountry.app</p>
          <p className="text-sm text-foreground/70">Phone: +1 (555) 010-2030</p>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold tracking-wide text-foreground/80">Follow</h3>
          <div className="flex flex-wrap items-center gap-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-foreground/70 hover:text-primary">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-foreground/70 hover:text-primary">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="text-foreground/70 hover:text-primary">
              <X className="h-5 w-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-foreground/70 hover:text-primary">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-foreground/70 hover:text-primary">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="text-foreground/70 hover:text-primary">
              <Youtube className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="flex flex-col items-start md:items-end">
          <Link to="/" className="text-sm font-semibold hover:text-primary">AI Country Dashboard</Link>
          <p className="mt-2 text-xs text-foreground/60">© {new Date().getFullYear()} AI Country Dashboard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
