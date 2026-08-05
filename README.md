# AI-Powered Interactive HTML

## Project Notes

- This standalone Zo Site is a professional education demo for ICT teachers showing how AI agents can help create interactive HTML learning activities.
- The main interface is a responsive hybrid layout: a desktop left sidebar collapses to an icon rail with the sidebar control, while smaller screens use a drawer menu. Main content expands when the sidebar collapses.
- Navigation includes Home, Getting Started, Prompt Builder, and the exact subject labels: Chinese, English, Mathematics, Civic Education, Physics, Chemistry, Biology, BAFS, THS, Geography, ICT, DAT, VA, and Music.
- Subject pages intentionally start with empty activity galleries. Future activities are added manually in `src/App.tsx` through the `subjectExamples` object, where each item can provide a title, description, format, and full-activity URL.
- The Prompt Builder creates a copyable prompt from subject, topic or learning goal, activity type, learner level, and selected interaction features.
- The initial visual direction is clean and calm: navy typography, pale blue surfaces, white cards, restrained shadows, and small subject-specific color accents.

## Technical implementation

- Runtime: Bun + Hono + Vite-managed React.
- UI: React, React Router, Tailwind CSS 4, and Lucide icons.
- Primary application code: `src/App.tsx`.
- Site styling: `src/styles.css`.
- The app is a client-side single-page experience with subject routes such as `/english`, `/mathematics`, and `/ict`.
- `zosite.json` remains system-managed; do not change its assigned ports or entrypoints.

## Adding a subject activity

Add an activity object to the relevant subject array in `subjectExamples`:

```ts
english: [
  {
    title: "Activity title",
    description: "Short explanation of what students practise.",
    format: "Interactive quiz",
    url: "/activities/english-activity.html",
  },
],
```

The activity gallery supports a preview card and an `Open full activity` link. Keep the activity HTML self-contained when possible so it can be demonstrated easily.

## Development

The site server is managed externally by Zo and hot reloads source changes. Use `bun run build` to verify a production build. Do not start or restart the site server manually.

## Repository guidance

The README should remain accurate as the project evolves. Read this file before making broad changes and document significant new structural components or durable design decisions here.