import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Peregrine Dashboard",
  description: "Public dashboard for Peregrine Works agent runs",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji",
          background: "#0b0f17",
          color: "#e6edf3",
        }}
      >
        <div
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "28px 18px 64px",
          }}
        >
          <header style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>Peregrine Dashboard</div>
                <div style={{ opacity: 0.75, marginTop: 4, fontSize: 13 }}>
                  Run artifacts for Peregrine Works (public, sanitized)
                </div>
              </div>
              <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Link style={linkStyle} href="/">
                  Runs
                </Link>
              </nav>
            </div>
          </header>

          {children}

          <footer style={{ marginTop: 40, opacity: 0.6, fontSize: 12 }}>
            Data source: {process.env.NEXT_PUBLIC_DATA_REPO ?? "AlexLongmuir/peregrine-dashboard-data"}
          </footer>
        </div>
      </body>
    </html>
  );
}

const linkStyle: React.CSSProperties = {
  color: "#9ecbff",
  textDecoration: "none",
};
