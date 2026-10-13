'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Heart, Infinity as InfinityIcon, Menu, MoveHorizontal, Orbit, Pause, Search, X } from 'lucide-react';
import { cardTitle, colors } from './data';
import { LanguageSwitch, useLocale } from './i18n';
import { springs } from './motion-tokens';
import CardModal from './CardModal';
import { useSystemReducedMotion } from './useSystemReducedMotion';
import ModelArt from './ModelArt';
import ContactForm from './ContactForm';
import HeroScene from './HeroScene';
import Experience from './Experience';
import { Introduction, Updates } from './Community';
function Brand({ footer = false }: {
    footer?: boolean;
}) { const { t } = useLocale(); return <a className={`brand ${footer ? 'brand-footer' : ''}`} href="#home" aria-label={t("人生无限公司，返回首页")}><img src="/life-logo.svg" alt="LIFE" width="117" height="56"/><span className="brand-cn">{t("人生无限公司")}</span></a>; }
function Header({ quiet, setQuiet, systemReduced }: {
    quiet: boolean;
    setQuiet: (v: boolean) => void;
    systemReduced: boolean;
}) {
    const { t } = useLocale();
    const [menu, setMenu] = useState(false);
    const header = useRef<HTMLElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (!menu) return;
        const dismiss = (event: PointerEvent) => {
            if (!header.current?.contains(event.target as Node)) setMenu(false);
        };
        const escape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') { setMenu(false); trigger.current?.focus(); }
        };
        document.addEventListener('pointerdown', dismiss);
        document.addEventListener('keydown', escape);
        return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', escape); };
    }, [menu]);
    return <header ref={header} className="site-header"><Brand />
      <div className="header-actions"><LanguageSwitch />
        <button ref={trigger} className="directory-toggle" aria-label={menu ? t("关闭目录") : t("打开目录")} aria-controls="site-directory" aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? <X size={19}/> : <Menu size={19}/>}<span>{t("目录")}</span></button>
      </div>
      <nav id="site-directory" className="site-directory" aria-label={t("主导航")} hidden={!menu}>
        <a href="#repair" onClick={() => setMenu(false)}>{t("试试“有空就做”的解法")}<ArrowDown size={17}/></a>
        <a href="#tools" onClick={() => setMenu(false)}>{t("浏览工具卡")}<ArrowDown size={17}/></a>
        <a href="#takeaway" onClick={() => setMenu(false)}>{t("了解完整卡包")}<ArrowDown size={17}/></a>
        <a href="#intro" onClick={() => setMenu(false)}>{t("看介绍短片")}<ArrowDown size={17}/></a>
        <a href="#updates" onClick={() => setMenu(false)}>{t("最近更新")}<ArrowDown size={17}/></a>
        <a href="#follow" onClick={() => setMenu(false)}>{t("关注后续更新")}<ArrowDown size={17}/></a>
        <a href="#company" onClick={() => setMenu(false)}>{t("关于人生无限公司")}<ArrowDown size={17}/></a>
        <button className="quiet-button" onClick={() => setQuiet(!quiet)} disabled={systemReduced} aria-pressed={quiet || systemReduced}>{quiet || systemReduced ? <Pause size={17}/> : <Orbit size={17}/>}<span>{systemReduced ? t("已跟随系统减少动画") : quiet ? t("开启动画") : t("减少动画")}</span></button>
      </nav>
    </header>;
}
function Hero({ reduced, quiet }: {
    reduced: boolean;
    quiet: boolean;
}) {
    const { t } = useLocale();
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
    const progress = useSpring(scrollYProgress, springs.gentle);
    const textY = useTransform(progress, [0, 1], [0, -38]);
    const textOpacity = useTransform(progress, [0, .58, 1], [1, 1, .12]);
    const artX = useTransform(progress, [0, 1], ['0%', '-7%']);
    return <section id="home" ref={ref} className={`hero-scroll ${reduced ? 'reduced' : ''}`} data-effect="camera-push">
    <div className="hero-sticky">
      <div className="hero-topline"><span><i />{t("正在营业 · 每一种人生都欢迎")}</span><span className="micro">A COMPANY FOR EVERY VERSION OF YOU</span></div>
      <motion.div className="hero-copy" style={reduced ? {} : { y: textY, opacity: textOpacity }}>
        <div className="hero-eyebrow"><span className="tiny-star">✳︎</span>{t("人生无限公司 / LIFE")}</div>
        <h1>{t("人生很大，")}<br />{" "}<span className="headline-mark">{t("慢慢开张")}<svg viewBox="0 0 480 22" preserveAspectRatio="none" aria-hidden="true"><path d="M5 12Q180-4 470 9M20 20Q255 8 440 18"/></svg></span>{t("。")} </h1>
        <p>{t("不必立刻想通，先找到下一步。")}<br />{" "}{t("这里有些小工具，陪你处理生活的大大小小。")}</p>
        <a className="button primary" href="#repair">{t("先试一个小办法")}<ArrowDown size={21}/></a>
        <p className="hero-note">{t("开源示例 · 三张卡，先试试看。")}</p>
      </motion.div>
      <motion.div className="hero-art" style={reduced ? {} : { x: artX }} data-effect="camera-orbit">
        <div className="art-blob"/>
        <HeroScene progress={progress} reduced={reduced} quiet={quiet}/>
        <div className="shop-sign"><span className="sign-pin"/><span className="micro">DEPARTMENT 01</span><strong>{t("烦恼维修部")}</strong><span className="sign-open">{t("OPEN / 已开门")}</span></div>
        <div className="art-caption"><span>{t("带着你现在的样子来就好。")}</span><svg viewBox="0 0 80 60" aria-hidden="true"><path d="M5 5Q5 54 69 39M55 31l16 8-10 15"/></svg></div>
        <span className="orbit-hint"><MoveHorizontal size={14}/>{reduced ? t("随时可以慢下来") : t("挪挪光标，换个角度")}</span>
      </motion.div>
      <div className="hero-bottom"><span className="scroll-cue"><ArrowDown size={16}/>{t("向下滚动，继续逛逛")}</span><span className="hero-edition">{t("01 / 烦恼维修部 · 开源示例")}</span></div>
    </div>
  </section>;
}
function GlitchCut({ reduced }: {
    reduced: boolean;
}) {
    const { t } = useLocale();
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    // A single, scroll-bound displacement, never a flashing timer.
    const sliceX = useTransform(scrollYProgress, [0, .32, .38, .44, .52, .6, 1], [0, 0, -42, 23, -11, 0, 0]);
    const sliceX2 = useTransform(sliceX, v => -v * .65);
    const opacity = useTransform(scrollYProgress, [0, .28, .4, .56, .66, 1], [0, 0, .65, .35, 0, 0]);
    const beforeOpacity = useTransform(scrollYProgress, [0, .32, .51, 1], [1, 1, 0, 0]);
    const afterOpacity = useTransform(scrollYProgress, [0, .35, .54, 1], [0, 0, 1, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [25, -25]);
    return <section className={`glitch-section ${reduced ? 'reduced' : ''}`} ref={ref} data-effect="glitch-cut">
    <div className="glitch-caption"><span className="micro">LIFE IS STILL IN PROGRESS</span><span>{t("换个办法，继续下一幕。")}</span></div>
    <div className="glitch-stage">
      <motion.div style={reduced ? { opacity: 1 } : { opacity: beforeOpacity, y }} className="glitch-before"><span>{t("脑内信号")}</span><h2>{t("“我是不是不行？”")}</h2></motion.div>
      <motion.div className="glitch-after" style={reduced ? { opacity: 1 } : { opacity: afterOpacity, y }}><span>{t("换个频道")}</span><h2>{t("“这招还不适合我。”")}</h2></motion.div>
      {!reduced && <><motion.div aria-hidden="true" className="glitch-echo echo-one" style={{ x: sliceX, opacity }}><span>{t("换个频道")}</span><h2>{t("“这招还不适合我。”")}</h2></motion.div><motion.div aria-hidden="true" className="glitch-echo echo-two" style={{ x: sliceX2, opacity }}><span>{t("换个频道")}</span><h2>{t("“这招还不适合我。”")}</h2></motion.div></>}
      <span className="glitch-spark spark-one" aria-hidden="true">✳︎</span><span className="glitch-spark spark-two" aria-hidden="true">✳︎</span>
    </div>
    <p>{t("“烦恼维修部”维修的是卡住的办法，不是你。")}</p><a href="#tools" className="button secondary light">{t("浏览全部工具卡")}<ArrowRight size={19}/></a>
  </section>;
}
type GalleryProps = {
    reduced: boolean;
    onOpen: (id: number) => void;
    saved: number[];
    filter: number;
    setFilter: (v: number) => void;
    onlySaved: boolean;
    setOnlySaved: (v: boolean) => void;
};
function Gallery({ reduced, onOpen, saved, filter, setFilter, onlySaved, setOnlySaved }: GalleryProps) {
    const { t, cards, departments, moods } = useLocale();
    const track = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState('');
    const [position, setPosition] = useState(0);
    const [end, setEnd] = useState(false);
    const drag = useRef({ down: false, start: 0, scroll: 0, moved: false, at: 0 });
    const filtered = cards.filter(c => (filter === -1 || c.dept === filter) && (!onlySaved || saved.includes(c.id)) && `${c.title}${c.model}${c.when}`.toLowerCase().includes(query.toLowerCase()));
    const updatePosition = () => {
        const el = track.current;
        if (!el)
            return;
        const item = el.querySelector<HTMLElement>('.tool-card');
        const step = (item?.offsetWidth || 350) + (parseFloat(getComputedStyle(el).columnGap) || 0);
        setPosition(Math.min(filtered.length, Math.round(el.scrollLeft / step) + 1));
        setEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
    };
    useEffect(() => { track.current?.scrollTo({ left: 0, behavior: 'instant' }); setPosition(filtered.length ? 1 : 0); const id = requestAnimationFrame(updatePosition); return () => cancelAnimationFrame(id); }, [filter, onlySaved, query, filtered.length]);
    useEffect(() => {
        const observer = new ResizeObserver(updatePosition);
        if (track.current)
            observer.observe(track.current);
        return () => observer.disconnect();
    }, [filtered.length]);
    const move = (direction: number) => {
        const el = track.current;
        if (!el)
            return;
        el.scrollBy({ left: direction * ((el.querySelector<HTMLElement>('.tool-card')?.offsetWidth || 350) + (parseFloat(getComputedStyle(el).columnGap) || 0)), behavior: reduced ? 'instant' : 'smooth' });
    };
    return <section id="tools" tabIndex={-1} aria-label={t("工具卡库")} className="gallery-section section-pad" data-effect="swipe-gallery">
    <div className="section-heading"><div><span className="eyebrow">{t("02 / 随手翻翻，总有一种新办法")}</span><h2>{t("你的生活，")}<br />{" "}{t("不止一种解法。")}</h2></div><div className="gallery-intro"><span className="gallery-count">{cards.length}<span>{t("个模型 / 随用随取")}</span></span><p>{t("挑一个此刻的卡点，")}<br />{" "}{t("把一个小办法带回日常。")}</p></div></div>
    <div className="gallery-toolbar"><div className="filter-list" role="group" aria-label={t("按烦恼筛选")}><button className={filter === -1 ? 'selected' : ''} aria-pressed={filter === -1} onClick={() => setFilter(-1)}>{t("随便逛逛")}</button>{moods.map((m, i) => cards.some(card => card.dept === i) && <button key={m} className={filter === i ? 'selected' : ''} aria-pressed={filter === i} onClick={() => setFilter(i)} style={{ '--chip-color': colors[i] } as React.CSSProperties}><i style={{ background: colors[i] }}/>{m}</button>)}</div><button className={`saved-filter ${onlySaved ? 'selected' : ''}`} aria-pressed={onlySaved} onClick={() => setOnlySaved(!onlySaved)}><Heart size={16} fill={onlySaved ? 'currentColor' : 'none'}/>{t("我的抽屉")}<span>{saved.length}</span></button></div>
    <div className="gallery-subbar"><p aria-live="polite">{onlySaved ? t("放在这里的办法，想用时再回来。") : filter === -1 ? t("不用从第一张开始。此刻需要哪一张，就翻哪一张。") : departments[filter][2]}<span>{t("共")}{" "}{filtered.length}{" "}{t("张")}</span></p><div className="search-field"><label htmlFor="tool-search">{t("搜索工具卡")}</label><div className="search"><Search size={18}/><input id="tool-search" value={query} onChange={e => setQuery(e.target.value)} placeholder={t("找一个词，比如“完美”")}/>{query && <button aria-label={t("清除搜索")} onClick={() => setQuery('')}><X size={16}/></button>}</div></div></div>
    <div className="gallery-viewport"><div className="gallery-track" ref={track} tabIndex={0} role="region" aria-label={t("工具卡横滑图集，左右方向键翻卡")} onScroll={updatePosition} onKeyDown={e => {
            if (e.target === e.currentTarget && ['ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                move(e.key === 'ArrowRight' ? 1 : -1);
            }
        }} onPointerDown={e => {
            if (e.pointerType !== 'mouse' || e.button !== 0)
                return;
            drag.current = { down: true, start: e.clientX, scroll: e.currentTarget.scrollLeft, moved: false, at: performance.now() };
        }} onPointerMove={e => {
            if (!drag.current.down)
                return;
            const delta = e.clientX - drag.current.start;
            if (Math.abs(delta) > 8) {
                drag.current.moved = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                e.currentTarget.style.scrollSnapType = 'none';
                e.currentTarget.scrollLeft = drag.current.scroll - delta;
            }
        }} onPointerUp={e => {
            if (!drag.current.down)
                return;
            const distance = e.clientX - drag.current.start;
            const velocity = Math.abs(distance) / Math.max(1, performance.now() - drag.current.at);
            drag.current.down = false;
            e.currentTarget.style.scrollSnapType = '';
            if (e.currentTarget.hasPointerCapture(e.pointerId))
                e.currentTarget.releasePointerCapture(e.pointerId);
            if (drag.current.moved && (Math.abs(distance) > 55 || (Math.abs(distance) > 18 && velocity > .55))) {
                const step = (e.currentTarget.querySelector<HTMLElement>('.tool-card')?.offsetWidth || 350) + (parseFloat(getComputedStyle(e.currentTarget).columnGap) || 0);
                const original = Math.round(drag.current.scroll / step);
                const steps = Math.max(1, Math.round(Math.abs(distance) / step));
                e.currentTarget.scrollTo({ left: (original + (distance < 0 ? steps : -steps)) * step, behavior: reduced ? 'instant' : 'smooth' });
            }
            setTimeout(() => { drag.current.moved = false; }, 0);
        }} onPointerCancel={e => { drag.current.down = false; drag.current.moved = false; e.currentTarget.style.scrollSnapType = ''; }} onClickCapture={e => {
            if (drag.current.moved) {
                e.preventDefault();
                e.stopPropagation();
            }
        }}>
      {filtered.map((c, cardIndex) => <button className="tool-card" key={c.id} onClick={() => onOpen(c.id)} style={{ '--card-color': colors[c.dept] } as React.CSSProperties} aria-label={`${t("打开工具卡")} ${String(c.id).padStart(2, '0')}: ${cardTitle(c)}`}>
        <div className="card-top"><span><i />{departments[c.dept][0]}</span><span className="micro">{String(cardIndex + 1).padStart(2, '0')} / {filtered.length}</span></div><div className="card-art-wrap"><ModelArt id={c.id}/></div><div className="tool-card-copy"><span className="card-model">{c.model.split(' / ')[0]}</span><h3>{c.title.split('|').map(x => <span key={x}>{x}</span>)}</h3><p className="card-outcome">{c.unique}</p><div className="card-bottom"><span>{t("查看工具卡")}</span><span className="card-arrow"><ArrowRight size={20}/></span></div></div>{saved.includes(c.id) && <span className="card-saved" aria-label={t("已收藏")}><Heart size={14} fill="currentColor"/></span>}</button>)}
    </div>{!filtered.length && <div className="empty-state"><Search size={30}/><h3>{onlySaved && !saved.length ? t("抽屉还空着，慢慢挑。") : t("暂时没有找到这张卡。")}</h3><p>{onlySaved && !saved.length ? t("打开喜欢的卡片，就可以把它放进来。") : t("试试换一个词，或看看其他部门的办法。")}</p><button className="text-link" onClick={() => { setQuery(''); setFilter(-1); setOnlySaved(false); }}>{t("看看全部工具卡")}<ArrowRight size={16}/></button></div>}</div>
    <div className="gallery-footer"><span><MoveHorizontal size={18}/><span>{t("向左滑，换一种可能")}</span></span><div className="gallery-pagination"><span className="micro">{String(position).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}</span><button className="icon-button" aria-label={t("上一张工具卡")} disabled={position <= 1} onClick={() => move(-1)}><ArrowLeft size={21}/></button><button className="icon-button" aria-label={t("下一张工具卡")} disabled={end || !filtered.length} onClick={() => move(1)}><ArrowRight size={21}/></button></div></div>
  </section>;
}
function Company() {
    const { t } = useLocale();
    return <section className="company-section section-pad" id="company" tabIndex={-1}><div className="company-title"><span className="eyebrow">THE COMPANY IS STILL GROWING</span><h2>{t("生活有好多面，")}<br />{" "}{t("公司也会慢慢长大。")}</h2><p>{t("烦恼维修部，是我们打开的第一扇门。")}<br />{" "}{t("其他部门还在酝酿，先把眼前这一间，好好经营。")}</p><div className="company-signature">LIFE is a work in progress. <span>↗</span></div></div><div className="department-board"><div className="board-header"><span className="micro">LIFE DIRECTORY</span><InfinityIcon size={27}/></div><a className="department-open" href="#repair"><div><span className="micro">01 / NOW OPEN</span><h3>{t("烦恼维修部")}</h3><p>{t("卡住的时候，来换一种办法。")}</p></div><ArrowUpRight size={30}/></a><div className="department-soon"><span className="micro">02 / COMING SOMEDAY</span><h3>{t("下一间，留点想象。")}</h3><span className="soon-sticker">{t("筹备中")}<span>{t("没有倒计时")}</span></span></div><div className="board-bottom">{t("还有很多可能，正在路上。")}<span>∞</span></div></div></section>;
}
function TakeAway() {
    const { t } = useLocale();
    return <section className="takeaway section-pad" id="takeaway" tabIndex={-1}><div className="takeaway-art"><ModelArt id={12} context="takeaway" alt={t("三条不同的路，通向修理铺、温室与画室。")}/><span className="contact-art-note">{t("给下一步，留个接头。")}</span></div><div className="takeaway-copy"><span className="eyebrow">GOOD TO HAVE AROUND</span><h2>{t("把一点办法，")}<br />{" "}{t("装进口袋。")}</h2><p>{t("三个例子，一套可运行的工具。")}<br />{" "}{t("前往官网，继续探索更多办法。")}</p><ContactForm /></div></section>;
}
export default function App() {
    const { t, cards } = useLocale();
    const systemReduced = useSystemReducedMotion();
    const [quiet, setQuietState] = useState(() => {
        try {
            return localStorage.getItem('life-quiet') === 'true';
        }
        catch {
            return false;
        }
    });
    const [saved, setSaved] = useState<number[]>(() => {
        try {
            const value = JSON.parse(localStorage.getItem('life-saved') || '[]');
            return Array.isArray(value) ? value.filter(v => Number.isInteger(v) && cards.some(card => card.id === v)) : [];
        }
        catch {
            return [];
        }
    });
    const [savedNotice, setSavedNotice] = useState('');
    const [initialTab, setInitialTab] = useState<'read' | 'try'>('read');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [contactRequested, setContactRequested] = useState(false);
    const selected = cards.find(card => card.id === selectedId);
    const [filter, setFilter] = useState(-1);
    const [onlySaved, setOnlySaved] = useState(false);
    const reduced = !!systemReduced || quiet;
    const setQuiet = (v: boolean) => {
        setQuietState(v);
        try {
            localStorage.setItem('life-quiet', String(v));
        }
        catch { /* preference remains for this visit */ }
    };
    const toggleSave = (id: number) => {
        const next = saved.includes(id) ? saved.filter(n => n !== id) : [...saved, id];
        setSaved(next);
        try {
            localStorage.setItem('life-saved', JSON.stringify(next));
            setSavedNotice('');
        }
        catch {
            setSavedNotice('当前浏览器无法持久保存，收藏会在关闭页面后消失。');
        }
    };
    const openCard = (id: number, tab: 'read' | 'try' = 'read') => {
        setInitialTab(tab);
        if (cards.some(c => c.id === id))
            setSelectedId(id);
    };
    const openContact = () => {
        setSelectedId(null);
        setContactRequested(true);
    };
    useEffect(() => {
        if (!contactRequested) return;
        // Wait until the native dialog has closed and restored its old focus.
        const frame = requestAnimationFrame(() => {
            document.getElementById('takeaway')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' });
            document.getElementById('contact-value')?.focus({ preventScroll: true });
            setContactRequested(false);
        });
        return () => cancelAnimationFrame(frame);
    }, [contactRequested, reduced]);
    useEffect(() => {
        // Direct links arrive before React has mounted the target section.
        let id: string;
        try { id = decodeURIComponent(window.location.hash.slice(1)); }
        catch { return; }
        if (!id) return;
        const frame = requestAnimationFrame(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
        });
        return () => cancelAnimationFrame(frame);
    }, []);
    useEffect(() => { document.documentElement.dataset.motion = reduced ? 'reduced' : 'full'; return () => { delete document.documentElement.dataset.motion; }; }, [reduced]);
    return <MotionConfig reducedMotion={reduced ? 'always' : 'never'} transition={springs.gentle}>
    <a className="skip-link" href="#repair">{t("跳到模型体验")}</a><Header quiet={quiet} setQuiet={setQuiet} systemReduced={!!systemReduced}/>
    <main><Hero reduced={reduced} quiet={quiet}/>
      <div className="life-ribbon" aria-hidden="true"><span>NO KPI.</span><span className="ribbon-flower">✳︎</span><span>JUST LIFE.</span><InfinityIcon /><span>{t("人生持续营业中")}</span><span className="ribbon-flower">✳︎</span><span>MORE WAYS TO LIVE.</span></div>
      <Experience reduced={reduced} onOpen={openCard}/><GlitchCut reduced={reduced}/>
      <Gallery reduced={reduced} onOpen={openCard} saved={saved} filter={filter} setFilter={setFilter} onlySaved={onlySaved} setOnlySaved={setOnlySaved}/>
      <Introduction /><Updates /><Company /><TakeAway />
    </main>
    <footer className="site-footer section-pad"><div className="footer-top"><Brand footer/><p>{t("不必立刻想通，先找到下一步。")}</p><a href="#home" className="back-top" aria-label={t("返回顶部")}><ArrowUpRight size={23}/></a></div><div className="footer-bottom"><p>{t("日常思考与练习工具，不替代专业诊断与治疗。持续感到痛苦时，也可以向专业人士寻求支持。")}</p><span>{t("© 2026 LIFE · 人生无限公司")}</span></div></footer>
    {savedNotice && <p className="storage-notice" role="status">{t(savedNotice)}<button aria-label={t("关闭提示")} onClick={() => setSavedNotice('')}><X size={15}/></button></p>}
    <AnimatePresence>{selected && <CardModal key="card-modal" card={selected} initialTab={initialTab} onClose={() => setSelectedId(null)} onSelect={openCard} onContact={openContact} saved={saved} toggleSave={toggleSave}/>}</AnimatePresence>
  </MotionConfig>;
}
