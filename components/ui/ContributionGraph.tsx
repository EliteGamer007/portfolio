import type { GitHubStats } from "@/lib/github";
import { SITE } from "@/lib/config";

const LEVEL_COLOR = [
  "rgba(140,165,220,0.10)",
  "rgba(116,160,255,0.30)",
  "rgba(116,160,255,0.50)",
  "rgba(116,160,255,0.72)",
  "rgba(157,188,255,0.95)",
];

function relative(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  return `${months}mo ago`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ContributionGraph({ stats }: { stats: GitHubStats | null }) {
  // No data means no widget — never a fabricated one.
  if (!stats || stats.year.length === 0) return null;

  // Pad to a whole week so columns line up with the weekday grid.
  const days = stats.year;
  const lead = new Date(days[0].date).getDay();
  const cells: (typeof days)[number][] = [
    ...Array.from({ length: lead }, () => ({ date: "", count: -1, level: -1 })),
    ...days,
  ];

  const weeks: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  // A month label at each column where the month first appears.
  const monthLabels = weeks.map((w, i) => {
    const first = w.find((d) => d.date);
    if (!first) return null;
    const d = new Date(first.date);
    const prev = i > 0 ? weeks[i - 1].find((x) => x.date) : null;
    if (prev && new Date(prev.date).getMonth() === d.getMonth()) return null;
    return { col: i, label: MONTHS[d.getMonth()] };
  });

  const stat = [
    { k: "contributions", v: stats.totalYear },
    { k: "best day", v: stats.bestDay },
    { k: "longest streak", v: stats.longestStreak },
    { k: "public repos", v: stats.repoCount },
  ];

  return (
    <div className="card p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="eyebrow">Commits · past year</p>
        <a
          href={SITE.github}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline font-mono text-[11px]"
        >
          @{SITE.githubUser}
        </a>
      </div>

      {/* The calendar scrolls sideways on narrow screens instead of shrinking
          the cells into mush. */}
      <div data-own-scroll className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="min-w-[430px]">
          <div className="mb-1 flex gap-[3px]">
            {monthLabels.map((m, i) => (
              <span
                key={i}
                className="font-mono text-[8.5px]"
                style={{ width: 7, color: "var(--color-paper-mute)", whiteSpace: "nowrap" }}
              >
                {m?.label ?? ""}
              </span>
            ))}
          </div>

          <div
            className="flex gap-[3px]"
            role="img"
            aria-label={`${stats.totalYear} contributions in the past year`}
          >
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.map((d, di) => (
                  <div
                    key={di}
                    title={d.date ? `${d.date} — ${d.count} commit${d.count === 1 ? "" : "s"}` : ""}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 1.5,
                      background: d.level < 0 ? "transparent" : LEVEL_COLOR[d.level],
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        {stat.map((s) => (
          <div key={s.k}>
            <dd className="font-mono text-[17px] font-medium" style={{ color: "var(--color-azure-300)" }}>
              {s.v}
            </dd>
            <dt className="eyebrow mt-0.5">{s.k}</dt>
          </div>
        ))}
      </dl>

      {(stats.languages.length > 0 || stats.lastPush) && (
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          {stats.languages.map((l) => (
            <span key={l.name} className="chip">
              {l.name}
            </span>
          ))}
          {stats.lastPush && (
            <span className="eyebrow ml-auto whitespace-nowrap">
              {stats.lastPush.repo} · {relative(stats.lastPush.at)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
