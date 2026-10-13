import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Copy, Github, Rss } from 'lucide-react';
import { useLocale } from './i18n';
import project from './project.json';
import updates from './updates.json';
import './community.css';

const copy = {
  zh: {
    intro: '午饭后，还是那张空白的便签。',
    introText: '水杯放回桌上，昨天写的“有空记一下”还在那里。下午的事情已经排了上来，这件小事又要等到什么时候？',
    introPurpose: '烦恼维修部，陪你从这样的时刻找起。翻一个贴近眼前烦恼的例子，把它换成自己今天做得到的一小步。',
    introEnd: '这一次，可以先写一条已确认的决定。把有用的办法收好，然后回到生活里。',
    videoLabel: '烦恼维修部中文介绍短片',
    videoNote: '一个关于“有空再做”的小故事',
    transcript: '读读这个小故事',
    story: ['“有空就做。”然后，“有空”一直没来。', '烦恼维修部：给卡住的日常，换一种办法。', '官网有 24 张工具卡，可以按烦恼筛选，也可以搜索。', '如果午饭后坐回工位，放下水杯，我就写一条今天已确认的决定。', '看懂这一招，再把例子换成自己的下一步。', '收藏到“我的抽屉”。笔记只留在当前浏览器，不会上传。', '不必立刻想通，先找到下一步。'],
    videoError: '暂时无法播放。你也可以阅读下方的文字版。',
    updates: '这间小店，持续营业。',
    updatesText: '新办法、新例子，还有一点点变好的体验，都会记在这里。',
    follow: '下次更新时，再见。',
    followText: '这里会继续添一些日常的例子和小练习。把订阅地址加进 RSS 阅读器，有新内容时，我们在那里见。',
    copy: '复制订阅地址', copied: '已复制', fallback: '请复制下面的订阅地址。',
    feed: '查看版本订阅', github: '在 GitHub 关注',
    githubNote: '想收到版本更新，可在仓库选择 Watch → Custom → Releases。',
    privacy: 'RSS 无需留下邮箱，也不会把卡包咨询变成邮件订阅。',
    feedLabel: 'GitHub 版本订阅地址', try: '去试一个小办法',
  },
  en: {
    intro: 'After lunch, the note is still blank.',
    introText: 'You put your cup back on the desk. Yesterday’s note still says “when I have time”. The afternoon is already filling up. When will that little task get its turn?',
    introPurpose: 'Worry Repair gives you a place to start at moments like this. Find an everyday example that fits what is on your mind, then make it a small step you can try today.',
    introEnd: 'This time, you could begin by writing one decision you have confirmed. Keep the idea that helps, and go back to your day.',
    videoLabel: 'Worry Repair introduction in English',
    videoNote: 'A little story about “sometime”',
    transcript: 'Read the little story',
    story: ['“When I have time.” And then “sometime” never comes.', 'Worry Repair: a different way through everyday snags.', 'The official site has 24 tool cards. Filter by what is on your mind, or search.', 'If I sit down after lunch and set down my cup, then I will write one decision I confirmed today.', 'Understand the idea, then turn the example into your own next step.', 'Save a card to My Drawer. Notes stay in this browser and are not uploaded.', 'You do not need every answer. Find one next step.'],
    videoError: 'The video could not load. You can still read the transcript below.',
    updates: 'Still growing. Still here.',
    updatesText: 'New ideas, everyday examples and small improvements, all recorded here.',
    follow: 'See you at the next update.',
    followText: 'I will keep adding everyday examples and small exercises. Add the feed to your RSS reader, and we will meet there when something new is ready.',
    copy: 'Copy feed address', copied: 'Copied', fallback: 'Copy the feed address below.',
    feed: 'View release feed', github: 'Follow on GitHub',
    githubNote: 'For release notifications, choose Watch → Custom → Releases in the repository.',
    privacy: 'RSS needs no email address. Card-pack enquiries do not subscribe you to email updates.',
    feedLabel: 'GitHub release feed address', try: 'Try one small step',
  },
};

export function Introduction() {
  const { locale } = useLocale();
  const c = copy[locale];
  const [failedLocale, setFailedLocale] = useState<string | null>(null);
  return <section id="intro" className="intro-section section-pad" aria-labelledby="intro-title" tabIndex={-1}>
    <div className="intro-heading"><span className="eyebrow">ONE ORDINARY AFTERNOON</span><h2 id="intro-title">{c.intro}</h2><p>{c.introText}</p><p>{c.introPurpose}</p><p>{c.introEnd}</p><a className="text-link" href="#repair">{c.try}<ArrowRight size={18}/></a></div>
    <figure className="intro-film">
      <video key={locale} controls playsInline preload="none" poster={`/media/intro-${locale}-landscape.jpg`} aria-label={c.videoLabel} aria-describedby="intro-caption" onError={() => setFailedLocale(locale)}>
        <source src={`/media/intro-${locale}-landscape.mp4`} type="video/mp4"/>
        <track kind="chapters" src={`/media/intro-${locale}-chapters.vtt`} srcLang={locale === 'zh' ? 'zh-CN' : 'en'} label={locale === 'zh' ? '章节' : 'Chapters'}/>
      </video>
      <figcaption id="intro-caption"><span>{c.videoLabel}</span><span>{c.videoNote}</span></figcaption>
      {failedLocale === locale && <p role="status">{c.videoError}</p>}
      <details className="intro-transcript"><summary>{c.transcript}</summary>{[c.story.slice(0,2), c.story.slice(2,4), c.story.slice(4)].map((lines,i) => <p key={i}>{lines.join(' ')}</p>)}</details>
    </figure>
  </section>;
}

export function Updates() {
  const { locale } = useLocale();
  const c = copy[locale];
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'fallback'>('idle');
  useEffect(() => setCopyState('idle'), [locale]);
  const feedPath = `/updates.${locale}.xml`;
  const repo = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(project.repositoryUrl) ? project.repositoryUrl.replace(/\/$/, '') : '';
  const feedUrl = repo ? `${repo}/releases.atom` : new URL(feedPath, window.location.origin).href;
  async function copyFeed() {
    try { await navigator.clipboard.writeText(feedUrl); setCopyState('copied'); }
    catch { setCopyState('fallback'); }
  }
  return <section id="updates" className="updates-section section-pad" aria-labelledby="updates-title" tabIndex={-1}>
    <div className="updates-heading"><span className="eyebrow">LIFE, IN PROGRESS</span><h2 id="updates-title">{c.updates}</h2><p>{c.updatesText}</p></div>
    <div className="updates-layout">
      <div className="update-list">{updates.map(update => <article className="update-entry" key={update.id} id={`update-${update.id}`}>
        <div className="update-meta"><time dateTime={update.date}>{new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en', {year:'numeric', month:'short', day:'numeric', timeZone:'UTC'}).format(new Date(`${update.date}T00:00:00Z`))}</time><span>v{update.version}</span></div>
        <h3><a href={`#update-${update.id}`}>{update[locale].title}</a></h3><p>{update[locale].summary}</p><ul>{update[locale].items.map(item => <li key={item}>{item}</li>)}</ul>
      </article>)}</div>
      <aside id="follow" className="follow-panel" aria-labelledby="follow-title" tabIndex={-1}>
        <Rss size={26} aria-hidden="true"/><h3 id="follow-title">{c.follow}</h3><p>{c.followText}</p>
        <button className="button primary" onClick={copyFeed}>{copyState === 'copied' ? c.copied : c.copy}{copyState === 'copied' ? <Check size={18}/> : <Copy size={18}/>}</button>
        <p className="follow-status" role="status">{copyState === 'copied' ? c.copied : copyState === 'fallback' ? c.fallback : ''}</p>
        <label className="feed-label" htmlFor="feed-address">{c.feedLabel}</label><input id="feed-address" readOnly value={feedUrl} onFocus={e => e.currentTarget.select()}/>
        <a className="text-link" href={feedUrl}>{c.feed}<ArrowUpRight size={17}/></a>
        {repo && <div className="github-follow"><a className="text-link" href={repo} target="_blank" rel="noreferrer"><Github size={18}/>{c.github}<ArrowUpRight size={17}/></a><p>{c.githubNote}</p></div>}
        <p className="follow-privacy">{c.privacy}</p>
      </aside>
    </div>
  </section>;
}
