"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ExternalLink, Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const THEMES = [
  // Classic themes
  { id: "minimal", label: "Minimal", description: "Clean white background", bg_color: "#ffffff", text_color: "#000000", link_color: "#0066cc", button_style: "outlined", button_shape: "rounded", font: "inter" },
  { id: "dark", label: "Dark", description: "Simple dark mode", bg_color: "#1a1a1a", text_color: "#ffffff", link_color: "#00d4ff", button_style: "filled", button_shape: "rounded", font: "inter" },
  
  // Gradient themes
  { id: "neon", label: "Neon", description: "Vibrant purple glow", bg_gradient: "linear-gradient(135deg, #0a0a0a 0%, #1a0033 100%)", text_color: "#ffffff", link_color: "#ff00ff", button_style: "filled", button_shape: "rounded", font: "inter" },
  { id: "quantum", label: "Quantum", description: "Purple to pink gradient", bg_gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)", text_color: "#ffffff", link_color: "#ffffff", button_style: "filled", button_shape: "pill", font: "poppins" },
  { id: "sunset", label: "Sunset", description: "Orange to red gradient", bg_gradient: "linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #c41e3a 100%)", text_color: "#ffffff", link_color: "#ffd700", button_style: "filled", button_shape: "pill", font: "poppins" },
  { id: "ocean", label: "Ocean", description: "Blue to teal gradient", bg_gradient: "linear-gradient(135deg, #0047ab 0%, #1e90ff 50%, #20b2aa 100%)", text_color: "#ffffff", link_color: "#ffffff", button_style: "filled", button_shape: "pill", font: "inter" },
  { id: "forest", label: "Forest", description: "Green gradient", bg_gradient: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #52b788 100%)", text_color: "#ffffff", link_color: "#ffffff", button_style: "filled", button_shape: "pill", font: "inter" },
  { id: "retro", label: "Retro", description: "Synthwave 80s vibes", bg_gradient: "linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)", text_color: "#ffffff", link_color: "#ffff00", button_style: "filled", button_shape: "rounded", font: "mono" },
  
  // Professional themes
  { id: "glass", label: "Glass", description: "Frosted glass effect", bg_gradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", text_color: "#ffffff", link_color: "#64b5f6", button_style: "filled", button_shape: "pill", font: "inter" },
  { id: "professional", label: "Professional", description: "Blue-gray gradient", bg_gradient: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", text_color: "#1a1a1a", link_color: "#2563eb", button_style: "filled", button_shape: "rounded", font: "inter" },
  { id: "luxury", label: "Luxury", description: "Gold on black", bg_color: "#0d0d0d", text_color: "#ffffff", link_color: "#ffd700", button_style: "outlined", button_shape: "pill", font: "poppins" },
  
  // Apple design - Liquid Glass theme
  { id: "apple", label: "Apple Glass", description: "Apple's liquid glass design", bg_gradient: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,245,250,0.92) 50%, rgba(230,240,250,0.90) 100%)", text_color: "#1d1d1f", link_color: "#0071e3", button_style: "filled", button_shape: "pill", font: "inter", backdrop_blur: true },
  
  // Developer themes
  { id: "developer", label: "Developer", description: "Terminal green code", bg_color: "#0d1117", text_color: "#00ff88", link_color: "#00ff88", button_style: "filled", button_shape: "sharp", font: "mono" },
  { id: "cyberpunk", label: "Cyberpunk", description: "Neon cyan & magenta", bg_color: "#0a0e27", text_color: "#00ffff", link_color: "#ff00ff", button_style: "filled", button_shape: "sharp", font: "mono" },
  
  // Creative themes
  { id: "creator", label: "Creator", description: "Pink to red gradient", bg_gradient: "linear-gradient(135deg, #ff006e 0%, #f5576c 100%)", text_color: "#ffffff", link_color: "#ffffff", button_style: "filled", button_shape: "pill", font: "poppins" },
  { id: "monochrome", label: "Monochrome", description: "Grayscale elegant", bg_color: "#252525", text_color: "#e0e0e0", link_color: "#ffffff", button_style: "outlined", button_shape: "pill", font: "inter" },
  
  // Showcase-style themes (matching popular link-in-bio designs)
  { id: "dark-linktree", label: "Dark Linktree", description: "Dark minimal with social row", bg_color: "#0a0a0a", text_color: "#ffffff", link_color: "#00d4ff", button_style: "filled", button_shape: "rounded", font: "inter" },
  { id: "light-linkinbio", label: "Light Link-in-Bio", description: "Light with thumbnail grid", bg_color: "#fafafa", text_color: "#111111", link_color: "#0066cc", button_style: "outlined", button_shape: "rounded", font: "inter" },
  { id: "yellow-flowlink", label: "Flowlink", description: "Yellow with outline buttons", bg_color: "#fef3c7", text_color: "#000000", link_color: "#000000", button_style: "outlined", button_shape: "rounded", font: "inter" },
  { id: "pink-linktree", label: "Pink Linktree", description: "Pastel pink with arrows", bg_color: "#fce4ec", text_color: "#111111", link_color: "#ec407a", button_style: "filled", button_shape: "rounded", font: "inter" },
  { id: "dark-3d", label: "3D Immersive", description: "Dark with 3D effects", bg_color: "#000000", text_color: "#ffffff", link_color: "#7c3aed", button_style: "filled", button_shape: "rounded", font: "inter" },
  { id: "cream-linkinbio", label: "Cream Link-in-Bio", description: "Cream with orange CTA", bg_color: "#fdf6e3", text_color: "#111111", link_color: "#0066cc", button_style: "filled", button_shape: "rounded", font: "inter" },
  { id: "minimal-pill", label: "Minimal Pills", description: "White with dark pill buttons", bg_color: "#ffffff", text_color: "#111111", link_color: "#000000", button_style: "solid", button_shape: "pill", font: "inter" },
  { id: "light-logoheader", label: "Logo Header", description: "Light with logo area", bg_color: "#f9fafb", text_color: "#111111", link_color: "#0066cc", button_style: "outlined", button_shape: "rounded", font: "inter" },
  { id: "dark-lorem", label: "Dark Portfolio", description: "Dark with projects section", bg_color: "#0a0a0a", text_color: "#ffffff", link_color: "#00d4ff", button_style: "filled", button_shape: "rounded", font: "inter" },
  { id: "minim-links", label: "Minim Links", description: "Browser frame style", bg_color: "#ffffff", text_color: "#111111", link_color: "#0066cc", button_style: "filled", button_shape: "rounded", font: "inter" },
];

const FONTS = [
  { id: "inter", label: "Inter (Default)" },
  { id: "poppins", label: "Poppins" },
  { id: "mono", label: "Monospace" },
];

const BUTTON_STYLES = [
  { id: "filled", label: "Filled" },
  { id: "outlined", label: "Outlined" },
  { id: "glass", label: "Glass" },
  { id: "neon", label: "Neon" },
  { id: "solid", label: "Solid" },
  { id: "terminal", label: "Terminal" },
];

const BUTTON_SHAPES = [
  { id: "sharp", label: "Sharp" },
  { id: "rounded", label: "Rounded" },
  { id: "pill", label: "Pill" },
];

export default function AppearanceForm({ initialData, username }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    theme: initialData?.theme || "minimal",
    bg_color: initialData?.bg_color || "#ffffff",
    bg_gradient: initialData?.bg_gradient || "",
    button_style: initialData?.button_style || "filled",
    button_shape: initialData?.button_shape || "rounded",
    font: initialData?.font || "inter",
    text_color: initialData?.text_color || "#111111",
    link_color: initialData?.link_color || "#000000",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const applyTheme = (t) => {
    setForm({
      theme: t.id,
      bg_color: t.bg_color || "",
      bg_gradient: t.bg_gradient || "",
      button_style: t.button_style,
      button_shape: t.button_shape,
      font: t.font,
      text_color: t.text_color,
      link_color: t.link_color,
    });
  };

  const getBackgroundStyle = (theme) => {
    return {
      background: theme.bg_gradient || theme.bg_color,
      backgroundColor: theme.bg_color,
    };
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/appearance/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast({ title: "Appearance saved!" });
    } catch (err) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Live preview */}
      <div className="rounded-xl border p-5 overflow-hidden">
        <h2 className="text-sm font-semibold mb-3">Live Preview</h2>
        <div
          className="w-full h-48 rounded-lg border flex flex-col items-center justify-center gap-4 transition-all duration-300"
          style={{
            background: form.bg_gradient || form.bg_color,
            color: form.text_color,
          }}
        >
          <div className="text-center">
            <p className="font-bold text-lg">Profile Preview</p>
            <p className="text-sm opacity-75">Your links and socials</p>
          </div>
          <div className="flex gap-2">
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="px-4 py-2 rounded transition-transform hover:scale-105"
              style={{
                backgroundColor: form.link_color + "20",
                color: form.link_color,
                border: `2px solid ${form.link_color}`,
              }}
            >
              Sample Link
            </a>
          </div>
        </div>
      </div>

      {/* Theme presets */}
      <div className="rounded-xl border bg-background p-5">
        <h2 className="text-sm font-semibold mb-4">Theme Presets ({THEMES.length})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => applyTheme(t)}
              className={cn(
                "relative rounded-lg border-2 p-3 text-left transition-all hover:scale-[1.02]",
                form.theme === t.id ? "border-primary shadow-lg" : "border-muted hover:border-muted-foreground/50"
              )}
            >
              <div
                className="w-full h-16 rounded-md mb-2 border border-muted-foreground/20 shadow-sm"
                style={getBackgroundStyle(t)}
              />
              <p className="text-xs font-semibold truncate">{t.label}</p>
              <p className="text-[10px] text-muted-foreground line-clamp-2">{t.description}</p>
              {form.theme === t.id && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                  <Check className="h-3 w-3 text-background" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Custom overrides */}
      <div className="rounded-xl border bg-background p-5 space-y-5">
        <h2 className="text-sm font-semibold">Custom Overrides</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label>Background Color</Label>
            <div className="flex gap-2">
              <input type="color" value={form.bg_color || "#ffffff"} onChange={set("bg_color")}
                className="h-9 w-10 rounded border cursor-pointer p-1" />
              <Input value={form.bg_color} onChange={set("bg_color")} placeholder="#ffffff" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Text Color</Label>
            <div className="flex gap-2">
              <input type="color" value={form.text_color || "#111111"} onChange={set("text_color")}
                className="h-9 w-10 rounded border cursor-pointer p-1" />
              <Input value={form.text_color} onChange={set("text_color")} placeholder="#111111" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Link / Button Color</Label>
            <div className="flex gap-2">
              <input type="color" value={form.link_color || "#000000"} onChange={set("link_color")}
                className="h-9 w-10 rounded border cursor-pointer p-1" />
              <Input value={form.link_color} onChange={set("link_color")} placeholder="#000000" />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Background Gradient CSS</Label>
            <Input value={form.bg_gradient} onChange={set("bg_gradient")}
              placeholder="linear-gradient(135deg, #667eea, #764ba2)" />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="grid gap-1.5">
            <Label>Font</Label>
            <select value={form.font} onChange={set("font")}
              className="h-9 rounded-md border bg-background px-3 text-sm">
              {FONTS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label>Button Style</Label>
            <select value={form.button_style} onChange={set("button_style")}
              className="h-9 rounded-md border bg-background px-3 text-sm">
              {BUTTON_STYLES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label>Button Shape</Label>
            <select value={form.button_shape} onChange={set("button_shape")}
              className="h-9 rounded-md border bg-background px-3 text-sm">
              {BUTTON_SHAPES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving} className="flex-1">
          {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving…</> : "Save Appearance"}
        </Button>
        {username && (
          <Button variant="outline" asChild>
            <Link href={`/${username}`} target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" /> Preview
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
