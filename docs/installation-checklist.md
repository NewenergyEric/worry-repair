# Installation checklist / 安装检查清单

Version: 0.1.0. This checklist describes the public three-card demo.

- [ ] Get the clean source checkout or allowlisted release ZIP. It contains `package.json`, `src/`, `public/`, `scripts/` and this guide; no private production folder is needed.
- [ ] Run `node --version`. Use Node.js 24.13 or later.
- [ ] Run `npm ci` in the project directory.
- [ ] Run `npm run check`. Resolve any unexpected file or privacy failure before continuing.
- [ ] Run `npm run dev`, then open `http://127.0.0.1:4321/`.
- [ ] Switch Chinese/English. Find the three sample cards, filter and clear a search.
- [ ] Open TOOL 08, switch to practice, save an optional note, close the card and reopen it.
- [ ] Save a card to My Drawer, reload and confirm it remains in this browser. Clear the test note afterward if desired.
- [ ] Play the introduction; use the update log and GitHub release subscription in each language.
- [ ] Run `npm run build`, then `npm run preview -- --port 4322` to inspect the production build.
- [ ] Before deploying a fork, review the content licence and configure `src/project.json`; deploy `dist/` at a domain root.

If a port is occupied, use `npm run dev -- --port 4325`. If installation is interrupted, retry `npm ci`. The generated build can be recreated from source; do not substitute a whole private workspace for this package. Saving may be unavailable when the browser disables local storage; the interface reports that limitation.

The GitHub follow button and release feed use the configured repository URL. Feed updates do not enrol anyone in email. Production contact handling is outside this standalone demo.

以上步骤依次覆盖获取文件、环境、安装、启动、双语交互、视频与订阅、构建和部署。手动勾选是你的进度记录，并不等于程序已经验证通过；本次实际验证范围见 [verification.md](verification.md)。
