
// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/Users/spurrya/Documents/hackathon/transaction-insights-snap/packages/site/.cache/dev-404-page.js")),
  "component---src-pages-index-tsx": preferDefault(require("/Users/spurrya/Documents/hackathon/transaction-insights-snap/packages/site/src/pages/index.tsx"))
}

