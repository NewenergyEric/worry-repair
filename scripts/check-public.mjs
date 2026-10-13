import {readdir, readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve(import.meta.dirname, '..');
const read = relative => readFile(path.join(root, relative), 'utf8');
const json = async relative => JSON.parse(await read(relative));
const manifest = await json('public-files.json');
assert.equal(manifest.scope, 'three-card-open-source-demo');
const allowed = new Set(manifest.files);
assert.equal(allowed.size, manifest.files.length, 'Duplicate allowlist path');
for (const file of allowed) assert.ok(!path.isAbsolute(file) && !file.split('/').includes('..') && !file.includes('\\'), `Unsafe allowlist path: ${file}`);
const actual = [];
async function walk(folder, build=false) {
  for (const item of await readdir(path.join(root, folder), {withFileTypes:true})) {
    const relative = [folder, item.name].filter(Boolean).join('/');
    if (item.isSymbolicLink()) throw new Error(`Symlinks are not release files: ${relative}`);
    if (!folder && ['node_modules','.git','dist'].includes(item.name)) continue;
    if (!folder && item.name.endsWith('.tsbuildinfo')) continue;
    assert.ok(!/(^|\/)(?:\.env(?:\.[^/]*)?|private|production|editions|server|downloads|cards|\.aws|\.codex|\.agents)(?:\/|$)/i.test(relative), `Private path: ${relative}`);
    assert.ok(!/\.(?:pdf|psd|ai|indd|aep|prproj|blend|wav|aiff|ttf|otf|zip|7z|sqlite(?:3)?|db|pem|key|map)$/i.test(relative), `Private/source file format: ${relative}`);
    if (item.isDirectory()) {await walk(relative,build); continue;}
    if (!build) {assert.ok(allowed.has(relative), `Unreviewed file; inspect before adding to public-files.json: ${relative}`); actual.push(relative);}
    const bytes = await readFile(path.join(root,relative));
    assert.ok(!bytes.subarray(0,5).equals(Buffer.from('%PDF-')), `PDF content: ${relative}`);
    if (/\.(?:tsx?|jsx?|mjs|json|html|md|css|svg|txt|ya?ml|xml|vtt)$/.test(relative)) {
      const text = bytes.toString('utf8');
      const rules = [
        ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
        ['github-token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/],
        ['aws-access-key', /\bAKIA[0-9A-Z]{16}\b/],
        ['private-machine-path', /[A-Z]:[\\/]Users[\\/]|[A-Z]:[\\/]HUMANAI[\\/]/i],
        ['old-card-download', /life-repair-(?:v2|en)\.pdf|\/cards\/(?:en\/)?\d{2}-[AB]\.webp/i],
        ['private-contact-config', /(?:CONTACT_TO|SMTP_PASSWORD|DATA_ENCRYPTION_KEY)\s*[:=]\s*["']?[^\s"']{8,}/],
      ];
      for (const [rule,pattern] of rules) assert.ok(!pattern.test(text), `${rule}: ${relative}`);
    }
  }
}
await walk('');
assert.deepEqual(actual.sort(), [...allowed].sort(), 'Missing allowlisted files');
try {await stat(path.join(root,'dist')); await walk('dist',true);} catch(error) {if(error.code!=='ENOENT') throw error;}
const content = await json('src/content.json');
const english = await json('src/content.en.json');
assert.deepEqual(content.cards.map(c=>c.id).sort((a,b)=>a-b),[1,8,12]);
assert.deepEqual(Object.keys(english.cards).map(Number).sort((a,b)=>a-b),[1,8,12]);
for(const card of content.cards){
  assert.equal(card.steps.length,3); assert.equal(english.cards[card.id].steps.length,3);
  for(const source of card.sources) assert.ok(content.sources[source] && english.sourceNotes[source]);
  for(const locale of ['zh','en']) assert.ok((locale==='zh'?card:english.cards[card.id]).output.trim());
}
const updates = await json('src/updates.json');
assert.equal(new Set(updates.map(u=>u.id)).size,updates.length);
for(const entry of updates){assert.match(entry.date,/^\d{4}-\d{2}-\d{2}$/);for(const locale of ['zh','en']){assert.ok(entry[locale].title && entry[locale].summary && entry[locale].items.length);}}
for(const language of ['en','zh']){
  for(const extension of ['mp4','jpg']) assert.ok((await stat(path.join(root,`public/media/intro-${language}-landscape.${extension}`))).size>1000);
  assert.ok((await read(`public/updates.${language}.xml`)).includes('<rss version="2.0"'));
  assert.ok((await read(`public/media/intro-${language}-chapters.vtt`)).startsWith('WEBVTT'));
}
console.log(`PASS: ${actual.length} allowlisted files; exactly 3 bilingual samples; feeds and landscape media present; no prohibited private files or detected secret patterns.`);
