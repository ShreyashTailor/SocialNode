"use client";

import { useEffect } from "react";
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
    keepalive: true,
  }).catch(() => {});
}

function trackClick(linkId, linkTitle) {
  const username = window.location.pathname.split("/")[1];
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, type: "click", linkId, linkTitle }),
    keepalive: true,
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

// New themes matching showcase styles from images

function DarkLinktreeTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgColor }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-6 py-16", font)} style={{ backgroundColor: bgColor || "#0a0a0a", color: textColor }}>
      <button onClick={handleShare} className="fixed top-6 right-6 w-10 h-10 rounded-full border-2 hover:bg-gray-100 flex items-center justify-center" style={{ borderColor: textColor, color: textColor }}>
        <Share2 className="w-4 h-4" />
      </button>

      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-4">
          <img src={user.image} alt={user.name} className="w-20 h-20 rounded-full mx-auto border-2" style={{ borderColor: linkColor }} />
          <h1 className="text-3xl font-bold">{user.name}</h1>
          {user.bio && <p className="text-gray-400 max-w-md mx-auto">{user.bio}</p>}
        </div>

        {/* Social icons */}
        {socialPlatforms.some((p) => user[p]) && (
          <div className="flex flex-wrap justify-center gap-3">
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
          <div className="space-y-2 w-full">
            {customLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="block w-full p-3 border rounded-lg hover:bg-white/10 transition-colors text-center font-medium" style={{ borderColor: linkColor, color: linkColor, borderStyle: "solid" }}>
                {link.title}
              </a>
            ))}
          </div>
        )}

        {/* Social icons row at bottom */}
        {socialPlatforms.some((p) => user[p]) && (
          <div className="flex justify-center gap-4 pt-4">
            {socialPlatforms.map((platform) => {
              if (!user[platform]) return null;
              const icon = Icons[platform];
              return (
                <a key={platform} href={user[platform]} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border flex items-center justify-center hover:scale-110 transition-transform" style={{ borderColor: linkColor, color: linkColor }} onClick={() => trackClick(null, platform)}>
                  {icon}
                </a>
              );
            })}
          </div>
        )}

        <div className="text-center opacity-40 text-xs mt-12">
          <Logo />
        </div>
      </div>
    </div>
  );
}

function LightLinkinBioTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgColor }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-6 py-16", font)} style={{ backgroundColor: bgColor || "#fafafa", color: textColor }}>
      <button onClick={handleShare} className="fixed top-6 right-6 w-10 h-10 rounded-full border-2 hover:bg-gray-100 flex items-center justify-center" style={{ borderColor: textColor, color: textColor }}>
        <Share2 className="w-4 h-4" />
      </button>

      <div className="w-full max-w-2xl space-y-8">
        <div className="flex items-start gap-6 pb-6 border-b" style={{ borderColor: "#e5e5e5" }}>
          <img src={user.image} alt={user.name} className="w-20 h-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">{user.name}</h1>
              {user.bio && <span className="text-sm text-gray-500">{user.bio}</span>}
            </div>
            <div className="flex gap-2">
              {customLinks.slice(0, 4).map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="px-3 py-1.5 bg-gray-100 rounded-md text-sm hover:bg-gray-200 transition-colors">
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Thumbnail grid at bottom */}
        {featuredRepos.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold text-gray-500 mb-3">Projects</h2>
            <div className="grid grid-cols-4 gap-2">
              {featuredRepos.slice(0, 4).map((repo) => (
                <a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(null, `GitHub: ${repo.name}`)} className="aspect-square rounded-lg overflow-hidden border hover:opacity-90 transition-opacity" style={{ borderColor: "#e5e5e5" }}>
                  {repo.description && (
                    <div className="h-full flex flex-col justify-center p-2">
                      <p className="text-xs font-semibold truncate">{repo.name}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{repo.description}</p>
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Additional links below thumbnails */}
        {customLinks.length > 4 && (
          <div className="mt-6 space-y-2">
            {customLinks.slice(4).map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="block p-3 border-2 hover:bg-gray-100 transition-colors text-center font-medium" style={{ borderColor: linkColor, color: linkColor }}>
                {link.title}
              </a>
            ))}
          </div>
        )}

        {/* Social icons */}
        {socialPlatforms.some((p) => user[p]) && (
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {socialPlatforms.map((platform) => {
              if (!user[platform]) return null;
              const icon = Icons[platform];
              return (
                <a key={platform} href={user[platform]} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border-2 flex items-center justify-center hover:scale-110 transition-transform" style={{ borderColor: linkColor, color: linkColor }} onClick={() => trackClick(null, platform)}>
                  {icon}
                </a>
              );
            })}
          </div>
        )}

        <div className="text-center opacity-40 text-xs mt-8">
          <Logo />
        </div>
      </div>
    </div>
  );
}

function YellowFlowlinkTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgColor }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-6 py-16", font)} style={{ backgroundColor: bgColor || "#fef3c7", color: textColor }}>
      {/* CLONE badge */}
      <div className="absolute top-4 right-4 px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
        CLONE
      </div>

      <button onClick={handleShare} className="fixed top-6 right-6 w-10 h-10 rounded-full border-2 hover:bg-gray-100 flex items-center justify-center" style={{ borderColor: textColor, color: textColor }}>
        <Share2 className="w-4 h-4" />
      </button>

      <div className="w-full max-w-xl space-y-8 relative z-10">
        <div className="text-center space-y-4">
          {/* Purple circle avatar */}
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: "#7c3aed" }}>
            <span className="text-white font-bold text-lg">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          {user.bio && <p className="text-gray-600">{user.bio}</p>}
        </div>

        {/* Outline-styled link blocks */}
        {customLinks.length > 0 && (
          <div className="space-y-3 w-full">
            {customLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="block w-full p-4 border-2 hover:bg-black/5 transition-colors text-center font-medium" style={{ borderColor: "#000000", color: "#000000" }}>
                {link.title}
              </a>
            ))}
          </div>
        )}

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

        <div className="text-center opacity-40 text-xs mt-12">
          <Logo />
        </div>
      </div>
    </div>
  );
}

function PinkLinktreeTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgColor }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-6 py-16", font)} style={{ backgroundColor: bgColor || "#fce4ec", color: textColor }}>
      <button onClick={handleShare} className="fixed top-6 right-6 w-10 h-10 rounded-full border-2 hover:bg-gray-100 flex items-center justify-center" style={{ borderColor: textColor, color: textColor }}>
        <Share2 className="w-4 h-4" />
      </button>

      {/* Navigation arrows */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border flex items-center justify-center hover:bg-black/10 transition-colors cursor-pointer" style={{ borderColor: textColor, color: textColor }}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border flex items-center justify-center hover:bg-black/10 transition-colors cursor-pointer" style={{ borderColor: textColor, color: textColor }}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <img src={user.image} alt={user.name} className="w-20 h-20 rounded-full mx-auto border-2" style={{ borderColor: linkColor }} />
          <h1 className="text-xl font-bold">{user.name}</h1>
          {user.bio && <p className="text-gray-600">{user.bio}</p>}
        </div>

        {/* Link buttons */}
        {customLinks.length > 0 && (
          <div className="space-y-2 w-full">
            {customLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="block w-full p-3 border rounded-lg hover:bg-white/10 transition-colors text-center font-medium" style={{ borderColor: linkColor, color: linkColor }}>
                {link.title}
              </a>
            ))}
          </div>
        )}

        {/* Social icons row at bottom */}
        {socialPlatforms.some((p) => user[p]) && (
          <div className="flex justify-center gap-3 pt-4">
            {socialPlatforms.map((platform) => {
              if (!user[platform]) return null;
              const icon = Icons[platform];
              return (
                <a key={platform} href={user[platform]} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border flex items-center justify-center hover:scale-110 transition-transform" style={{ borderColor: linkColor, color: linkColor }} onClick={() => trackClick(null, platform)}>
                  {icon}
                </a>
              );
            })}
          </div>
        )}

        <div className="text-center opacity-40 text-xs mt-8">
          <Logo />
        </div>
      </div>
    </div>
  );
}

function Dark3DTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgColor }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-6 py-16 relative overflow-hidden", font)} style={{ backgroundColor: bgColor || "#000000", color: textColor }}>
      {/* 3D graphic element */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 rounded-full blur-3xl" style={{ backgroundColor: linkColor, opacity: 0.3 }} />
          <div className="absolute inset-4 rounded-full blur-2xl" style={{ backgroundColor: linkColor, opacity: 0.4 }} />
          <div className="absolute inset-8 rounded-full blur-xl" style={{ backgroundColor: linkColor, opacity: 0.5 }} />
        </div>
      </div>

      <button onClick={handleShare} className="fixed top-6 right-6 w-10 h-10 rounded-full border-2 hover:bg-gray-100 flex items-center justify-center" style={{ borderColor: textColor, color: textColor }}>
        <Share2 className="w-4 h-4" />
      </button>

      <div className="w-full max-w-xl space-y-8 relative z-10 text-center">
        <h2 className="text-2xl font-bold tracking-wider uppercase" style={{ color: linkColor }}>IMMERSIVE 3D WEB DEVELOPMENT</h2>
        
        <div className="space-y-4">
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Experience the future of web design with immersive 3D interactions and stunning visual effects.
          </p>
        </div>

        {/* Social icons */}
        {socialPlatforms.some((p) => user[p]) && (
          <div className="flex flex-wrap justify-center gap-3">
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
          <div className="space-y-2 w-full">
            {customLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="block w-full p-3 border rounded-lg hover:bg-white/10 transition-colors text-center font-medium" style={{ borderColor: linkColor, color: linkColor }}>
                {link.title}
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

function CreamLinkinBioTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgColor }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-6 py-16", font)} style={{ backgroundColor: bgColor || "#fdf6e3", color: textColor }}>
      <button onClick={handleShare} className="fixed top-6 right-6 w-10 h-10 rounded-full border-2 hover:bg-gray-100 flex items-center justify-center" style={{ borderColor: textColor, color: textColor }}>
        <Share2 className="w-4 h-4" />
      </button>

      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-4">
          <img src={user.image} alt={user.name} className="w-20 h-20 rounded-full mx-auto" />
          <h1 className="text-2xl font-bold">{user.name}</h1>
          {user.bio && <p className="text-gray-600">{user.bio}</p>}
          <p className="text-sm text-gray-500">Follow me on social media</p>
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
          <div className="space-y-2 w-full">
            {customLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="block w-full p-3 border rounded-lg hover:bg-gray-200/50 transition-colors text-center font-medium" style={{ borderColor: linkColor, color: linkColor }}>
                {link.title}
              </a>
            ))}
          </div>
        )}

        {/* Orange CTA button */}
        {customLinks.length > 0 && (
          <a href={customLinks[0].url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(customLinks[0].id, customLinks[0].title)} className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors mt-4">
            Visit my website
          </a>
        )}

        <div className="text-center opacity-40 text-xs mt-12">
          <Logo />
        </div>
      </div>
    </div>
  );
}

function MinimalPillTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgColor }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-6 py-16", font)} style={{ backgroundColor: bgColor || "#ffffff", color: textColor }}>
      <button onClick={handleShare} className="fixed top-6 right-6 w-10 h-10 rounded-full border-2 hover:bg-gray-100 flex items-center justify-center" style={{ borderColor: textColor, color: textColor }}>
        <Share2 className="w-4 h-4" />
      </button>

      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full mx-auto border-2 flex items-center justify-center" style={{ borderColor: "#d1d5db" }}>
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <p className="text-sm text-gray-500">Company name</p>
          <h1 className="text-xl font-bold">{user.name}</h1>
          {user.bio && <p className="text-gray-500">{user.bio}</p>}
          <p className="text-sm text-gray-400">@username</p>
        </div>

        {/* Pill-shaped buttons with subheadings */}
        {customLinks.length > 0 && (
          <div className="space-y-1 w-full">
            {customLinks.map((link, index) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="block w-full px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-center font-medium">
                {link.title}
              </a>
            ))}
          </div>
        )}

        {/* Social icons */}
        {socialPlatforms.some((p) => user[p]) && (
          <div className="flex flex-wrap justify-center gap-2 pt-6">
            {socialPlatforms.map((platform) => {
              if (!user[platform]) return null;
              const icon = Icons[platform];
              return (
                <a key={platform} href={user[platform]} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border flex items-center justify-center hover:scale-110 transition-transform" style={{ borderColor: linkColor, color: linkColor }} onClick={() => trackClick(null, platform)}>
                  {icon}
                </a>
              );
            })}
          </div>
        )}

        <div className="text-center opacity-40 text-xs mt-12">
          <Logo />
        </div>
      </div>
    </div>
  );
}

function LightLogoHeaderTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgColor }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-6 py-16", font)} style={{ backgroundColor: bgColor || "#f9fafb", color: textColor }}>
      <button onClick={handleShare} className="fixed top-6 right-6 w-10 h-10 rounded-full border-2 hover:bg-gray-100 flex items-center justify-center" style={{ borderColor: textColor, color: textColor }}>
        <Share2 className="w-4 h-4" />
      </button>

      <div className="w-full max-w-xl space-y-8">
        {/* Header with abstract background */}
        <div className="relative h-32 rounded-t-3xl overflow-hidden mb-8">
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1f2937 0%, #4b5563 50%, #1f2937 100%)" }} />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #ffffff 0%, transparent 50%)" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">YOUR<br />LOGO</span>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500">@user</p>
          {user.bio && <p className="text-gray-600 max-w-md mx-auto">{user.bio}</p>}
        </div>

        {/* Outlined button placeholders */}
        {customLinks.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {customLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="flex flex-col items-center gap-1 p-3 border-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ borderColor: "#d1d5db" }}>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <span className="text-sm text-gray-600 text-center">add your link<br />here</span>
              </a>
            ))}
          </div>
        )}

        {/* Social icons */}
        {socialPlatforms.some((p) => user[p]) && (
          <div className="flex flex-wrap justify-center gap-2 pt-4">
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

        <div className="text-center opacity-40 text-xs mt-8">
          <Logo />
        </div>
      </div>
    </div>
  );
}

function DarkLoremIpsumTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgColor }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-6 py-16", font)} style={{ backgroundColor: bgColor || "#0a0a0a", color: textColor }}>
      <button onClick={handleShare} className="fixed top-6 right-6 w-10 h-10 rounded-full border-2 hover:bg-gray-100 flex items-center justify-center" style={{ borderColor: textColor, color: textColor }}>
        <Share2 className="w-4 h-4" />
      </button>

      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-4">
          <img src={user.image} alt={user.name} className="w-16 h-16 rounded-full mx-auto border-2" style={{ borderColor: linkColor }} />
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Got a Project?</p>
            <a href={customLinks[0]?.url || "#"} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(customLinks[0]?.id, "Book a call")} className="text-lg font-bold hover:underline" style={{ color: linkColor }}>
              &gt; Book a call
            </a>
          </div>
        </div>

        {user.bio && <p className="text-gray-400 max-w-2xl leading-relaxed text-center">{user.bio}</p>}

        {/* Outline buttons */}
        {customLinks.length > 0 && (
          <div className="space-y-2 w-full">
            {customLinks.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="block w-full p-3 border-2 hover:bg-white/5 transition-colors text-center font-medium" style={{ borderColor: linkColor, color: linkColor, borderStyle: "solid" }}>
                {link.title}
              </a>
            ))}
          </div>
        )}

        {/* Projects section with thumbnails */}
        {featuredRepos.length > 0 && (
          <div className="mt-8 w-full">
            <h3 className="text-lg font-bold mb-4 text-center" style={{ color: linkColor }}>Projects</h3>
            <div className="space-y-3">
              {featuredRepos.slice(0, 3).map((repo) => (
                <a key={repo.name} href={repo.html_url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(null, `GitHub: ${repo.name}`)} className="flex gap-3 p-3 border-2 rounded-lg hover:bg-white/5 transition-colors" style={{ borderColor: "#2d2d2d" }}>
                  <div className="w-16 h-16 rounded bg-gray-800 flex-shrink-0 overflow-hidden">
                    {repo.description ? (
                      <div className="h-full flex items-center justify-center p-2">
                        <p className="text-xs text-gray-400 line-clamp-3">{repo.description}</p>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-2-2l-1.586-1.586a2 2 0 012.828 0L16 10m-2-2l-1.586 1.586a2 2 0 01-2.828 0L8 8m-2-2l4.586-4.586a2 2 0 012.828 0L16 4" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{repo.name}</p>
                    {repo.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{repo.description}</p>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Social icons */}
        {socialPlatforms.some((p) => user[p]) && (
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {socialPlatforms.map((platform) => {
              if (!user[platform]) return null;
              const icon = Icons[platform];
              return (
                <a key={platform} href={user[platform]} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border-2 flex items-center justify-center hover:scale-110 transition-transform" style={{ borderColor: linkColor, color: linkColor }} onClick={() => trackClick(null, platform)}>
                  {icon}
                </a>
              );
            })}
          </div>
        )}

        <div className="text-center opacity-40 text-xs mt-12">
          <Logo />
        </div>
      </div>
    </div>
  );
}

function MinimLinksTheme({ user, customLinks, socialPlatforms, featuredRepos, handleShare, textColor, linkColor, font, bgColor }) {
  return (
    <div className={cn("min-h-screen flex flex-col items-center px-6 py-16", font)} style={{ backgroundColor: bgColor || "#ffffff", color: textColor }}>
      {/* Browser frame */}
      <div className="w-full max-w-2xl rounded-t-xl overflow-hidden" style={{ borderTop: "3px solid #374151" }}>
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="text-gray-400 text-sm font-medium">MINIM LINKS</div>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-gray-600" />
            <div className="w-3 h-3 rounded-full bg-gray-600" />
          </div>
        </div>
        
        <div className="p-8 space-y-6">
          {/* Banner image */}
          <div className="rounded-xl overflow-hidden mb-6">
            <div className="aspect-video relative" style={{ background: "linear-gradient(135deg, #1f2937 0%, #4b5563 100%)" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white text-2xl font-bold">Contact Me</p>
                  <p className="text-gray-400 text-sm mt-1">{user.bio || "Get in touch"}</p>
                </div>
              </div>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #ffffff 0%, transparent 50%)" }} />
            </div>
          </div>

          {/* Horizontal bar buttons with icons */}
          {customLinks.length > 0 && (
            <div className="space-y-2">
              {customLinks.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(link.id, link.title)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors w-full">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  </div>
                  <span className="font-medium">{link.title}</span>
                </a>
              ))}
            </div>
          )}

          {/* Social icons */}
          {socialPlatforms.some((p) => user[p]) && (
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {socialPlatforms.map((platform) => {
                if (!user[platform]) return null;
                const icon = Icons[platform];
                return (
                  <a key={platform} href={user[platform]} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border-2 flex items-center justify-center hover:scale-110 transition-transform" style={{ borderColor: linkColor, color: linkColor }} onClick={() => trackClick(null, platform)}>
                    {icon}
                  </a>
                );
              })}
            </div>
          )}

          <div className="text-center opacity-40 text-xs mt-8">
            <Logo />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicProfile({ user, customLinks, appearance, featuredRepos }) {
  useEffect(() => {
    trackView(user.username);
  }, [user.username]);

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
    "codeforces", "hackerrank", "codechef", "geeksForGeeks",
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ url: window.location.href, title: user.name }).catch(() => {});
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
    // New themes matching showcase styles
    case "dark-linktree":
      return <DarkLinktreeTheme {...themeProps} />;
    case "light-linkinbio":
      return <LightLinkinBioTheme {...themeProps} />;
    case "yellow-flowlink":
      return <YellowFlowlinkTheme {...themeProps} />;
    case "pink-linktree":
      return <PinkLinktreeTheme {...themeProps} />;
    case "dark-3d":
      return <Dark3DTheme {...themeProps} />;
    case "cream-linkinbio":
      return <CreamLinkinBioTheme {...themeProps} />;
    case "minimal-pill":
      return <MinimalPillTheme {...themeProps} />;
    case "light-logoheader":
      return <LightLogoHeaderTheme {...themeProps} />;
    case "dark-lorem":
      return <DarkLoremIpsumTheme {...themeProps} />;
    case "minim-links":
      return <MinimLinksTheme {...themeProps} />;
    default:
      return <MinimalTheme {...themeProps} />;
  }
}
