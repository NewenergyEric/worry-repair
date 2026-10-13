import {readFile, writeFile} from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const updates = JSON.parse(await readFile(new URL('src/updates.json', root), 'utf8'));
const project = JSON.parse(await readFile(new URL('src/project.json', root), 'utf8'));
const repo = project.repositoryUrl.replace(/\/$/, '');
const escape = text => String(text).replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
for (const locale of ['zh', 'en']) {
  const title = locale === 'zh' ? '烦恼维修部 · GitHub 更新记录' : 'Worry Repair · GitHub Updates';
  const url = repo ? `${repo}/releases` : project.siteUrl;
  const feed = repo ? `${repo.replace('https://github.com/', 'https://raw.githubusercontent.com/')}/main/public/updates.${locale}.xml` : new URL(`/updates.${locale}.xml`, project.siteUrl).href;
  const items = updates.map(update => {
    const link = repo ? `${repo}/releases/tag/v${update.version}` : project.siteUrl;
    const content = update[locale];
    const html = `<p>${escape(content.summary)}</p><ul>${content.items.map(item => `<li>${escape(item)}</li>`).join('')}</ul>`;
    return `<item><title>${escape(content.title)}</title><link>${escape(link)}</link><guid isPermaLink="false">life-updates:${escape(update.id)}:${locale}</guid><pubDate>${new Date(`${update.date}T00:00:00Z`).toUTCString()}</pubDate><description>${escape(html)}</description></item>`;
  }).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escape(title)}</title><link>${escape(url)}</link><description>${escape(title)}</description><language>${locale === 'zh' ? 'zh-CN' : 'en'}</language><atom:link href="${escape(feed)}" rel="self" type="application/rss+xml"/>${items}</channel></rss>\n`;
  await writeFile(new URL(`public/updates.${locale}.xml`, root), xml);
}
console.log('Generated English and Chinese RSS feeds.');
