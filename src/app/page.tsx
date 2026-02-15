import { listRunIds, parseRepo } from "@/lib/github";

export default async function Home() {
  const dataRepoStr = process.env.NEXT_PUBLIC_DATA_REPO ?? "AlexLongmuir/peregrine-dashboard-data";
  const dataRepo = parseRepo(dataRepoStr);

  let runs: string[] = [];
  let error: string | null = null;

  try {
    runs = await listRunIds(dataRepo);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <main>
      <h1 style={h1}>Runs</h1>
      <p style={{ opacity: 0.8, marginTop: 6 }}>
        Showing folders under <code style={code}>{dataRepoStr}</code> / <code style={code}>runs/</code>
      </p>

      {error ? (
        <div style={card}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Couldn’t load runs</div>
          <pre style={pre}>{error}</pre>
          <div style={{ opacity: 0.8, marginTop: 8 }}>
            Make sure the data repo has a <code style={code}>runs/</code> directory.
          </div>
        </div>
      ) : runs.length === 0 ? (
        <div style={card}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>No runs yet</div>
          <div style={{ opacity: 0.8 }}>
            Create a folder like <code style={code}>runs/20260215-example/</code> in the data repo.
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginTop: 18 }}>
          {runs.map((runId) => (
            <a key={runId} href={`/runs/${encodeURIComponent(runId)}`} style={{ ...card, ...aCard }}>
              <div style={{ fontWeight: 700 }}>{runId}</div>
              <div style={{ opacity: 0.75, marginTop: 6, fontSize: 13 }}>View artifacts →</div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}

const h1: React.CSSProperties = { margin: 0, fontSize: 26 };
const code: React.CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  padding: "2px 6px",
  borderRadius: 6,
};
const card: React.CSSProperties = {
  marginTop: 18,
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  padding: 14,
  background: "rgba(255,255,255,0.03)",
};
const aCard: React.CSSProperties = {
  color: "inherit",
  textDecoration: "none",
  display: "block",
};
const pre: React.CSSProperties = {
  margin: 0,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  fontSize: 12,
  opacity: 0.9,
};
