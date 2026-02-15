import Link from "next/link";

import { fetchFileMarkdown, listFilesInRun, parseRepo } from "@/lib/github";
import { renderMarkdownToHtml } from "@/lib/markdown";

const PREFERRED = [
  "STATUS.md",
  "PRD_CLARIFIED.md",
  "DECISIONS.md",
  "DESIGN.md",
  "RESEARCH.md",
  "IMPLEMENTATION_PLAN.md",
  "QA_PLAN.md",
  "ANALYTICS_PLAN.md",
  "COMMS.md",
  "LEGAL_REDFLAGS.md",
  "LAUNCH_NOTES.md",
];

export default async function RunPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;

  const dataRepoStr = process.env.NEXT_PUBLIC_DATA_REPO ?? "AlexLongmuir/peregrine-dashboard-data";
  const dataRepo = parseRepo(dataRepoStr);

  const files = await listFilesInRun(dataRepo, runId);
  const mdFiles = files
    .filter((f) => f.type === "file" && f.name.toLowerCase().endsWith(".md"))
    .map((f) => f.name);

  const ordered = [
    ...PREFERRED.filter((p) => mdFiles.includes(p)),
    ...mdFiles.filter((n) => !PREFERRED.includes(n)).sort(),
  ];

  const contents = await Promise.all(
    ordered.map(async (name) => {
      const path = `runs/${runId}/${name}`;
      const md = await fetchFileMarkdown(dataRepo, path);
      return { name, md, html: renderMarkdownToHtml(md) };
    })
  );

  return (
    <main>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 26 }}>{runId}</h1>
        <Link style={link} href="/">
          ← all runs
        </Link>
      </div>

      <div style={{ opacity: 0.8, marginTop: 8 }}>
        Files: {ordered.length === 0 ? "(none)" : ordered.join(", ")}
      </div>

      {ordered.length === 0 ? (
        <div style={card}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>No markdown files found</div>
          <div style={{ opacity: 0.8 }}>
            Add <code style={code}>runs/{runId}/PRD_CLARIFIED.md</code> (or any .md) in the data repo.
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 14, marginTop: 16 }}>
          <aside style={aside}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Artifacts</div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
              {contents.map((c) => (
                <li key={c.name}>
                  <a href={`#${encodeURIComponent(c.name)}`} style={tocLink}>
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <section style={{ display: "grid", gap: 12 }}>
            {contents.map((c) => (
              <article key={c.name} id={encodeURIComponent(c.name)} style={card}>
                <div style={{ fontWeight: 800, marginBottom: 10 }}>{c.name}</div>
                <div
                  className="md"
                  dangerouslySetInnerHTML={{ __html: c.html }}
                  style={{ lineHeight: 1.5 }}
                />
              </article>
            ))}
          </section>
        </div>
      )}

      <style>{css}</style>
    </main>
  );
}

const link: React.CSSProperties = { color: "#9ecbff", textDecoration: "none", fontSize: 13 };
const tocLink: React.CSSProperties = { color: "#c9d1d9", textDecoration: "none", opacity: 0.9 };
const card: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  padding: 14,
  background: "rgba(255,255,255,0.03)",
};
const aside: React.CSSProperties = {
  position: "sticky",
  top: 16,
  alignSelf: "start",
  height: "fit-content",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  padding: 14,
  background: "rgba(255,255,255,0.02)",
};
const code: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  padding: "2px 6px",
  borderRadius: 6,
};

const css = `
  .md h1,.md h2,.md h3 { margin: 18px 0 10px; }
  .md p { margin: 8px 0; opacity: 0.95; }
  .md ul { margin: 8px 0 8px 18px; }
  .md li { margin: 4px 0; }
  .md pre { overflow:auto; padding: 10px; border-radius: 10px; background: rgba(0,0,0,0.35); }
  .md code { background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 6px; }
`;
