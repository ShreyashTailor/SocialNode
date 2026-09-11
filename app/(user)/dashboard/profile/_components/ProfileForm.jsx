"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const SOCIAL_FIELDS = [
  { tab: "social", id: "youtube", label: "YouTube", placeholder: "https://youtube.com/@username" },
  { tab: "social", id: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
  { tab: "social", id: "facebook", label: "Facebook", placeholder: "https://facebook.com/username" },
  { tab: "social", id: "snapchat", label: "Snapchat", placeholder: "https://snapchat.com/add/username" },
  { tab: "social", id: "twitter", label: "Twitter / X", placeholder: "https://x.com/username" },
  { tab: "social", id: "threads", label: "Threads", placeholder: "https://threads.net/@username" },
  { tab: "social", id: "reddit", label: "Reddit", placeholder: "https://reddit.com/user/username" },
  { tab: "professional", id: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  { tab: "professional", id: "github", label: "GitHub", placeholder: "https://github.com/username" },
  { tab: "professional", id: "stackoverflow", label: "Stack Overflow", placeholder: "https://stackoverflow.com/users/..." },
  { tab: "professional", id: "leetcode", label: "LeetCode", placeholder: "https://leetcode.com/username" },
  { tab: "professional", id: "codeforces", label: "Codeforces", placeholder: "https://codeforces.com/profile/username" },
  { tab: "professional", id: "hackerrank", label: "HackerRank", placeholder: "https://hackerrank.com/username" },
  { tab: "professional", id: "codechef", label: "CodeChef", placeholder: "https://codechef.com/users/username" },
  { tab: "professional", id: "geeksForGeeks", label: "GeeksforGeeks", placeholder: "https://geeksforgeeks.org/user/username" },
  { tab: "creative", id: "twitch", label: "Twitch", placeholder: "https://twitch.tv/username" },
  { tab: "creative", id: "soundcloud", label: "SoundCloud", placeholder: "https://soundcloud.com/username" },
  { tab: "creative", id: "spotify", label: "Spotify", placeholder: "https://open.spotify.com/user/username" },
  { tab: "creative", id: "applemusic", label: "Apple Music", placeholder: "https://music.apple.com/profile/username" },
  { tab: "messaging", id: "discord", label: "Discord", placeholder: "https://discord.com/users/id" },
  { tab: "messaging", id: "telegram", label: "Telegram", placeholder: "https://t.me/username" },
  { tab: "messaging", id: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/919876543210" },
  { tab: "messaging", id: "skype", label: "Skype", placeholder: "skype:username?chat" },
  { tab: "storefront", id: "amazon", label: "Amazon Storefront", placeholder: "https://amazon.com/shop/username" },
  { tab: "storefront", id: "shopify", label: "Shopify", placeholder: "https://username.myshopify.com" },
  { tab: "storefront", id: "kofi", label: "Ko-fi", placeholder: "https://ko-fi.com/username" },
  { tab: "storefront", id: "buyMeACoffee", label: "Buy Me a Coffee", placeholder: "https://buymeacoffee.com/username" },
  { tab: "storefront", id: "patreon", label: "Patreon", placeholder: "https://patreon.com/username" },
  { tab: "misc", id: "website", label: "Personal Website", placeholder: "https://yourdomain.com" },
  { tab: "misc", id: "blog", label: "Blog", placeholder: "https://yourblog.com" },
  { tab: "misc", id: "phone", label: "Phone", placeholder: "+1 234 567 8900", type: "tel" },
];

const TABS = [
  { value: "social", label: "Social" },
  { value: "professional", label: "Professional" },
  { value: "creative", label: "Creative" },
  { value: "messaging", label: "Messaging" },
  { value: "storefront", label: "Storefront" },
  { value: "misc", label: "Misc" },
];

export default function ProfileForm({ initialData, clerkImage, clerkEmail }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(() => {
    const d = initialData || {};
    const fields = {};
    SOCIAL_FIELDS.forEach(({ id }) => { fields[id] = d[id] || ""; });
    return {
      username: d.username || "",
      name: d.name || "",
      bio: d.bio || "",
      accessKey: d.accessKey || "",
      ...fields,
    };
  });

  const set = (id) => (e) => setForm((f) => ({ ...f, [id]: e.target.value }));

  const isValidUrl = (val) => {
    if (!val) return true;
    try { new URL(val); return true; } catch { return false; }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || form.username.length < 3) {
      toast({ title: "Username must be at least 3 characters.", variant: "destructive" });
      return;
    }
    if (!/^[a-z0-9_-]+$/.test(form.username)) {
      toast({ title: "Username can only contain lowercase letters, numbers, - and _.", variant: "destructive" });
      return;
    }
    if (!form.name.trim()) {
      toast({ title: "Name is required.", variant: "destructive" });
      return;
    }

    const urlFields = SOCIAL_FIELDS.filter((f) => f.type !== "tel").map((f) => f.id);
    for (const id of urlFields) {
      if (form[id] && !isValidUrl(form[id])) {
        toast({ title: `Invalid URL in ${id}.`, variant: "destructive" });
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch("/api/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, insta: form.instagram, face: form.facebook }),
      });
      const data = await res.json();
      if (data.error) {
        toast({ title: data.error, variant: "destructive" });
      } else {
        toast({ title: "Profile saved successfully!" });
      }
    } catch {
      toast({ title: "Something went wrong.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="rounded-xl border bg-background p-5 space-y-4">
        <h2 className="text-sm font-semibold">Basic Information</h2>

        <div className="grid gap-1.5">
          <Label htmlFor="username">Username</Label>
          <div className="flex items-center">
            <span className="h-9 inline-flex items-center px-3 rounded-l-md border border-r-0 bg-muted text-sm text-muted-foreground">
              socialnode/
            </span>
            <Input
              id="username"
              value={form.username}
              onChange={set("username")}
              placeholder="yourname"
              className="rounded-l-none"
              maxLength={30}
            />
          </div>
          <p className="text-xs text-muted-foreground">3–30 chars, lowercase, numbers, - and _ only.</p>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="name">Display Name</Label>
          <Input id="name" value={form.name} onChange={set("name")} placeholder="Your full name" maxLength={60} />
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={form.bio}
            onChange={set("bio")}
            placeholder="Tell people about yourself…"
            maxLength={200}
            rows={3}
          />
          <p className="text-xs text-muted-foreground text-right">{form.bio.length}/200</p>
        </div>
      </div>

      {/* Social links */}
      <div className="rounded-xl border bg-background p-5">
        <h2 className="text-sm font-semibold mb-4">Social Links</h2>
        <Tabs defaultValue="social">
          <TabsList className="flex flex-wrap h-auto gap-1 mb-4">
            {TABS.map(({ value, label }) => (
              <TabsTrigger key={value} value={value} className="text-xs">{label}</TabsTrigger>
            ))}
          </TabsList>
          {TABS.map(({ value }) => (
            <TabsContent key={value} value={value} className="space-y-3 mt-0">
              {SOCIAL_FIELDS.filter((f) => f.tab === value).map(({ id, label, placeholder, type }) => (
                <div key={id} className="grid gap-1.5">
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                    id={id}
                    type={type || "url"}
                    value={form[id]}
                    onChange={set(id)}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Access key */}
      <div className="rounded-xl border bg-background p-5 space-y-3">
        <div>
          <h2 className="text-sm font-semibold">Private Access Key</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Visitors must enter this key to see your private contact links.</p>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="accessKey">Access Key (optional)</Label>
          <Input
            id="accessKey"
            type="text"
            value={form.accessKey}
            onChange={set("accessKey")}
            placeholder="Leave blank to make all links public"
          />
        </div>
      </div>

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving…</> : "Save Profile"}
      </Button>
    </form>
  );
}
