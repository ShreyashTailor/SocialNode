import { initDb } from "@/lib/db";

// ─── Users ────────────────────────────────────────────────────────────────────

export async function findUser(field, value) {
  const db = await initDb();
  const result = await db.execute({
    sql: `SELECT * FROM users WHERE ${field} = ? LIMIT 1`,
    args: [value],
  });
  return result.rows[0] ?? null;
}

export async function createUser(data) {
  const db = await initDb();
  const fields = Object.keys(data);
  const placeholders = fields.map(() => "?").join(", ");
  await db.execute({
    sql: `INSERT INTO users (${fields.join(", ")}) VALUES (${placeholders})`,
    args: Object.values(data),
  });
  const row = await db.execute({ sql: `SELECT last_insert_rowid() AS id`, args: [] });
  return row.rows[0].id;
}

export async function updateUser(email, data) {
  const db = await initDb();
  const fields = Object.keys(data);
  const setClause = fields.map((f) => `"${f}" = ?`).join(", ");
  await db.execute({
    sql: `UPDATE users SET ${setClause} WHERE email = ?`,
    args: [...Object.values(data), email],
  });
}

// ─── Custom Links ─────────────────────────────────────────────────────────────

export async function getCustomLinks(userId) {
  const db = await initDb();
  const result = await db.execute({
    sql: `SELECT * FROM custom_links WHERE user_id = ? ORDER BY sort_order ASC`,
    args: [userId],
  });
  return result.rows;
}

export async function createCustomLink(data) {
  const db = await initDb();
  const { user_id, title, url, description, icon, enabled, sort_order, scheduled, start_at, end_at } = data;
  const result = await db.execute({
    sql: `INSERT INTO custom_links (user_id, title, url, description, icon, enabled, sort_order, scheduled, start_at, end_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [user_id, title, url, description ?? null, icon ?? "link", enabled ?? 1, sort_order ?? 0, scheduled ?? 0, start_at ?? null, end_at ?? null],
  });
  return result.lastInsertRowid;
}

export async function updateCustomLink(id, userId, data) {
  const db = await initDb();
  const fields = Object.keys(data);
  const setClause = fields.map((f) => `"${f}" = ?`).join(", ");
  await db.execute({
    sql: `UPDATE custom_links SET ${setClause} WHERE id = ? AND user_id = ?`,
    args: [...Object.values(data), id, userId],
  });
}

export async function deleteCustomLink(id, userId) {
  const db = await initDb();
  await db.execute({
    sql: `DELETE FROM custom_links WHERE id = ? AND user_id = ?`,
    args: [id, userId],
  });
}

export async function reorderCustomLinks(userId, orderedIds) {
  const db = await initDb();
  for (let i = 0; i < orderedIds.length; i++) {
    await db.execute({
      sql: `UPDATE custom_links SET sort_order = ? WHERE id = ? AND user_id = ?`,
      args: [i, orderedIds[i], userId],
    });
  }
}

// ─── Appearance ───────────────────────────────────────────────────────────────

export async function getAppearance(userId) {
  const db = await initDb();
  const result = await db.execute({
    sql: `SELECT * FROM appearances WHERE user_id = ? LIMIT 1`,
    args: [userId],
  });
  return result.rows[0] ?? null;
}

export async function upsertAppearance(userId, data) {
  const db = await initDb();
  const existing = await getAppearance(userId);
  
  // Only include fields that we know exist in the table
  const allowedFields = [
    'theme', 'bg_color', 'bg_gradient', 'bg_image', 'button_style', 'button_shape', 
    'font', 'text_color', 'link_color', 'border_radius', 'custom_css'
  ];
  
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key))
  );
  
  if (existing) {
    const fields = Object.keys(filteredData);
    if (fields.length === 0) return; // Nothing to update
    
    const setClause = fields.map((f) => `"${f}" = ?`).join(", ");
    await db.execute({
      sql: `UPDATE appearances SET ${setClause}, updated_at = unixepoch() WHERE user_id = ?`,
      args: [...Object.values(filteredData), userId],
    });
  } else {
    const fields = ["user_id", ...Object.keys(filteredData)];
    const placeholders = fields.map(() => "?").join(", ");
    await db.execute({
      sql: `INSERT INTO appearances (${fields.join(", ")}) VALUES (${placeholders})`,
      args: [userId, ...Object.values(filteredData)],
    });
  }
}

// ─── GitHub Cache ─────────────────────────────────────────────────────────────

export async function getGithubCache(userId) {
  const db = await initDb();
  const result = await db.execute({
    sql: `SELECT * FROM github_cache WHERE user_id = ? LIMIT 1`,
    args: [userId],
  });
  return result.rows[0] ?? null;
}

export async function upsertGithubCache(userId, username, profileJson, reposJson, featured) {
  const db = await initDb();
  const existing = await getGithubCache(userId);
  if (existing) {
    await db.execute({
      sql: `UPDATE github_cache SET username = ?, profile_json = ?, repos_json = ?, featured = ?, cached_at = unixepoch() WHERE user_id = ?`,
      args: [username, profileJson, reposJson, featured ?? "[]", userId],
    });
  } else {
    await db.execute({
      sql: `INSERT INTO github_cache (user_id, username, profile_json, repos_json, featured, cached_at) VALUES (?, ?, ?, ?, ?, unixepoch())`,
      args: [userId, username, profileJson, reposJson, featured ?? "[]"],
    });
  }
}

export async function updateGithubFeatured(userId, featured) {
  const db = await initDb();
  await db.execute({
    sql: `UPDATE github_cache SET featured = ? WHERE user_id = ?`,
    args: [JSON.stringify(featured), userId],
  });
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function recordEvent(data) {
  const db = await initDb();
  const { user_id, type, link_id, link_title, visitor_id, country, device, browser, os, referrer } = data;
  await db.execute({
    sql: `INSERT INTO analytics_events (user_id, type, link_id, link_title, visitor_id, country, device, browser, os, referrer)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [user_id, type, link_id ?? null, link_title ?? null, visitor_id ?? null, country ?? null, device ?? null, browser ?? null, os ?? null, referrer ?? null],
  });
}

export async function getAnalyticsSummary(userId, since) {
  const db = await initDb();

  const [views, uniqueVisitors, clicks] = await Promise.all([
    db.execute({ sql: `SELECT COUNT(*) AS c FROM analytics_events WHERE user_id = ? AND type = 'view' AND ts >= ?`, args: [userId, since] }),
    db.execute({ sql: `SELECT COUNT(DISTINCT visitor_id) AS c FROM analytics_events WHERE user_id = ? AND type = 'view' AND ts >= ? AND visitor_id IS NOT NULL`, args: [userId, since] }),
    db.execute({ sql: `SELECT COUNT(*) AS c FROM analytics_events WHERE user_id = ? AND type = 'click' AND ts >= ?`, args: [userId, since] }),
  ]);

  const totalViews   = views.rows[0].c ?? 0;
  const totalUnique  = uniqueVisitors.rows[0].c ?? 0;
  const totalClicks  = clicks.rows[0].c ?? 0;
  const ctr          = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0";

  return { totalViews, totalUnique, totalClicks, ctr };
}

export async function getViewsOverTime(userId, since, days) {
  const db = await initDb();
  const result = await db.execute({
    sql: `SELECT date(ts, 'unixepoch') AS day, COUNT(*) AS count
          FROM analytics_events
          WHERE user_id = ? AND type = 'view' AND ts >= ?
          GROUP BY day ORDER BY day ASC`,
    args: [userId, since],
  });
  return result.rows;
}

export async function getClicksOverTime(userId, since) {
  const db = await initDb();
  const result = await db.execute({
    sql: `SELECT date(ts, 'unixepoch') AS day, COUNT(*) AS count
          FROM analytics_events
          WHERE user_id = ? AND type = 'click' AND ts >= ?
          GROUP BY day ORDER BY day ASC`,
    args: [userId, since],
  });
  return result.rows;
}

export async function getTopLinks(userId, since) {
  const db = await initDb();
  const result = await db.execute({
    sql: `SELECT link_title, COUNT(*) AS clicks
          FROM analytics_events
          WHERE user_id = ? AND type = 'click' AND ts >= ? AND link_title IS NOT NULL
          GROUP BY link_title ORDER BY clicks DESC LIMIT 10`,
    args: [userId, since],
  });
  return result.rows;
}

export async function getCountries(userId, since) {
  const db = await initDb();
  const result = await db.execute({
    sql: `SELECT country, COUNT(*) AS count
          FROM analytics_events
          WHERE user_id = ? AND type = 'view' AND ts >= ? AND country IS NOT NULL
          GROUP BY country ORDER BY count DESC LIMIT 10`,
    args: [userId, since],
  });
  return result.rows;
}

export async function getDevices(userId, since) {
  const db = await initDb();
  const result = await db.execute({
    sql: `SELECT device, COUNT(*) AS count
          FROM analytics_events
          WHERE user_id = ? AND ts >= ? AND device IS NOT NULL
          GROUP BY device ORDER BY count DESC`,
    args: [userId, since],
  });
  return result.rows;
}

export async function getReferrers(userId, since) {
  const db = await initDb();
  const result = await db.execute({
    sql: `SELECT referrer, COUNT(*) AS count
          FROM analytics_events
          WHERE user_id = ? AND ts >= ? AND referrer IS NOT NULL
          GROUP BY referrer ORDER BY count DESC LIMIT 10`,
    args: [userId, since],
  });
  return result.rows;
}
