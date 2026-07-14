import {
  ExternalLink,
  GitBranch,
  GitCommitHorizontal,
  GitPullRequest,
  RefreshCcw,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface GitHubActivityProps {
  username: string;
  profileUrl: string;
}

interface GitHubCommit {
  sha: string;
  message: string;
  url: string;
  author?: {
    name?: string;
  };
}

interface GitHubPushEvent {
  id: string;
  type: "PushEvent";
  created_at: string;
  repo: {
    name: string;
  };
  payload: {
    commits?: GitHubCommit[];
    ref?: string;
    head?: string;
    before?: string;
  };
}

interface CommitActivity {
  id: string;
  sha: string;
  message: string;
  repo: string;
  branch: string;
  pushedAt: string;
  href: string;
}

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

type LoadState = "idle" | "loading" | "success" | "error";

const maxVisibleCommits = 5;
const maxCompareRequests = 5;
const recentCalendarDays = 90;
const calendarFetchTimeoutMs = 6000;
const contributionColors = [
  "bg-white/[0.06] border-white/[0.08]",
  "bg-[oklch(0.78_0.16_290/0.34)] border-[oklch(0.78_0.16_290/0.2)]",
  "bg-[oklch(0.74_0.17_290/0.58)] border-[oklch(0.74_0.17_290/0.24)]",
  "bg-[oklch(0.68_0.18_290/0.82)] border-[oklch(0.68_0.18_290/0.28)]",
  "bg-[oklch(0.58_0.19_290)] border-[oklch(0.58_0.19_290)]",
] as const;

interface GitHubCompareCommit {
  sha: string;
  html_url?: string;
  commit: {
    message: string;
  };
}

interface GitHubCompareResponse {
  commits?: GitHubCompareCommit[];
}

interface ContributionApiDay {
  date: string;
  count: number;
  level?: number;
}

interface ContributionApiResponse {
  contributions?: ContributionApiDay[];
  total?: {
    lastYear?: number;
  };
}

interface GitHubActivityApiResponse {
  commits?: CommitActivity[];
  fetchedAt?: string;
}

function isPushEvent(event: { type?: string }): event is GitHubPushEvent {
  return event.type === "PushEvent";
}

function getCommitTitle(message: string) {
  return message.split("\n")[0]?.trim() || "Untitled commit";
}

function getBranchName(ref?: string) {
  return ref?.replace("refs/heads/", "") || "main";
}

function getCommitHref(repo: string, sha: string) {
  return `https://github.com/${repo}/commit/${sha}`;
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getContributionLevel(count: number) {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

function normalizeContributionDay(day: ContributionApiDay): ContributionDay {
  return {
    date: day.date,
    count: day.count,
    level: Math.min(4, Math.max(0, day.level ?? getContributionLevel(day.count))),
  };
}

function buildRecentContributionCalendar(source: ContributionDay[] = []) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(today.getDate() - (recentCalendarDays - 1));

  const sourceByDate = new Map(source.map((day) => [day.date, day]));
  const days: ContributionDay[] = [];

  for (const cursor = new Date(start); cursor <= today; cursor.setDate(cursor.getDate() + 1)) {
    const date = formatDateKey(cursor);
    days.push(sourceByDate.get(date) ?? { date, count: 0, level: 0 });
  }

  return days;
}

function buildMonthLabels(days: ContributionDay[]) {
  return days.reduce<Array<{ month: string; column: number }>>((labels, day, index) => {
    const date = new Date(`${day.date}T00:00:00`);
    if (date.getDate() !== 1) return labels;

    labels.push({
      month: date.toLocaleString("en", { month: "short" }),
      column: Math.floor(index / 7) + 1,
    });

    return labels;
  }, []);
}

function buildCalendarFromEvents(events: Array<{ type?: string; created_at?: string }>) {
  const counts = new Map<string, number>();

  for (const event of events) {
    if (!event.created_at || event.type !== "PushEvent") continue;
    const date = event.created_at.slice(0, 10);
    counts.set(date, (counts.get(date) ?? 0) + 1);
  }

  return buildRecentContributionCalendar(
    Array.from(counts, ([date, count]) => ({
      date,
      count,
      level: getContributionLevel(count),
    })),
  );
}

async function fetchContributionCalendar(username: string) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), calendarFetchTimeoutMs);

  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { signal: controller.signal },
    );

    if (!response.ok) {
      throw new Error("Contribution calendar is temporarily unavailable.");
    }

    const data = (await response.json()) as ContributionApiResponse;
    const contributions = data.contributions?.map(normalizeContributionDay) ?? [];
    const days = buildRecentContributionCalendar(contributions);

    return {
      days,
      total: days.reduce((sum, day) => sum + day.count, 0),
    };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function fetchLiveCommitsFromApi(username: string) {
  const response = await fetch(
    `/api/github-activity?username=${encodeURIComponent(username)}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Portfolio GitHub activity endpoint is unavailable.");
  }

  const data = (await response.json()) as GitHubActivityApiResponse;

  return {
    commits: (data.commits ?? []).slice(0, maxVisibleCommits),
    fetchedAt: data.fetchedAt ? new Date(data.fetchedAt) : new Date(),
  };
}

async function getComparedCommits(event: GitHubPushEvent) {
  const { before, head } = event.payload;

  if (!before || !head || /^0+$/.test(before)) {
    return [];
  }

  const response = await fetch(
    `https://api.github.com/repos/${event.repo.name}/compare/${before}...${head}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!response.ok) {
    return [];
  }

  const data = (await response.json()) as GitHubCompareResponse;

  return (data.commits ?? []).map((commit) => ({
    id: `${event.repo.name}-${commit.sha}`,
    sha: commit.sha,
    message: getCommitTitle(commit.commit.message),
    repo: event.repo.name,
    branch: getBranchName(event.payload.ref),
    pushedAt: event.created_at,
    href: commit.html_url ?? getCommitHref(event.repo.name, commit.sha),
  }));
}

async function getCommitsFromEvent(event: GitHubPushEvent) {
  const branch = getBranchName(event.payload.ref);
  const directCommits = event.payload.commits ?? [];

  if (directCommits.length > 0) {
    return directCommits.map((commit) => ({
      id: `${event.repo.name}-${commit.sha}`,
      sha: commit.sha,
      message: getCommitTitle(commit.message),
      repo: event.repo.name,
      branch,
      pushedAt: event.created_at,
      href: getCommitHref(event.repo.name, commit.sha),
    }));
  }

  const comparedCommits = await getComparedCommits(event);
  if (comparedCommits.length > 0) return comparedCommits;

  if (!event.payload.head) return [];

  return [
    {
      id: `${event.repo.name}-${event.payload.head}`,
      sha: event.payload.head,
      message: `Push to ${branch}`,
      repo: event.repo.name,
      branch,
      pushedAt: event.created_at,
      href: getCommitHref(event.repo.name, event.payload.head),
    },
  ];
}

function formatRelativeTime(value: string) {
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const deltaSeconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const divisions = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
  ] as const;

  let duration = deltaSeconds;
  for (const division of divisions) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return formatter.format(Math.round(duration), "year");
}

function formatFetchedAt(value: Date | null) {
  if (!value) return "Not synced yet";
  return `Synced ${value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function formatSelectedDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function GitHubActivity({ username, profileUrl }: GitHubActivityProps) {
  const [commits, setCommits] = useState<CommitActivity[]>([]);
  const [contributionDays, setContributionDays] = useState<ContributionDay[]>(() =>
    buildRecentContributionCalendar(),
  );
  const [contributionTotal, setContributionTotal] = useState(0);
  const [status, setStatus] = useState<LoadState>("idle");
  const [calendarStatus, setCalendarStatus] = useState<LoadState>("idle");
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);
  const fullCalendarLoadedRef = useRef(false);

  const visibleCommits = useMemo(
    () => commits.slice(0, maxVisibleCommits),
    [commits],
  );
  const monthLabels = useMemo(
    () => buildMonthLabels(contributionDays),
    [contributionDays],
  );
  const weekCount = Math.ceil(contributionDays.length / 7);

  const fetchActivity = useCallback(async () => {
    setStatus("loading");
    setCalendarStatus((current) => (current === "success" ? current : "loading"));

    try {
      const apiActivity = await fetchLiveCommitsFromApi(username);

      setCommits(apiActivity.commits);
      setFetchedAt(apiActivity.fetchedAt);
      setStatus("success");
      return;
    } catch {
      // Static hosting fallback: use the public GitHub API directly when available.
    }

    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/events/public?per_page=100`,
        {
          headers: {
            Accept: "application/vnd.github+json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("GitHub activity request failed.");
      }

      const events = (await response.json()) as Array<{ type?: string }>;
      const seen = new Set<string>();

      if (!fullCalendarLoadedRef.current) {
        const fallbackDays = buildCalendarFromEvents(events);
        setContributionTotal(fallbackDays.reduce((sum, day) => sum + day.count, 0));
        setCalendarStatus("success");
        setContributionDays(fallbackDays);
        setSelectedDay((current) => current ?? fallbackDays.at(-1) ?? null);
      }

      const pushEvents = events
        .filter(isPushEvent)
        .slice(0, maxCompareRequests);

      const nextCommits = (await Promise.all(pushEvents.map(getCommitsFromEvent)))
        .flat()
        .filter((commit) => {
          if (seen.has(commit.id)) return false;
          seen.add(commit.id);
          return true;
        })
        .sort(
          (a, b) =>
            new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime(),
        )
        .slice(0, maxVisibleCommits);

      setCommits(nextCommits);
      setFetchedAt(new Date());
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, [username]);

  const fetchCalendar = useCallback(async () => {
    setCalendarStatus("loading");

    try {
      const nextCalendar = await fetchContributionCalendar(username);
      fullCalendarLoadedRef.current = true;
      setContributionDays(nextCalendar.days);
      setContributionTotal(nextCalendar.total);
      setSelectedDay((current) => {
        if (current) {
          return nextCalendar.days.find((day) => day.date === current.date) ?? current;
        }

        return nextCalendar.days.at(-1) ?? null;
      });
      setCalendarStatus("success");
    } catch {
      setCalendarStatus((current) => (current === "success" ? current : "error"));
    }
  }, [username]);

  useEffect(() => {
    void fetchActivity();
    void fetchCalendar();
  }, [fetchActivity, fetchCalendar]);

  const refreshAll = useCallback(() => {
    void fetchActivity();
    void fetchCalendar();
  }, [fetchActivity, fetchCalendar]);

  return (
    <div className="hud-frame glass rounded-3xl p-5 sm:p-7">
      <div className="flex flex-col gap-5 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--accent-soft)] text-[var(--accent)]">
            <GitPullRequest className="h-6 w-6" aria-hidden />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold uppercase tracking-widest text-[var(--ink-faint)]">
                Live GitHub commits
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.81_0.15_290_/0.3)] bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                Live
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)]">
              Latest public commits from @{username}, refreshed directly from
              GitHub when the public activity feed is available.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-black/20 px-3 text-sm font-semibold text-[var(--ink-soft)] transition hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
          >
            Profile
            <ExternalLink className="h-4 w-4" aria-hidden />
          </a>
          <button
            type="button"
            onClick={refreshAll}
            disabled={status === "loading" || calendarStatus === "loading"}
            className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[oklch(0.81_0.15_290_/0.26)] bg-[var(--accent-soft)] px-3 text-sm font-semibold text-[var(--accent)] transition hover:border-[oklch(0.81_0.15_290_/0.46)] hover:bg-[oklch(0.7_0.15_290_/0.18)] disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCcw
              className={`h-4 w-4 ${
                status === "loading" || calendarStatus === "loading" ? "animate-spin" : ""
              }`}
              aria-hidden
            />
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--ink-faint)]">
          {status === "loading"
            ? "Syncing GitHub activity..."
            : formatFetchedAt(fetchedAt)}
        </p>
        <p className="text-sm font-semibold text-[var(--ink)]">
          {contributionTotal.toLocaleString()} commit
          {contributionTotal === 1 ? "" : "s"} in the last 3 months
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-[var(--line)] bg-black/20 p-4 sm:p-5">
        <div className="overflow-x-auto pb-2">
          <div
            className="min-w-[30rem]"
            style={{
              width: `calc(${weekCount} * 0.875rem + 3.5rem)`,
            }}
          >
            <div
              className="mb-2 ml-14 grid h-4 text-xs text-[var(--ink-faint)]"
              style={{
                gridTemplateColumns: `repeat(${weekCount}, 0.875rem)`,
                columnGap: "0.25rem",
              }}
              aria-hidden
            >
              {monthLabels.map((label) => (
                <span
                  key={`${label.month}-${label.column}`}
                  style={{ gridColumnStart: label.column }}
                >
                  {label.month}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <div className="grid w-12 grid-rows-7 gap-1 text-right text-xs text-[var(--ink-faint)]">
                <span />
                <span>Mon</span>
                <span />
                <span>Wed</span>
                <span />
                <span>Fri</span>
                <span />
              </div>

              <div
                className="grid grid-flow-col grid-rows-7 gap-1"
                style={{
                  gridTemplateColumns: `repeat(${weekCount}, 0.875rem)`,
                }}
                aria-label="GitHub contribution calendar"
              >
                {contributionDays.map((day) => (
                  <button
                    type="button"
                    key={day.date}
                    title={`${day.count} commit${day.count === 1 ? "" : "s"} on ${day.date}`}
                    aria-label={`${day.count} commit${day.count === 1 ? "" : "s"} on ${day.date}`}
                    aria-pressed={selectedDay?.date === day.date}
                    onClick={() => setSelectedDay(day)}
                    className={`focus-ring h-3.5 w-3.5 rounded-[0.2rem] border transition hover:scale-125 hover:border-[var(--accent)] ${
                      selectedDay?.date === day.date
                        ? "ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-black"
                        : ""
                    } ${contributionColors[day.level]}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--ink-faint)]">
          <span>
            {calendarStatus === "loading"
              ? "Loading last-3-month graph..."
              : "Last 3 months"}
          </span>
          <div className="flex items-center gap-2">
            <span>Less</span>
            <span className={`h-3 w-3 rounded-[0.18rem] border ${contributionColors[0]}`} />
            <span className={`h-3 w-3 rounded-[0.18rem] border ${contributionColors[1]}`} />
            <span className={`h-3 w-3 rounded-[0.18rem] border ${contributionColors[2]}`} />
            <span className={`h-3 w-3 rounded-[0.18rem] border ${contributionColors[3]}`} />
            <span className={`h-3 w-3 rounded-[0.18rem] border ${contributionColors[4]}`} />
            <span>More</span>
          </div>
        </div>

        {selectedDay ? (
          <div className="mt-4 rounded-xl border border-[var(--line)] bg-black/25 px-4 py-3 text-sm text-[var(--ink-soft)]">
            <span className="font-semibold text-[var(--ink)]">
              {selectedDay.count} commit{selectedDay.count === 1 ? "" : "s"}
            </span>{" "}
            on {formatSelectedDate(selectedDay.date)}
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold uppercase tracking-widest text-[var(--ink-faint)]">
          Latest commits
        </p>
        <p className="text-sm font-medium text-[var(--ink-soft)]">
          Last {maxVisibleCommits} live commits
        </p>
      </div>

      {status === "loading" && commits.length === 0 ? (
        <div className="mt-5 grid gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-2xl border border-[var(--line)] bg-white/[0.04]"
            />
          ))}
        </div>
      ) : null}

      {status === "error" ? (
        <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <p className="font-medium text-[var(--ink)]">
            Unable to load GitHub activity.
          </p>
          <p className="mt-2 text-sm text-[var(--ink-faint)]">
            GitHub&apos;s public API is temporarily unavailable or rate-limited. Try refreshing in a moment.
          </p>
          <button
            type="button"
            onClick={refreshAll}
            className="focus-ring mt-3 inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] bg-black/25 px-3 py-2 text-xs font-semibold text-[var(--ink-soft)] transition hover:text-[var(--ink)]"
          >
            <RefreshCcw className="h-3.5 w-3.5" aria-hidden />
            Try again
          </button>
        </div>
      ) : null}

      {status !== "loading" && status !== "error" && commits.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-[var(--line)] bg-black/20 p-5">
          <p className="font-medium text-[var(--ink)]">
            Waiting for live public commit events.
          </p>
          <p className="mt-2 text-sm text-[var(--ink-faint)]">
            New public pushes will appear here automatically after GitHub
            publishes them in the activity feed.
          </p>
        </div>
      ) : null}

      {visibleCommits.length ? (
        <ol className="mt-5 grid gap-3">
          {visibleCommits.map((commit) => (
            <li key={commit.id}>
              <a
                href={commit.href}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring group grid gap-3 rounded-2xl border border-[var(--line)] bg-black/20 p-4 transition hover:border-[oklch(0.81_0.15_290_/0.32)] hover:bg-white/[0.05] sm:grid-cols-[1fr_auto]"
              >
                <span className="flex min-w-0 items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] bg-black/20 text-[var(--accent)]">
                    <GitCommitHorizontal className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-[var(--ink)] group-hover:text-[var(--accent)]">
                      {commit.message}
                    </span>
                    <span className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--ink-faint)]">
                      <span>{commit.repo}</span>
                      <span aria-hidden>·</span>
                      <span className="inline-flex items-center gap-1">
                        <GitBranch className="h-3.5 w-3.5" aria-hidden />
                        {commit.branch}
                      </span>
                      <span aria-hidden>·</span>
                      <span>{commit.sha.slice(0, 7)}</span>
                    </span>
                  </span>
                </span>
                <span className="flex items-center justify-between gap-3 pl-12 text-xs font-medium text-[var(--ink-faint)] sm:justify-end sm:pl-0">
                  <time dateTime={commit.pushedAt}>
                    {formatRelativeTime(commit.pushedAt)}
                  </time>
                  <ExternalLink
                    className="h-4 w-4 opacity-70 transition group-hover:text-[var(--accent)] group-hover:opacity-100"
                    aria-hidden
                  />
                </span>
              </a>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
