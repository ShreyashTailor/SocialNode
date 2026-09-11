"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, GitBranch, Star, GitFork, Circle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GitHubForm({ userId, initialCache }) {
  const { toast } = useToast();
  const [username, setUsername] = useState(initialCache?.username || "");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(initialCache?.profile_json ? JSON.parse(initialCache.profile_json) : null);
  const [repos, setRepos] = useState(initialCache?.repos_json ? JSON.parse(initialCache.repos_json) : []);
  const [featured, setFeatured] = useState(initialCache?.featured ? JSON.parse(initialCache.featured) : []);

  const handleFetch = async () => {
    if (!username.trim()) {
      toast({ title: "Username required.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/github/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setProfile(data.profile);
      setRepos(data.repos);
      toast({ title: "GitHub data fetched!" });
    } catch (err) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = (repoName) => {
    setFeatured((prev) =>
      prev.includes(repoName) ? prev.filter((r) => r !== repoName) : [...prev, repoName]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/github/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast({ title: "Featured repos saved!" });
    } catch (err) {
      toast({ title: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Fetch GitHub data */}
      <div className="rounded-xl border bg-background p-5 space-y-4">
        <h2 className="text-sm font-semibold">Connect GitHub</h2>
        <div className="flex gap-2">
          <div className="flex-1 grid gap-1.5">
            <Label>GitHub Username</Label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="octocat"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleFetch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitBranch className="h-4 w-4 mr-2" />}
              {loading ? "Fetching…" : "Fetch"}
            </Button>
          </div>
        </div>
        {profile && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <img src={profile.avatar_url} alt={profile.login} className="w-10 h-10 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{profile.name || profile.login}</p>
              <p className="text-xs text-muted-foreground">
                {profile.public_repos} repos · {profile.followers} followers
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Select featured repos */}
      {repos.length > 0 && (
        <div className="rounded-xl border bg-background p-5 space-y-4">
          <h2 className="text-sm font-semibold">Featured Repositories ({featured.length})</h2>
          <p className="text-xs text-muted-foreground">Click to select/deselect repos to showcase on your profile.</p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {repos.map((repo) => {
              const isFeatured = featured.includes(repo.name);
              return (
                <button
                  key={repo.name}
                  onClick={() => toggleFeatured(repo.name)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border-2 transition-all hover:bg-muted/50",
                    isFeatured ? "border-primary bg-primary/5" : "border-transparent"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium flex items-center gap-2">
                        {repo.name}
                        {isFeatured && <Check className="h-3.5 w-3.5 text-primary" />}
                      </p>
                      {repo.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{repo.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        {repo.language && (
                          <span className="flex items-center gap-1">
                            <Circle className="h-2 w-2 fill-current" />
                            {repo.language}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          {repo.forks_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Featured Repos"}
          </Button>
        </div>
      )}

      {repos.length === 0 && !profile && (
        <div className="rounded-xl border border-dashed bg-background p-10 text-center">
          <GitBranch className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Enter your GitHub username to get started.</p>
        </div>
      )}
    </div>
  );
}
