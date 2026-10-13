# Verification / 验证记录

Release **0.1.0**, checked on **2026-10-13**.

## Installation and build

The release process checks a fresh extraction of the allowlisted source ZIP on Windows with Node.js 24.13.0: `npm ci`, `npm run check`, `npm run build`, then `npm run check` again. No private production directory or existing dependency installation is required.

GitHub Actions repeats installation, the public-file check and the build on Ubuntu. See the [actual workflow results](https://github.com/NewenergyEric/worry-repair/actions/workflows/check.yml) for each commit. macOS has not been separately tested.

## Browser and media coverage

- English/Chinese switching, three-card search, read/practice tabs, note save/reopen/reload/clear and favourite save/reload were checked in the sample demo.
- Desktop and 390-pixel layouts were inspected, with no horizontal document overflow in the inspected views.
- Both 68-second landscape films played from start to finish in the browser, without playback errors. The finished films passed full decoding, codec/frame-count/seekability checks and QR decoding to the official website.
- The films, GIF previews and underlying card interactions are unchanged for this GitHub publication. The updated follow controls point to GitHub releases.
- Both native GitHub landscape attachments were uploaded from the reviewed MP4 exports. The repository keeps the original exports as playback fallbacks.
- The bilingual HTML setup guide supports language switching, checklist persistence and reset. Open the file locally after downloading or cloning; GitHub displays its source.

## Public scope

The release allowlist contains **111 files**, exactly **three bilingual sample cards (01, 08, 12)** and **eight finished MP4 films**. Code has an MIT licence; bundled content and media have separate permissions, with third-party font notices retained.

The file check rejects unreviewed files, PDF content, production formats and known credential patterns. Earlier synthetic PDF and `.env.local` probes were rejected and removed. This is a scoped distribution check, not a claim that every possible secret format can be detected.

No PDF, print master, editable video project, private full-card collection, contact backend or contact data is included. The official website is not deployed or changed by this release.

中文：发布范围为 111 个白名单文件、三张双语示例卡和八个无配音视频成片。安装、构建与发布文件检查在全新副本运行；各次提交的自动检查结果可在 Actions 查看。双语操作、笔记收藏、手机排版与横版完整播放已检查。本次关注入口指向 GitHub，完整内容仍在现有官网，PDF 与制作源文件保持私有。
