/**
 * Copies build/index.html into a folder for every route, so that opening
 * /work, /about, /project/sensor etc. directly (from LinkedIn, Google or a
 * bookmark) works on a plain Apache server without rewrite rules.
 * Runs automatically after `npm run build` (the "postbuild" script).
 */
const fs = require('fs');
const path = require('path');

const build = path.join(__dirname, '..', 'build');
const html = fs.readFileSync(path.join(build, 'index.html'));
const projectIds = ['sensor', 'nudge', 'ev', 'pos'];
const routes = ['work', 'about', 'consulting', 'style-guide', 'notes', ...projectIds.map((id) => `project/${id}`)];

for (const route of routes) {
  const dir = path.join(build, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}
console.log(`postbuild: wrote index.html for ${routes.length} routes`);
