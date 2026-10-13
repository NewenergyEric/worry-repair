# Maintenance and deployment / 维护与部署

## Run the demo / 运行示例

Use Node.js **24.13 or later**. No account, API key or contact server is needed. / 使用 Node.js **24.13 或更高版本**，无需账户、密钥或咨询后端。

```sh
npm ci
npm run check
npm run dev
```

Open `http://127.0.0.1:4321/`; use `?lang=en` or `?lang=zh` to choose a language. Open TOOL 08, try an exercise and revisit an optional note in the same browser. / 打开上述地址，选择语言，试用 08 号卡，并在同一浏览器中回看笔记。

```sh
npm run build
npm run preview -- --port 4322
```

The build is in `dist/`. The demo links enquiries to the official website and does not collect contact details. / 静态产物位于 `dist/`；示例中的咨询入口指向官网，本示例不收集联系方式。

[Interactive setup guide](getting-started.html) · [Installation checklist](installation-checklist.md) · [Verification](verification.md)

## Public scope / 开放范围

The public package includes the React/Vite code, three bilingual sample cards (Cognitive Defusion, If–Then Plans and Odyssey Plans), required web illustrations/font subsets and finished promotional media. The official website holds the full 24-card experience and ongoing content updates. PDFs, printable packs, complete content source, print layouts, artwork masters, editable video projects, audio stems, contact records and server credentials stay outside this repository.

公开包包含网站代码、认知解离／如果—就计划／奥德赛计划三张双语示例卡、网页所需插画与字体，以及宣传成片。完整 24 张卡和持续更新留在官网。PDF、打印卡包、完整内容源文件、印刷与插画母版、视频工程、音频分轨、联系记录和服务端密钥均保持私有。

## Writing for readers / 面向读者的介绍

Introduce the product through an ordinary situation, one example and a small action the reader could take into their day. Keep the READMEs and sample introduction focused on that story. File inventories, frameworks, packaging, video specifications and deployment steps belong in contributor documentation. Retain the same meaning in English and Chinese; use imagined everyday situations, not fabricated testimonials or promised outcomes.

先讲读者遇到的时刻，再讲他可以怎样试一个办法、回到生活里。README 与开源示例介绍围绕这条故事展开；文件清单、技术实现、制作参数和部署步骤放在维护文档。中英文表达同一个意思，不虚构用户证言或效果承诺。

## Content and updates

The default sample IDs are **01, 08, 12**. They exercise search, categories, read/practice tabs, notes, saved cards and illustration labels without distributing the full collection. The film showcases the official 24-card website, as stated in both READMEs.

Add new update entries to the beginning of `src/updates.json` with a stable `id`, `date` (`YYYY-MM-DD`), `version`, and matching `zh`/`en` titles, summaries and bullet lists. Never recycle an ID for another update. Run `npm run feeds`; the two XML files are generated from the same entries as the sample page. Publish a matching GitHub release to notify people who use Watch or the release feed. Keep the release notes bilingual.

## Canonical site and GitHub

`src/project.json` has these fields:

- `siteUrl`: canonical website origin, used for the complete collection and enquiry links.
- `repositoryUrl`: the real GitHub repository URL, currently `https://github.com/NewenergyEric/worry-repair`. Follow controls use its release feed (`/releases.atom`). Empty means the GitHub button is omitted and the demo falls back to its local language feed.
- `demo`: identifies this sample distribution.

The generated language feeds link to GitHub release notes and identify their copy on the repository’s `main` branch. Update the generator if you choose a different default branch. They do not depend on new endpoints on the official website.

For your own deployment, first replace the restricted sample branding/content as required by the content licence, then set your canonical URL. Regenerate feeds and rebuild. The site does not use an email subscriber service or a production enquiry API.

## Static hosting

Run `npm ci`, `npm run check`, `npm run build`, then `npm run check` again. Upload only `dist/` to a static host at a domain root. The current application uses root-relative asset paths; a subdirectory deployment requires path changes and separate verification.

Serve `.xml` feeds as `application/rss+xml; charset=utf-8`, `.mp4` as `video/mp4` with byte-range support, and `.vtt` as `text/vtt`. Do not rewrite missing media, XML or other static paths to the HTML entry point. Keep the existing hashed-asset caching rules; the page and feeds should revalidate.

This GitHub release does not deploy the sample or change the official website. The existing official site remains the complete reading experience. The instructions above are for someone choosing to host their own permitted fork.

## Media in the README

Each README uses a native GitHub video attachment for its matching landscape film, with a repository MP4 fallback. Upload a replacement finished film through GitHub, then put the returned attachment URL on a line of its own. Do not fabricate an attachment URL or assume a relative `<video>` tag will render on GitHub. GIF previews remain available in `docs/media/`.

The current 1920×1080 files are H.264/AAC, seekable and below 10 MB each. Square and vertical files are secondary media-library links. Production sources remain private. Check the actual GitHub README after replacing a video; a local preview alone does not verify GitHub playback.

## Release files

`public-files.json` is an explicit file allowlist. `npm run check` rejects extra distributable files and scans `dist/` separately when present. Add only reviewed runtime/code/documentation/finished-media files to the allowlist. Never add `node_modules`, production sources, caches, contact data or credentials.

`npm run package` creates `../worry-repair-0.1.0.zip` from the allowlist. It checks source files first and does not include build output or dependency folders. Unzip it and repeat the installation checklist before a release. A scan of this clean package does not claim to audit some other repository's history.

中文要点：本次仅发布 GitHub，不部署官网。README 以故事与横版视频介绍用途；完整内容链接到现有官网。通过 Releases、Watch 和版本订阅持续关注。只从白名单打包源码，PDF 与制作工程继续私有。
