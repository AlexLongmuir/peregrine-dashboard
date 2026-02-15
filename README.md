# Peregrine Dashboard

A lightweight public dashboard for **Peregrine Works** agent runs.

- **Site repo:** https://github.com/AlexLongmuir/peregrine-dashboard
- **Data repo (public, sanitized):** https://github.com/AlexLongmuir/peregrine-dashboard-data

## What it shows

- List of runs from the data repo
- Per-run pages rendering markdown artifacts (PRD clarifications, design, QA plan, etc.)
- Optional status feed (`STATUS.md`) for “what agents are doing”

## Local dev

```bash
npm install
npm run dev
```

## Config

Set the data repo via env:

- `NEXT_PUBLIC_DATA_REPO=AlexLongmuir/peregrine-dashboard-data`

(Defaults to the repo above if unset.)
