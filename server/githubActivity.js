const maxVisibleCommits = 5;
const maxPushEventsToInspect = 12;
const defaultFallbackRepos = [
  "AhamedAAHA/neuroloom",
  "AhamedAAHA/Aria",
  "AhamedAAHA/kagent",
  "AhamedAAHA/AdGPT",
  "AhamedAAHA/CyanideX",
  "AhamedAAHA/Suzie",
  "AhamedAAHA/DeeBug",
  "AhamedAAHA/Portfolio",
  "AhamedAAHA/Sentra-AI",
  "AhamedAAHA/SmartStudyCompanionAAHA",
  "AhamedAAHA/Lumora",
  "AhamedAAHA/GestureMed",
  "AhamedAAHA/RailLink",
];

function githubHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "aaha-portfolio",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

function getCommitTitle(message) {
  return message.split("\n")[0]?.trim() || "Untitled commit";
}

function getBranchName(ref) {
  return ref?.replace("refs/heads/", "") || "main";
}

function getCommitHref(repo, sha) {
  return `https://github.com/${repo}/commit/${sha}`;
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function getFallbackRepos(username) {
  const configuredRepos = process.env.GITHUB_ACTIVITY_REPOS?.split(",")
    .map((repo) => repo.trim())
    .filter(Boolean);

  if (configuredRepos?.length) return configuredRepos;

  return defaultFallbackRepos.filter((repo) => repo.startsWith(`${username}/`));
}

function parseAtomCommits(repo, xml) {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

  return entries.map((entry) => {
    const title = entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "Untitled commit";
    const updated = entry.match(/<updated>([\s\S]*?)<\/updated>/)?.[1] ?? new Date().toISOString();
    const href = entry.match(/<link[^>]+href="([^"]+)"/)?.[1] ?? `https://github.com/${repo}/commits`;
    const sha = href.match(/\/commit\/([a-f0-9]+)/i)?.[1] ?? href;

    return {
      id: `${repo}-${sha}`,
      sha,
      message: getCommitTitle(decodeXml(title)),
      repo,
      branch: "default",
      pushedAt: updated,
      href,
    };
  });
}

async function fetchAtomCommits(repo) {
  const response = await fetch(`https://github.com/${repo}/commits.atom`, {
    headers: {
      "User-Agent": "aaha-portfolio",
      Accept: "application/atom+xml, application/xml, text/xml",
    },
  });

  if (!response.ok) return [];

  return parseAtomCommits(repo, await response.text());
}

async function getFallbackCommits(username) {
  const repoCommits = await Promise.all(
    getFallbackRepos(username).map((repo) =>
      fetchAtomCommits(repo).catch(() => []),
    ),
  );
  const seen = new Set();

  return repoCommits
    .flat()
    .filter((commit) => {
      if (seen.has(commit.id)) return false;
      seen.add(commit.id);
      return true;
    })
    .sort((a, b) => new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime())
    .slice(0, maxVisibleCommits);
}

function normalizeCommit(event, commit) {
  return {
    id: `${event.repo.name}-${commit.sha}`,
    sha: commit.sha,
    message: getCommitTitle(commit.message),
    repo: event.repo.name,
    branch: getBranchName(event.payload.ref),
    pushedAt: event.created_at,
    href: getCommitHref(event.repo.name, commit.sha),
  };
}

async function getComparedCommits(event) {
  const { before, head } = event.payload;

  if (!before || !head || /^0+$/.test(before)) {
    return [];
  }

  const response = await fetch(
    `https://api.github.com/repos/${event.repo.name}/compare/${before}...${head}`,
    { headers: githubHeaders() },
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

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

async function getCommitsFromEvent(event) {
  const directCommits = event.payload.commits ?? [];

  if (directCommits.length > 0) {
    return directCommits.map((commit) => normalizeCommit(event, commit));
  }

  const comparedCommits = await getComparedCommits(event);
  if (comparedCommits.length > 0) return comparedCommits;

  if (!event.payload.head) return [];

  return [
    {
      id: `${event.repo.name}-${event.payload.head}`,
      sha: event.payload.head,
      message: `Push to ${getBranchName(event.payload.ref)}`,
      repo: event.repo.name,
      branch: getBranchName(event.payload.ref),
      pushedAt: event.created_at,
      href: getCommitHref(event.repo.name, event.payload.head),
    },
  ];
}

export async function getGitHubActivity(username) {
  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100`,
    { headers: githubHeaders() },
  );

  if (!response.ok) {
    const error = new Error("GitHub activity request failed.");
    error.status = response.status;
    throw error;
  }

  const events = await response.json();
  const seen = new Set();
  const pushEvents = events
    .filter((event) => event.type === "PushEvent")
    .slice(0, maxPushEventsToInspect);
  const commits = [];

  for (const event of pushEvents) {
    const eventCommits = await getCommitsFromEvent(event);

    for (const commit of eventCommits) {
      if (seen.has(commit.id)) continue;
      seen.add(commit.id);
      commits.push(commit);

      if (commits.length >= maxVisibleCommits) {
        return commits.sort(
          (a, b) => new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime(),
        );
      }
    }
  }

  return commits.sort(
    (a, b) => new Date(b.pushedAt).getTime() - new Date(a.pushedAt).getTime(),
  );
}

export async function sendGitHubActivityResponse(username) {
  let commits = [];
  let source = "github-api";

  try {
    commits = await getGitHubActivity(username);
  } catch (error) {
    commits = await getFallbackCommits(username);
    source = "atom";

    if (commits.length === 0) {
      throw error;
    }
  }

  return {
    commits,
    fetchedAt: new Date().toISOString(),
    source,
  };
}
