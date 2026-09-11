"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Trash2,
  GripVertical,
  ExternalLink,
  Calendar,
  Loader2,
  Power,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_OPTIONS = [
  "link", "github", "youtube", "instagram", "twitter", "facebook",
  "linkedin", "discord", "telegram", "website", "blog", "spotify",
  "twitch", "email", "phone",
];

function scheduleStatus(link) {
  if (!link.scheduled) return null;
  const now = Math.floor(Date.now() / 1000);
  if (link.start_at && now < link.start_at) return "scheduled";
  if (link.end_at && now > link.end_at) return "expired";
  return "active";
}

function StatusBadge({ status }) {
  if (!status) return null;
  const styles = {
    active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    expired: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide", styles[status])}>
      {status}
    </span>
  );
}

function toDatetimeLocal(unix) {
  if (!unix) return "";
  const d = new Date(unix * 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocal(str) {
  if (!str) return null;
  return Math.floor(new Date(str).getTime() / 1000);
}

const EMPTY_FORM = {
  title: "",
  url: "",
  description: "",
  icon: "link",
  scheduled: false,
  start_at: "",
  end_at: "",
};

export default function LinksManager({ initialLinks, userId }) {
  const { toast } = useToast();
  const [links, setLinks] = useState(initialLinks.map((l) => ({ ...l })));
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const setField = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (link) => {
    setForm({
      title: link.title,
      url: link.url,
      description: link.description || "",
      icon: link.icon || "link",
      scheduled: !!link.scheduled,
      start_at: toDatetimeLocal(link.start_at),
      end_at: toDatetimeLocal(link.end_at),
    });
    setEditingId(link.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast({ title: "Title is required.", variant: "destructive" }); return; }
    if (!form.url.trim()) { toast({ title: "URL is required.", variant: "destructive" }); return; }
    try { new URL(form.url); } catch { toast({ title: "Invalid URL.", variant: "destructive" }); return; }

    setSaving(true);
    const payload = {
      title: form.title.trim(),
      url: form.url.trim(),
      description: form.description.trim() || null,
      icon: form.icon,
      scheduled: form.scheduled ? 1 : 0,
      start_at: form.scheduled ? fromDatetimeLocal(form.start_at) : null,
      end_at: form.scheduled ? fromDatetimeLocal(form.end_at) : null,
    };

    try {
      if (editingId) {
        const res = await fetch("/api/links/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setLinks((prev) => prev.map((l) => (l.id === editingId ? { ...l, ...payload } : l)));
        toast({ title: "Link updated." });
      } else {
        const res = await fetch("/api/links/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, sort_order: links.length }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setLinks((prev) => [...prev, { id: data.id, ...payload, enabled: 1, sort_order: links.length }]);
        toast({ title: "Link added!" });
      }
      closeForm();
    } catch (err) {
      toast({ title: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/links/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      toast({ title: "Link deleted." });
    } catch (err) {
      toast({ title: err.message, variant: "destructive" });
    }
  };

  const handleToggle = async (id, current) => {
    const newVal = current ? 0 : 1;
    try {
      await fetch("/api/links/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, enabled: newVal }),
      });
      setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, enabled: newVal } : l)));
    } catch {
      toast({ title: "Failed to toggle link.", variant: "destructive" });
    }
  };

  const handleDragStart = (e, idx) => { dragItem.current = idx; };
  const handleDragEnter = (e, idx) => { dragOverItem.current = idx; };
  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const reordered = [...links];
    const [moved] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, moved);
    const withOrder = reordered.map((l, i) => ({ ...l, sort_order: i }));
    setLinks(withOrder);
    dragItem.current = null;
    dragOverItem.current = null;
    await fetch("/api/links/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: withOrder.map((l) => l.id) }),
    });
  };

  return (
    <div className="space-y-4">
      {/* Add button */}
      {!showForm && (
        <Button onClick={openNew} className="w-full" variant="outline">
          <Plus className="h-4 w-4 mr-2" /> Add Link
        </Button>
      )}

      {/* Form */}
      {showForm && (
        <div className="rounded-xl border bg-background p-5 space-y-4">
          <h2 className="text-sm font-semibold">{editingId ? "Edit Link" : "New Link"}</h2>

          <div className="grid gap-1.5">
            <Label>Title *</Label>
            <Input value={form.title} onChange={setField("title")} placeholder="My Portfolio" maxLength={60} />
          </div>
          <div className="grid gap-1.5">
            <Label>URL *</Label>
            <Input value={form.url} onChange={setField("url")} placeholder="https://example.com" type="url" />
          </div>
          <div className="grid gap-1.5">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={setField("description")} placeholder="Short description (optional)" rows={2} maxLength={120} />
          </div>
          <div className="grid gap-1.5">
            <Label>Icon</Label>
            <select
              value={form.icon}
              onChange={setField("icon")}
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            >
              {ICON_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* Schedule toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="scheduled"
              checked={form.scheduled}
              onChange={setField("scheduled")}
              className="h-4 w-4"
            />
            <Label htmlFor="scheduled" className="cursor-pointer flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Enable scheduling
            </Label>
          </div>
          {form.scheduled && (
            <div className="grid sm:grid-cols-2 gap-3 p-3 rounded-lg bg-muted/50 border">
              <div className="grid gap-1.5">
                <Label>Start Date &amp; Time</Label>
                <Input type="datetime-local" value={form.start_at} onChange={setField("start_at")} />
              </div>
              <div className="grid gap-1.5">
                <Label>End Date &amp; Time</Label>
                <Input type="datetime-local" value={form.end_at} onChange={setField("end_at")} />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? "Update" : "Add Link"}
            </Button>
            <Button variant="outline" onClick={closeForm}>Cancel</Button>
          </div>
        </div>
      )}

      {/* Links list */}
      {links.length === 0 && !showForm && (
        <div className="rounded-xl border border-dashed bg-background p-10 text-center">
          <p className="text-muted-foreground text-sm">No links yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Add your first link to start building your profile.</p>
        </div>
      )}

      <div className="space-y-2">
        {links.map((link, idx) => {
          const status = scheduleStatus(link);
          const expanded = expandedId === link.id;
          return (
            <div
              key={link.id}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragEnter={(e) => handleDragEnter(e, idx)}
              onDragEnd={handleDragEnd}
              className={cn(
                "rounded-xl border bg-background transition-opacity",
                !link.enabled && "opacity-50"
              )}
            >
              <div className="flex items-center gap-3 p-3">
                {/* Drag handle */}
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab shrink-0" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium truncate">{link.title}</span>
                    {status && <StatusBadge status={status} />}
                    {link.scheduled && !status && <Clock className="h-3 w-3 text-muted-foreground" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setExpandedId(expanded ? null : link.id)}
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                    title="Expand"
                  >
                    {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                  <a href={link.url} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => handleToggle(link.id, link.enabled)}
                    className={cn("p-1.5 rounded-md", link.enabled ? "text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" : "text-muted-foreground hover:bg-muted")}
                    title={link.enabled ? "Disable" : "Enable"}
                  >
                    <Power className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => openEdit(link)} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground text-xs font-medium">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(link.id)} className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {expanded && (
                <div className="border-t px-4 py-3 space-y-1 text-xs text-muted-foreground">
                  {link.description && <p>{link.description}</p>}
                  <p>Icon: <span className="font-mono">{link.icon}</span></p>
                  {link.scheduled && (
                    <p>
                      Schedule:{" "}
                      {link.start_at ? new Date(link.start_at * 1000).toLocaleString() : "any time"}
                      {" → "}
                      {link.end_at ? new Date(link.end_at * 1000).toLocaleString() : "no end"}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
