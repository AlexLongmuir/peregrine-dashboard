export type GithubRepo = {
  owner: string;
  repo: string;
};

export function parseRepo(input: string): GithubRepo {
  const [owner, repo] = input.split("/");
  if (!owner || !repo) throw new Error(`Invalid repo: ${input}`);
  return { owner, repo };
}

export async function ghFetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    // Public data repo: no auth. Avoid caching issues for near-real-time updates.
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub API error ${res.status} ${res.statusText}: ${text.slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

export async function listRunIds(dataRepo: GithubRepo): Promise<string[]> {
  // List top-level directories under runs/
  const url = `https://api.github.com/repos/${dataRepo.owner}/${dataRepo.repo}/contents/runs`;
  const items = await ghFetchJson<Array<{ name: string; type: string }>>(url);
  return items
    .filter((i) => i.type === "dir")
    .map((i) => i.name)
    .sort()
    .reverse();
}

export async function listFilesInRun(dataRepo: GithubRepo, runId: string) {
  const url = `https://api.github.com/repos/${dataRepo.owner}/${dataRepo.repo}/contents/runs/${encodeURIComponent(runId)}`;
  return await ghFetchJson<Array<{ name: string; path: string; type: string }>>(url);
}

export async function fetchFileMarkdown(dataRepo: GithubRepo, path: string): Promise<string> {
  // Use raw content endpoint for simplicity.
  const rawUrl = `https://raw.githubusercontent.com/${dataRepo.owner}/${dataRepo.repo}/main/${path}`;
  const res = await fetch(rawUrl, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return await res.text();
}
