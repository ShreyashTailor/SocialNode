"use client";

import { useEffect, useState } from "react";
import { Icons } from "./icons";
import { Share2, ExternalLink, Star, GitFork, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

const FONT_MAP = {
  inter: "font-sans",
  poppins: "font-sans",
  mono: "font-mono",
};

function trackView(username) {
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, type: "view" }),
  }).catch(() => {});
}

function trackClick(linkId, linkTitle) {
  const username = window.location.pathname.split("/")[1];
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, type: "click", linkId, linkTitle }),
  }).catch(() => {});
}

// Theme-specific components
function MinimalTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgColor }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-6 py-16", font)} style={{ backgroundColor: bgColor || "#ffffff", color: textColor }}>
      <button onClick={handleShare} className="fixed top-6 right-6 w-10 h-10 rounded-full border-2 hover:bg-gray-100 flex items-center justify-center" style={{ borderColor: textColor, color: textColor }}>
        <Share2 className="w-4 h-4" />
      </button>

      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-4">
          <img src={user.image} alt={user.name} className="w-24 h-24 rounded-full mx-auto border-2" style={{ borderColor: linkColor }} />
          <h1 className="text-3xl font-bold">{user.name}</h1>
          {user.bio && <p className="text-gray-600">{user.bio}</p>}
        </div>

        {/* Social icons */}
        {socialPlatforms.some((p) => user[p]) && (
          <div className="flex flex-wrap justify-center gap-2">
            {socialPlatforms.map((platform) => {
              if (!user[platform]) return null;
              const icon = Icons[platform];
              return (
                <a key={platform} href={user[platform]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border-2 flex items-center justify-center hover:scale-110 transition-transform" style={{ borderColor: linkColor, color: linkColor }} onClick={() => trackClick(null, platform)}>
                  {icon}
                </a>
              );
            })}
          </div>
        )}

        {customLinks.length > 0 && (
          <div className="space-y-2">
            {customLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="block p-3 border-2 hover:bg-gray-50 transition-colors text-center font-medium" style={{ borderColor: linkColor, color: linkColor }}>
                {link.title}
              </a>
            ))}
          </div>
        )}

        {featuredRepos.length > 0 && (
          <div className="mt-10 space-y-3">
            <h2 className="text-xl font-bold text-center">Projects</h2>
            {featuredRepos.map((repo) => (
              <a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(null, `GitHub: ${repo.name}`)} className="block p-3 border-2 hover:shadow-md transition-shadow" style={{ borderColor: `${linkColor}30` }}>
                <p className="font-semibold">{repo.name}</p>
                {repo.description && <p className="text-sm text-gray-600 mt-1">{repo.description}</p>}
              </a>
            ))}
          </div>
        )}

        <div className="text-center opacity-40 text-xs mt-12">
          <Logo />
        </div>
      </div>
    </div>
  );
}

function NeonTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgColor }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-6 py-16 relative overflow-hidden", font)} style={{ backgroundColor: bgColor || "#0a0a0a", color: textColor }}>
      {/* Animated grid background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(0deg, transparent 24%, rgba(167, 139, 250, 0.05) 25%, rgba(167, 139, 250, 0.05) 26%, transparent 27%, transparent 74%, rgba(167, 139, 250, 0.05) 75%, rgba(167, 139, 250, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(167, 139, 250, 0.05) 25%, rgba(167, 139, 250, 0.05) 26%, transparent 27%, transparent 74%, rgba(167, 139, 250, 0.05) 75%, rgba(167, 139, 250, 0.05) 76%, transparent 77%, transparent)", backgroundSize: "50px 50px" }} />
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20" style={{ backgroundColor: linkColor }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ backgroundColor: linkColor }} />
      </div>

      <button onClick={handleShare} className="fixed top-6 right-6 w-10 h-10 rounded-full border-2 hover:scale-110 flex items-center justify-center transition-transform" style={{ borderColor: linkColor, color: linkColor, boxShadow: `0 0 20px ${linkColor}40` }}>
        <Share2 className="w-4 h-4" />
      </button>

      <div className="w-full max-w-xl space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <img src={user.image} alt={user.name} className="w-28 h-28 rounded-full mx-auto border-2" style={{ borderColor: linkColor, boxShadow: `0 0 40px ${linkColor}60` }} />
          <h1 className="text-4xl font-bold" style={{ color: linkColor }}>{user.name}</h1>
          {user.bio && <p className="text-gray-300">{user.bio}</p>}
        </div>

        {/* Social icons */}
        {socialPlatforms.some((p) => user[p]) && (
          <div className="flex flex-wrap justify-center gap-3">
            {socialPlatforms.map((platform) => {
              if (!user[platform]) return null;
              const icon = Icons[platform];
              return (
                <a key={platform} href={user[platform]} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full border-2 flex items-center justify-center hover:scale-110 transition-transform" style={{ borderColor: linkColor, color: linkColor, boxShadow: `0 0 15px ${linkColor}30` }} onClick={() => trackClick(null, platform)}>
                  {icon}
                </a>
              );
            })}
          </div>
        )}

        {customLinks.length > 0 && (
          <div className="space-y-3">
            {customLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="block p-4 border-2 hover:scale-105 transition-transform font-medium" style={{ borderColor: linkColor, color: linkColor, boxShadow: `0 0 20px ${linkColor}30, inset 0 0 10px ${linkColor}10` }}>
                {link.title}
              </a>
            ))}
          </div>
        )}

        {featuredRepos.length > 0 && (
          <div className="space-y-3 mt-8">
            <h2 className="text-xl font-bold text-center" style={{ color: linkColor }}>Featured Projects</h2>
            {featuredRepos.map((repo) => (
              <a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(null, `GitHub: ${repo.name}`)} className="block p-4 border-2 hover:scale-105 transition-transform" style={{ borderColor: linkColor, color: linkColor, boxShadow: `0 0 15px ${linkColor}20` }}>
                <p className="font-semibold">{repo.name}</p>
                {repo.description && <p className="text-sm opacity-75 mt-1">{repo.description}</p>}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GlassTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgGradient }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-6 py-16", font)} style={{ background: bgGradient || "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", color: textColor, backdropFilter: "blur(10px)" }}>
      <button onClick={handleShare} className="fixed top-6 right-6 w-10 h-10 rounded-full backdrop-blur-xl border hover:bg-white/20 flex items-center justify-center transition-all" style={{ borderColor: "rgba(255, 255, 255, 0.3)", color: textColor, background: "rgba(255, 255, 255, 0.1)" }}>
        <Share2 className="w-4 h-4" />
      </button>

      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-4">
          <img src={user.image} alt={user.name} className="w-28 h-28 rounded-full mx-auto border-2 backdrop-blur-xl shadow-2xl" style={{ borderColor: "rgba(255, 255, 255, 0.3)", background: "rgba(255, 255, 255, 0.1)" }} />
          <h1 className="text-4xl font-bold">{user.name}</h1>
          {user.bio && <p className="text-blue-100">{user.bio}</p>}
        </div>

        {/* Social icons */}
        {socialPlatforms.some((p) => user[p]) && (
          <div className="flex flex-wrap justify-center gap-2">
            {socialPlatforms.map((platform) => {
              if (!user[platform]) return null;
              const icon = Icons[platform];
              return (
                <a key={platform} href={user[platform]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full backdrop-blur-xl border flex items-center justify-center hover:scale-110 transition-transform" style={{ borderColor: "rgba(255, 255, 255, 0.3)", background: "rgba(255, 255, 255, 0.1)", color: textColor }} onClick={() => trackClick(null, platform)}>
                  {icon}
                </a>
              );
            })}
          </div>
        )}

        {customLinks.length > 0 && (
          <div className="space-y-3">
            {customLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="block p-4 backdrop-blur-xl border rounded-2xl hover:scale-105 transition-transform font-medium hover:bg-white/20" style={{ borderColor: "rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.1)", color: textColor }}>
                {link.title}
              </a>
            ))}
          </div>
        )}

        {featuredRepos.length > 0 && (
          <div className="mt-12 space-y-3">
            <h2 className="text-2xl font-bold text-center">Featured</h2>
            {featuredRepos.map((repo) => (
              <a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="block p-4 backdrop-blur-xl border rounded-2xl hover:bg-white/20 transition-colors" style={{ borderColor: "rgba(255, 255, 255, 0.2)", background: "rgba(255, 255, 255, 0.08)", color: textColor }}>
                <p className="font-semibold">{repo.name}</p>
                <p className="text-sm text-blue-100 mt-1">{repo.description}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GradientTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgGradient }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-6 py-16", font)} style={{ background: bgGradient, color: textColor }}>
      <button onClick={handleShare} className="fixed top-6 right-6 w-10 h-10 rounded-full backdrop-blur-xl border hover:scale-110 flex items-center justify-center transition-transform" style={{ borderColor: "rgba(255, 255, 255, 0.3)", color: textColor, background: "rgba(255, 255, 255, 0.1)" }}>
        <Share2 className="w-4 h-4" />
      </button>

      <div className="w-full max-w-xl space-y-10">
        <div className="text-center space-y-6">
          <img src={user.image} alt={user.name} className="w-32 h-32 rounded-full mx-auto border-4 shadow-2xl" style={{ borderColor: "rgba(255, 255, 255, 0.5)" }} />
          <div>
            <h1 className="text-5xl font-black drop-shadow-lg">{user.name}</h1>
            {user.bio && <p className="text-lg mt-3 drop-shadow-md">{user.bio}</p>}
          </div>
        </div>

        {/* Social icons */}
        {socialPlatforms.some((p) => user[p]) && (
          <div className="flex flex-wrap justify-center gap-3">
            {socialPlatforms.map((platform) => {
              if (!user[platform]) return null;
              const icon = Icons[platform];
              return (
                <a key={platform} href={user[platform]} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg" style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)", color: textColor, border: "2px solid rgba(255, 255, 255, 0.3)" }} onClick={() => trackClick(null, platform)}>
                  {icon}
                </a>
              );
            })}
          </div>
        )}

        {customLinks.length > 0 && (
          <div className="space-y-3">
            {customLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="block p-4 rounded-full hover:scale-105 transition-transform font-bold text-center shadow-lg hover:shadow-2xl" style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)", color: textColor, border: "2px solid rgba(255, 255, 255, 0.3)" }}>
                {link.title}
              </a>
            ))}
          </div>
        )}

        {featuredRepos.length > 0 && (
          <div className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold text-center drop-shadow-lg">Featured Projects</h2>
            <div className="grid gap-3">
              {featuredRepos.map((repo) => (
                <a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(null, `GitHub: ${repo.name}`)} className="p-4 rounded-2xl hover:scale-105 transition-transform shadow-lg" style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)", color: textColor, border: "2px solid rgba(255, 255, 255, 0.3)" }}>
                  <p className="font-bold">{repo.name}</p>
                  {repo.description && <p className="text-sm mt-1 opacity-90">{repo.description}</p>}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MonospaceTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgColor }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-6 py-16", font)} style={{ backgroundColor: bgColor || "#000000", color: textColor, fontFamily: "Courier New, monospace" }}>
      <button onClick={handleShare} className="fixed top-6 right-6 w-10 h-10 rounded-none border-2 hover:scale-110 flex items-center justify-center transition-transform" style={{ borderColor: linkColor, color: linkColor, boxShadow: `inset 0 0 10px ${linkColor}40` }}>
        <Share2 className="w-4 h-4" />
      </button>

      <div className="w-full max-w-xl space-y-8 border-2" style={{ borderColor: linkColor, padding: "2rem", boxShadow: `0 0 20px ${linkColor}30` }}>
        <pre style={{ color: linkColor, fontSize: "0.9rem" }}>
          {`> whoami\n${user.name}\n> cat bio\n${user.bio}\n`}
        </pre>

        {/* Social links */}
        {socialPlatforms.some((p) => user[p]) && (
          <div>
            <pre style={{ color: linkColor }}>$ ls -la socials/</pre>
            <div className="space-y-1 mt-2">
              {socialPlatforms.map((platform) => {
                if (!user[platform]) return null;
                return (
                  <a key={platform} href={user[platform]} target="_blank" rel="noopener noreferrer" className="block font-mono text-sm hover:underline" style={{ color: linkColor }} onClick={() => trackClick(null, platform)}>
                    lrwx------ | {platform}
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {customLinks.length > 0 && (
          <div>
            <pre style={{ color: linkColor }}>$ ls -la links/</pre>
            <div className="space-y-1 mt-2">
              {customLinks.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="block font-mono text-sm hover:underline" style={{ color: linkColor }}>
                  drwx------ | {link.title}
                </a>
              ))}
            </div>
          </div>
        )}

        <div style={{ color: linkColor, opacity: 0.7 }}>$ _</div>
      </div>
    </div>
  );
}

function CardTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgGradient }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-6 py-16", font)} style={{ background: bgGradient || "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", color: textColor }}>
      <button onClick={handleShare} className="fixed top-6 right-6 w-10 h-10 rounded-lg shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow bg-white" style={{ color: linkColor }}>
        <Share2 className="w-4 h-4" />
      </button>

      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
          <img src={user.image} alt={user.name} className="w-28 h-28 rounded-full mx-auto shadow-lg" />
          <h1 className="text-3xl font-bold">{user.name}</h1>
          {user.bio && <p className="text-gray-600">{user.bio}</p>}
          
          {/* Social icons */}
          {socialPlatforms.some((p) => user[p]) && (
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {socialPlatforms.map((platform) => {
                if (!user[platform]) return null;
                const icon = Icons[platform];
                return (
                  <a key={platform} href={user[platform]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform" style={{ background: linkColor, color: "#ffffff" }} onClick={() => trackClick(null, platform)}>
                    {icon}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {customLinks.length > 0 && (
          <div className="grid gap-3">
            {customLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all" style={{ borderLeft: `4px solid ${linkColor}` }}>
                <p className="font-bold" style={{ color: linkColor }}>{link.title}</p>
                {link.description && <p className="text-sm text-gray-500 mt-1">{link.description}</p>}
              </a>
            ))}
          </div>
        )}

        {featuredRepos.length > 0 && (
          <div className="space-y-3 mt-8">
            <h2 className="text-2xl font-bold text-center">Projects</h2>
            <div className="grid gap-3">
              {featuredRepos.map((repo) => (
                <a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg" style={{ borderLeft: `4px solid ${linkColor}` }}>
                  <p className="font-bold">{repo.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{repo.description}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AppleGlassTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgGradient }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-4 py-16", font)} style={{ background: bgGradient }}>
      <button 
        onClick={handleShare} 
        className="fixed top-6 right-6 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform border"
        style={{ 
          color: linkColor,
          background: "rgba(255, 255, 255, 0.5)",
          borderColor: "rgba(255, 255, 255, 0.6)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.6)"
        }}
      >
        <Share2 className="w-4 h-4" />
      </button>

      <div className="w-full max-w-2xl space-y-6">
        {/* Profile card with glass effect */}
        <div
          className="rounded-3xl p-8 backdrop-blur-xl border shadow-xl text-center space-y-4"
          style={{
            background: "rgba(255, 255, 255, 0.7)",
            borderColor: "rgba(255, 255, 255, 0.8)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.6)"
          }}
        >
          <img src={user.image} alt={user.name} className="w-24 h-24 rounded-full mx-auto shadow-lg" />
          <div>
            <h1 className="text-4xl font-bold" style={{ color: textColor }}>{user.name}</h1>
            {user.bio && <p className="text-lg mt-2" style={{ color: textColor, opacity: 0.7 }}>{user.bio}</p>}
          </div>
          
          {/* Social icons with glass effect */}
          {socialPlatforms.some((p) => user[p]) && (
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {socialPlatforms.map((platform) => {
                if (!user[platform]) return null;
                const icon = Icons[platform];
                return (
                  <a 
                    key={platform} 
                    href={user[platform]} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform backdrop-blur-md border"
                    style={{
                      color: linkColor,
                      background: "rgba(255, 255, 255, 0.6)",
                      borderColor: "rgba(255, 255, 255, 0.8)",
                      boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2)"
                    }}
                    onClick={() => trackClick(null, platform)}
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Links with glass effect */}
        {customLinks.length > 0 && (
          <div className="grid gap-4">
            {customLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={() => trackClick(link.id, link.title)}
                className="rounded-2xl p-4 backdrop-blur-md border hover:scale-105 transition-transform font-semibold"
                style={{
                  color: linkColor,
                  background: "rgba(255, 255, 255, 0.6)",
                  borderColor: "rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)"
                }}
              >
                {link.title}
              </a>
            ))}
          </div>
        )}

        {/* Featured projects with glass effect */}
        {featuredRepos.length > 0 && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-center" style={{ color: textColor }}>Featured</h2>
            <div className="grid gap-4">
              {featuredRepos.map((repo) => (
                <a 
                  key={repo.name} 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="rounded-2xl p-4 backdrop-blur-md border hover:scale-[1.02] transition-transform"
                  style={{
                    color: textColor,
                    background: "rgba(255, 255, 255, 0.6)",
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)"
                  }}
                >
                  <p className="font-semibold">{repo.name}</p>
                  {repo.description && <p className="text-sm mt-1" style={{ opacity: 0.8 }}>{repo.description}</p>}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PublicProfile({ user, customLinks, appearance, githubCache }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    trackView(user.username);
  }, [user.username]);

  if (!mounted) return null;

  const theme = appearance || {};
  const textColor = theme.text_color || "#111111";
  const linkColor = theme.link_color || "#000000";
  const bgColor = theme.bg_color;
  const bgGradient = theme.bg_gradient;
  const font = FONT_MAP[theme.font] || "font-sans";
  const themeId = theme.theme || "minimal";

  const socialPlatforms = [
    "youtube", "instagram", "facebook", "twitter", "linkedin", "github",
    "snapchat", "threads", "reddit", "twitch", "soundcloud", "spotify",
    "discord", "telegram", "whatsapp", "stackoverflow", "leetcode",
    "codeforces", "hackerrank", "codechef", "geeksforgeeks",
  ];

  const githubRepos = githubCache?.repos_json ? JSON.parse(githubCache.repos_json) : [];
  const featured = githubCache?.featured ? JSON.parse(githubCache.featured) : [];
  const featuredRepos = githubRepos.filter((r) => featured.includes(r.name));

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ url: window.location.href, title: user.name });
    }
  };

  // Render theme-specific component
  const themeProps = { user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgColor, bgGradient };

  switch (themeId) {
    case "neon":
      return <NeonTheme {...themeProps} />;
    case "glass":
      return <GlassTheme {...themeProps} />;
    case "apple":
      return <AppleGlassTheme {...themeProps} />;
    case "quantum":
    case "creator":
    case "sunset":
    case "ocean":
    case "forest":
    case "retro":
      return <GradientTheme {...themeProps} bgGradient={bgGradient || theme.bg_gradient} />;
    case "developer":
      return <MonospaceTheme {...themeProps} />;
    case "card":
    case "professional":
      return <CardTheme {...themeProps} />;
    default:
      return <MinimalTheme {...themeProps} />;
  }
}
