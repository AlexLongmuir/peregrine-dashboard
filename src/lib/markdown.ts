function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * Very small, safe-ish markdown renderer for this dashboard.
 * Supports headings, bullets, code fences, inline code, and paragraphs.
 * (We keep it minimal to avoid pulling extra deps.)
 */
export function renderMarkdownToHtml(md: string): string {
  const lines = md.replaceAll("\r\n", "\n").split("\n");

  let html = "";
  let inCode = false;
  let codeLang: string | null = null;
  let inList = false;

  const flushList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine;

    const fence = line.match(/^```(.*)$/);
    if (fence) {
      if (!inCode) {
        flushList();
        inCode = true;
        codeLang = fence[1]?.trim() || null;
        html += `<pre><code${codeLang ? ` data-lang="${escapeHtml(codeLang)}"` : ""}>`;
      } else {
        inCode = false;
        codeLang = null;
        html += "</code></pre>";
      }
      continue;
    }

    if (inCode) {
      html += escapeHtml(line) + "\n";
      continue;
    }

    // Headings
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flushList();
      const level = h[1].length;
      html += `<h${level}>${inline(escapeHtml(h[2]))}</h${level}>`;
      continue;
    }

    // Bullets
    const b = line.match(/^[-*]\s+(.*)$/);
    if (b) {
      if (!inList) {
        flushList();
        inList = true;
        html += "<ul>";
      }
      html += `<li>${inline(escapeHtml(b[1]))}</li>`;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      flushList();
      continue;
    }

    // Paragraph
    flushList();
    html += `<p>${inline(escapeHtml(line))}</p>`;
  }

  flushList();
  // If file ended mid-fence, close it.
  if (inCode) html += "</code></pre>";

  return html;
}

function inline(escaped: string): string {
  // inline code: `code`
  return escaped.replaceAll(/`([^`]+)`/g, (_m, g1) => `<code>${g1}</code>`);
}
