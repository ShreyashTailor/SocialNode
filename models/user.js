import { initDb } from "@/lib/db";

const USER_FIELDS = [
  "name", "image", "email", "username", "bio", "youtube", "instagram", "facebook", "github",
  "snapchat", "twitter", "linkedin", "threads", "reddit", "stackoverflow", "leetcode",
  "codeforces", "hackerrank", "codechef", "geeksForGeeks", "twitch", "soundcloud", "spotify",
  "applemusic", "discord", "telegram", "whatsapp", "skype", "amazon", "shopify", "kofi",
  "buyMeACoffee", "patreon", "website", "blog", "phone", "accessKey", "github_username",
];
const PUBLIC_USER_FIELDS = ["id", ...USER_FIELDS.filter((f) => !["email", "accessKey", "phone"].includes(f))];
const LINK_FIELDS = ["title", "url", "description", "icon", "enabled", "sort_order", "scheduled", "start_at", "end_at"];
const APPEARANCE_FIELDS = ["theme", "bg_color", "bg_gradient", "bg_image", "button_style", "button_shape", "font", "text_color", "link_color", "border_radius"];

function quoteField(field, allowed) {
  if (!allowed.includes(field)) throw new Error("Invalid field.");
  return `"${field}"`;
}

export async function findUser(field, value) {
  const db = await initDb();
  const safeField = quoteField(field, USER_FIELDS);
  const result = await db.execute({ sql: `SELECT * FROM users WHERE ${safeField} = ? LIMIT 1`, args: [value] });
  return result.rows[0] ?? null;
}

export async function findUserByEmail(email) { return findUser("email", email); }
export async function findUserByUsername(username) { return findUser("username", username); }

export async function getPublicUserByUsername(username) {
  const db = await initDb();
  const result = await db.execute({
    sql: `SELECT ${PUBLIC_USER_FIELDS.map((f) => `"${f}"`).join(", ")} FROM users WHERE username = ? LIMIT 1`,
    args: [username],
  });
  return result.rows[0] ?? null;
}

export async function createUser(data) {
  const db = await initDb();
  const fields = Object.keys(data).filter((f) => USER_FIELDS.includes(f));
  if (!fields.length) throw new Error("No user data supplied.");
  const placeholders = fields.map(() => "?").join(", ");
  const result = await db.execute({
    sql: `INSERT INTO users (${fields.map((f) => `"${f}"`).join(", ")}) VALUES (${placeholders}) RETURNING id`,
    args: fields.map((f) => data[f]),
  });
  return result.rows[0]?.id;
}

export async function updateUserById(userId, data) {
  const db = await initDb();
  const fields = Object.keys(data).filter((f) => USER_FIELDS.includes(f) && f !== "id");
  if (!fields.length) return;
  const setClause = fields.map((f) => `"${f}" = ?`).join(", ");
  await db.execute({ sql: `UPDATE users SET ${setClause} WHERE id = ?`, args: [...fields.map((f) => data[f]), userId] });
}

export async function updateUser(email, data) {
  const user = await findUserByEmail(email);
  if (!user) return;
  return updateUserById(user.id, data);
}

export async function getCustomLinks(userId) {
  const db = await initDb();
  const result = await db.execute({ sql: `SELECT * FROM custom_links WHERE user_id = ? ORDER BY sort_order ASC, id ASC LIMIT 100`, args: [userId] });
  return result.rows;
}

export async function createCustomLink(data) {
  const db = await initDb();
  const result = await db.execute({
    sql: `INSERT INTO custom_links (user_id,title,url,description,icon,enabled,sort_order,scheduled,start_at,end_at)
          VALUES (?,?,?,?,?,?,?,?,?,?) RETURNING id`,
    args: [data.user_id, data.title, data.url, data.description ?? null, data.icon ?? "link", data.enabled ?? 1,
      data.sort_order ?? 0, data.scheduled ?? 0, data.start_at ?? null, data.end_at ?? null],
  });
  return result.rows[0]?.id;
}

export async function updateCustomLink(id, userId, data) {
  const db = await initDb();
  const fields = Object.keys(data).filter((f) => LINK_FIELDS.includes(f));
  if (!fields.length) return;
  const setClause = fields.map((f) => `"${f}" = ?`).join(", ");
  await db.execute({ sql: `UPDATE custom_links SET ${setClause} WHERE id = ? AND user_id = ?`, args: [...fields.map((f) => data[f]), id, userId] });
}

export async function deleteCustomLink(id, userId) {
  const db = await initDb();
  await db.execute({ sql: `DELETE FROM custom_links WHERE id = ? AND user_id = ?`, args: [id, userId] });
}

export async function reorderCustomLinks(userId, orderedIds) {
  const db = await initDb();
  const statements = orderedIds.map((id, i) => ({
    sql: `UPDATE custom_links SET sort_order = ? WHERE id = ? AND user_id = ?`,
    args: [i, id, userId],
  }));
  if (statements.length) await db.batch(statements, "write");
}

export async function getAppearance(userId) {
  const db = await initDb();
  const result = await db.execute({ sql: `SELECT * FROM appearances WHERE user_id = ? LIMIT 1`, args: [userId] });
  return result.rows[0] ?? null;
}

export async function upsertAppearance(userId, data) {
  const db = await initDb();
  const fields = Object.keys(data).filter((f) => APPEARANCE_FIELDS.includes(f));
  if (!fields.length) return;
  const columns = ["user_id", ...fields];
  const placeholders = columns.map(() => "?").join(", ");
  const updates = fields.map((f) => `"${f}" = excluded."${f}"`).join(", ");
  await db.execute({
    sql: `INSERT INTO appearances (${columns.map((f) => `"${f}"`).join(", ")}) VALUES (${placeholders})
          ON CONFLICT(user_id) DO UPDATE SET ${updates}, updated_at = unixepoch()`,
    args: [userId, ...fields.map((f) => data[f])],
  });
}

export async function getGithubCache(userId) {
  const db = await initDb();
  const result = await db.execute({ sql: `SELECT * FROM github_cache WHERE user_id = ? LIMIT 1`, args: [userId] });
  return result.rows[0] ?? null;
}

export async function upsertGithubCache(userId, username, profileJson, reposJson, featured = "[]") {
  const db = await initDb();
  await db.execute({
    sql: `INSERT INTO github_cache (user_id,username,profile_json,repos_json,featured,cached_at)
          VALUES (?,?,?,?,?,unixepoch())
          ON CONFLICT(user_id) DO UPDATE SET username=excluded.username, profile_json=excluded.profile_json,
          repos_json=excluded.repos_json, featured=excluded.featured, cached_at=unixepoch()`,
    args: [userId, username, profileJson, reposJson, featured],
  });
}

export async function updateGithubFeatured(userId, featured) {
  const db = await initDb();
  await db.execute({ sql: `UPDATE github_cache SET featured = ? WHERE user_id = ?`, args: [JSON.stringify(featured), userId] });
}

export async function recordEvent(data) {
  const db = await initDb();
  await db.execute({
    sql: `INSERT INTO analytics_events (user_id,type,link_id,link_title,visitor_id,country,device,browser,os,referrer)
          VALUES (?,?,?,?,?,?,?,?,?,?)`,
    args: [data.user_id, data.type, data.link_id ?? null, data.link_title ?? null, data.visitor_id ?? null,
      data.country ?? null, data.device ?? null, data.browser ?? null, data.os ?? null, data.referrer ?? null],
  });
}

export async function getAnalyticsSummary(userId, since) {
  const db = await initDb();
  const result = await db.execute({
    sql: `SELECT
      SUM(CASE WHEN type='view' THEN 1 ELSE 0 END) AS views,
      COUNT(DISTINCT CASE WHEN type='view' THEN visitor_id END) AS unique_visitors,
      SUM(CASE WHEN type='click' THEN 1 ELSE 0 END) AS clicks
      FROM analytics_events WHERE user_id = ? AND ts >= ?`,
    args: [userId, since],
  });
  const row = result.rows[0] || {};
  const totalViews = Number(row.views || 0);
  const totalUnique = Number(row.unique_visitors || 0);
  const totalClicks = Number(row.clicks || 0);
  return { totalViews, totalUnique, totalClicks, ctr: totalViews ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0" };
}

export async function getViewsOverTime(userId, since) {
  const db = await initDb();
  const result = await db.execute({ sql: `SELECT date(ts,'unixepoch') AS day, COUNT(*) AS count FROM analytics_events WHERE user_id=? AND type='view' AND ts>=? GROUP BY day ORDER BY day ASC`, args: [userId, since] });
  return result.rows;
}
export async function getClicksOverTime(userId, since) {
  const db = await initDb();
  const result = await db.execute({ sql: `SELECT date(ts,'unixepoch') AS day, COUNT(*) AS count FROM analytics_events WHERE user_id=? AND type='click' AND ts>=? GROUP BY day ORDER BY day ASC`, args: [userId, since] });
  return result.rows;
}
export async function getTopLinks(userId, since) {
  const db = await initDb();
  const result = await db.execute({ sql: `SELECT link_title, COUNT(*) AS clicks FROM analytics_events WHERE user_id=? AND type='click' AND ts>=? AND link_title IS NOT NULL GROUP BY link_title ORDER BY clicks DESC LIMIT 10`, args: [userId, since] });
  return result.rows;
}
export async function getCountries(userId, since) {
  const db = await initDb();
  const result = await db.execute({ sql: `SELECT country, COUNT(*) AS count FROM analytics_events WHERE user_id=? AND type='view' AND ts>=? AND country IS NOT NULL GROUP BY country ORDER BY count DESC LIMIT 10`, args: [userId, since] });
  return result.rows;
}
export async function getDevices(userId, since) {
  const db = await initDb();
  const result = await db.execute({ sql: `SELECT device, COUNT(*) AS count FROM analytics_events WHERE user_id=? AND ts>=? AND device IS NOT NULL GROUP BY device ORDER BY count DESC`, args: [userId, since] });
  return result.rows;
}
export async function getReferrers(userId, since) {
  const db = await initDb();
  const result = await db.execute({ sql: `SELECT referrer, COUNT(*) AS count FROM analytics_events WHERE user_id=? AND ts>=? AND referrer IS NOT NULL GROUP BY referrer ORDER BY count DESC LIMIT 10`, args: [userId, since] });
  return result.rows;
}
