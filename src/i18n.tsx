import { createContext, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import original from './content.json';
import english from './content.en.json';
import messages from './ui.en.json';
import type { Card } from './data';

export type Locale = 'zh' | 'en';
const englishCards: Card[] = original.cards.map(card => ({ ...card, ...english.cards[String(card.id) as keyof typeof english.cards] }));
const englishSources = Object.fromEntries(Object.entries(original.sources).map(([key, source]) => [key, [...source.slice(0, 3), english.sourceNotes[key as keyof typeof english.sourceNotes]]])) as Record<string, string[]>;
const zhMoods = ['脑内太吵','迟迟没动','选不出来','关系费电','有点没电','对自己太狠'];
type I18n = { locale: Locale; setLocale: (locale: Locale) => void; t: (text: string) => string; cards: Card[]; departments: string[][]; moods: string[]; sources: Record<string, string[]> };
const Context = createContext<I18n | null>(null);
function initialLocale(): Locale {
  const requested = new URLSearchParams(location.search).get('lang');
  if (requested === 'en' || requested === 'zh') return requested;
  try { return localStorage.getItem('life-locale') === 'en' ? 'en' : 'zh'; } catch { return 'zh'; }
}
export function LocaleProvider({children}: {children: ReactNode}) {
  const [locale, update] = useState<Locale>(initialLocale);
  const setLocale = (next: Locale) => {
    update(next);
    try { localStorage.setItem('life-locale', next); } catch { /* session preference still works */ }
    const url = new URL(location.href); url.searchParams.set('lang', next);
    history.replaceState(null, '', url);
  };
  useLayoutEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN';
    document.documentElement.dataset.locale = locale;
    document.title = locale === 'en' ? 'LIFE Unlimited — Worry Repair Department' : '人生无限公司 — 烦恼维修部';
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', locale === 'en' ? 'A little room for every version of you. Try three example cards in the open-source Worry Repair demo. Find all 24 tools on the official website.' : '烦恼维修部开源示例：三张工具卡与小练习，完整 24 张工具卡请访问官网。');
  }, [locale]);
  const value = useMemo<I18n>(() => ({
    locale, setLocale,
    t: (text) => locale === 'zh' ? text : (messages as Record<string,string>)[text] ?? text,
    cards: locale === 'zh' ? original.cards : englishCards,
    departments: locale === 'zh' ? original.departments : english.departments,
    moods: locale === 'zh' ? zhMoods : english.moods,
    sources: locale === 'zh' ? original.sources : englishSources,
  }), [locale]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useLocale() { const context = useContext(Context); if (!context) throw new Error('LocaleProvider is required'); return context; }
export function LanguageSwitch() {
  const {locale, setLocale} = useLocale();
  return <button className="language-switch" onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')} aria-label={locale === 'zh' ? 'Switch to English' : '切换到中文'} title={locale === 'zh' ? 'Switch to English' : '切换到中文'}>
    <span lang="zh-CN" className={locale === 'zh' ? 'current' : ''}>中</span><span className="language-divider" aria-hidden="true">/</span><span lang="en" className={locale === 'en' ? 'current' : ''}>EN</span>
  </button>;
}
