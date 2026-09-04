import { SITE } from "./config";

/**
 * Real GitHub activity, fetched on the server and revalidated hourly.
 *
 * A full year of contributions is only exposed two ways: the GraphQL API
 * (needs a token) and the public contribution calendar GitHub renders on every
 * profile. We try the first, fall back to the second, and return null if
 * neither answers — an empty widget beats an invented one.
 */

const API = "https://api.github.com";

function headers(): HeadersInit {
  return {
    accept: "application/vnd.github+json",
    "user-agent": "portfolio-von-sanjeev",
    ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
  };
}

export interface ContributionDay {
  date: string;
  count: number;
  /** 0–4, matching GitHub's own intensity buckets. */
  level: number;
}

export interface GitHubStats {
  repoCount: number;
  /** One year of daily contributions, oldest first. */
  year: ContributionDay[];
  totalYear: number;
  bestDay: number;
  currentStreak: number;
  longestStreak: number;
  languages: { name: string; count: number }[];
  lastPush: { repo: string; at: string } | null;
}

interface GhUser {
  public_repos: number;
}
interface GhRepo {
  language: string | null;
  fork: boolean;
}
interface GhEvent {
  type: string;
  created_at: string;
  repo: { name: string };
}

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { headers: headers(), next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/* ── Year of contributions ──────────────────────────────────────────────── */

/** Official path — exact counts, but only with a token in the environment. */
async function yearFromGraphQL(user: string): Promise<ContributionDay[] | null> {
  if (!process.env.GITHUB_TOKEN) return null;

  const query = `query($login:String!){
    user(login:$login){
      contributionsCollection{
        contributionCalendar{
          weeks{ contributionDays{ date contributionCount } }
        }
      }
    }
  }`;

  try {
    const res = await fetch(`${API}/graphql`, {
      method: "POST",
      headers: { ...headers(), "content-type": "application/json" },
      body: JSON.stringify({ query, variables: { login: user } }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: {
              weeks?: { contributionDays?: { date: string; contributionCount: number }[] }[];
            };
          };
        };
      };
    };

    const weeks = json.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
    if (!weeks?.length) return null;

    return weeks
      .flatMap((w) => w.contributionDays ?? [])
      .map((d) => ({ date: d.date, count: d.contributionCount, level: bucket(d.contributionCount) }));
  } catch {
    return null;
  }
}

/**
 * Fallback — the same calendar GitHub renders publicly on a profile page.
 * Each day is a <td data-date data-level>, with the count in a matching
 * <tool-tip>. Levels alone are enough to draw the graph if the tooltips move.
 */
async function yearFromPublicCalendar(user: string): Promise<ContributionDay[] | null> {
  try {
    const res = await fetch(`https://github.com/users/${user}/contributions`, {
      headers: { "user-agent": "portfolio-von-sanjeev", accept: "text/html" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // id -> count, read from the tooltips.
    const counts = new Map<string, number>();
    for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
      const text = m[2].trim();
      counts.set(m[1], text.startsWith("No") ? 0 : parseInt(text, 10) || 0);
    }

    const days: ContributionDay[] = [];
    for (const m of html.matchAll(/<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g)) {
      const tag = m[0];
      const date = /data-date="([^"]+)"/.exec(tag)?.[1];
      if (!date) continue;
      const level = Number(/data-level="(\d+)"/.exec(tag)?.[1] ?? 0);
      const id = /\sid="([^"]+)"/.exec(tag)?.[1];
      const count = (id ? counts.get(id) : undefined) ?? (level > 0 ? level : 0);
      days.push({ date, count, level });
    }

    if (days.length < 300) return null;
    days.sort((a, b) => a.date.localeCompare(b.date));
    return days;
  } catch {
    return null;
  }
}

function bucket(count: number) {
  if (count === 0) return 0;
  if (count < 3) return 1;
  if (count < 6) return 2;
  if (count < 10) return 3;
  return 4;
}

function streaks(days: ContributionDay[]) {
  let longest = 0;
  let running = 0;
  for (const d of days) {
    running = d.count > 0 ? running + 1 : 0;
    if (running > longest) longest = running;
  }
  // Current streak counts back from the most recent day with activity.
  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) current++;
    else if (current > 0 || i < days.length - 1) break;
  }
  return { longest, current };
}

export async function getGitHubStats(): Promise<GitHubStats | null> {
  const user = SITE.githubUser;

  const [profile, repos, events, graphql] = await Promise.all([
    getJson<GhUser>(`/users/${user}`),
    getJson<GhRepo[]>(`/users/${user}/repos?sort=pushed&per_page=100`),
    getJson<GhEvent[]>(`/users/${user}/events/public?per_page=30`),
    yearFromGraphQL(user),
  ]);

  const year = graphql ?? (await yearFromPublicCalendar(user));
  if (!profile && !year) return null;

  const langCount = new Map<string, number>();
  for (const r of repos ?? []) {
    if (r.fork || !r.language) continue;
    langCount.set(r.language, (langCount.get(r.language) ?? 0) + 1);
  }

  const push = (events ?? []).find((e) => e.type === "PushEvent");
  const days = year ?? [];
  const { longest, current } = streaks(days);

  return {
    repoCount: profile?.public_repos ?? 0,
    year: days,
    totalYear: days.reduce((n, d) => n + d.count, 0),
    bestDay: days.reduce((n, d) => Math.max(n, d.count), 0),
    currentStreak: current,
    longestStreak: longest,
    languages: [...langCount.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
    lastPush: push
      ? { repo: push.repo.name.split("/").pop() ?? push.repo.name, at: push.created_at }
      : null,
  };
}
