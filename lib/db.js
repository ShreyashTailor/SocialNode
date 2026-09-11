import { createClient } from "@libsql/client";

let client;

export function getDb() {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return client;
}

export async function initDb() {
  const db = getDb();

  // Core users table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT    NOT NULL,
      image         TEXT,
      email         TEXT    NOT NULL UNIQUE,
      username      TEXT    NOT NULL UNIQUE,
      bio           TEXT,
      youtube       TEXT,
      instagram     TEXT,
      facebook      TEXT,
      github        TEXT,
      snapchat      TEXT,
      twitter       TEXT,
      linkedin      TEXT,
      threads       TEXT,
      reddit        TEXT,
      stackoverflow TEXT,
      leetcode      TEXT,
      codeforces    TEXT,
      hackerrank    TEXT,
      codechef      TEXT,
      geeksForGeeks TEXT,
      twitch        TEXT,
      soundcloud    TEXT,
      spotify       TEXT,
      applemusic    TEXT,
      discord       TEXT,
      telegram      TEXT,
      whatsapp      TEXT,
      skype         TEXT,
      amazon        TEXT,
      shopify       TEXT,
      kofi          TEXT,
      buyMeACoffee  TEXT,
      patreon       TEXT,
      website       TEXT,
      blog          TEXT,
      phone         TEXT,
      accessKey     TEXT DEFAULT '',
      github_username TEXT,
      created_at    INTEGER DEFAULT (unixepoch())
    )
  `);

  // Custom links (beyond the fixed social fields)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS custom_links (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title       TEXT    NOT NULL,
      url         TEXT    NOT NULL,
      description TEXT,
      icon        TEXT    DEFAULT 'link',
      enabled     INTEGER NOT NULL DEFAULT 1,
      sort_order  INTEGER NOT NULL DEFAULT 0,
      scheduled   INTEGER NOT NULL DEFAULT 0,
      start_at    INTEGER,
      end_at      INTEGER,
      created_at  INTEGER DEFAULT (unixepoch())
    )
  `);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_custom_links_user ON custom_links(user_id)`);

  // Profile appearance / theme
  await db.execute(`
    CREATE TABLE IF NOT EXISTS appearances (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      theme           TEXT    NOT NULL DEFAULT 'minimal',
      bg_color        TEXT,
      bg_gradient     TEXT,
      bg_image        TEXT,
      button_style    TEXT    NOT NULL DEFAULT 'filled',
      button_shape    TEXT    NOT NULL DEFAULT 'rounded',
      font            TEXT    NOT NULL DEFAULT 'inter',
      text_color      TEXT,
      link_color      TEXT,
      accent_color    TEXT,
      card_style      TEXT    DEFAULT 'shadow',
      border_glow     INTEGER DEFAULT 0,
      border_radius   TEXT,
      custom_css      TEXT,
      updated_at      INTEGER DEFAULT (unixepoch())
    )
  `);

  // GitHub repo cache
  await db.execute(`
    CREATE TABLE IF NOT EXISTS github_cache (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      username    TEXT    NOT NULL,
      profile_json TEXT   NOT NULL,
      repos_json  TEXT    NOT NULL,
      featured    TEXT    DEFAULT '[]',
      cached_at   INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);

  // Analytics events
  await db.execute(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type        TEXT    NOT NULL,
      link_id     INTEGER,
      link_title  TEXT,
      visitor_id  TEXT,
      country     TEXT,
      device      TEXT,
      browser     TEXT,
      os          TEXT,
      referrer    TEXT,
      ts          INTEGER NOT NULL DEFAULT (unixepoch())
    )
  `);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_analytics_user_ts ON analytics_events(user_id, ts)`);
  await db.execute(`CREATE INDEX IF NOT EXISTS idx_analytics_type    ON analytics_events(type)`);

  return db;
}
