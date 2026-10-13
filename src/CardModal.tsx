'use client';
import { useEffect, useRef, useState } from 'react';
import { MessageCircle, ArrowLeft, ArrowRight, Check, ChevronDown, ExternalLink, Heart, Info, X } from 'lucide-react';
import { cardTitle, colors, type Card } from './data';
import { LanguageSwitch, useLocale } from './i18n';
import ModelArt, { ModelLegend } from './ModelArt';
type Props = {
    card: Card;
    initialTab: 'read' | 'try';
    onClose: () => void;
    onSelect: (id: number) => void;
    onContact: () => void;
    saved: number[];
    toggleSave: (id: number) => void;
};
export default function CardModal({ card, initialTab, onClose, onSelect, onContact, saved, toggleSave }: Props) {
    const { t, cards, departments, sources } = useLocale();
    const dialog = useRef<HTMLDialogElement>(null);
    const restoreFocus = useRef(true);
    const content = useRef<HTMLDivElement>(null);
    const [tab, setTab] = useState<'read' | 'try'>(initialTab);
    const [note, setNote] = useState('');
    const [notice, setNotice] = useState('');
    const [clearedDraft, setClearedDraft] = useState<string | null>(null);
    useEffect(() => {
        const previous = document.activeElement as HTMLElement;
        const element = dialog.current;
        element?.showModal();
        const old = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            element?.close();
            document.body.style.overflow = old;
            if (restoreFocus.current && previous?.isConnected)
                previous.focus({ preventScroll: true });
        };
    }, []);
    useEffect(() => {
        setTab(initialTab);
        setClearedDraft(null);
        setNotice('');
        content.current?.scrollTo(0, 0);
        try {
            setNote(localStorage.getItem(`life-note-${card.id}`) || '');
        }
        catch {
            setNote('');
        }
        const frame = requestAnimationFrame(() => {
            if (initialTab === 'try') showPractice();
        });
        return () => cancelAnimationFrame(frame);
    }, [card.id, initialTab]);
    function showPractice() {
        setTab('try');
        document.getElementById('tab-try')?.focus({ preventScroll: true });
        const tabs = dialog.current?.querySelector('.modal-tabs');
        if (tabs && content.current) {
            content.current.scrollTop += tabs.getBoundingClientRect().top - content.current.getBoundingClientRect().top - 16;
        }
    }
    function saveNote() {
        try {
            localStorage.setItem(`life-note-${card.id}`, note);
            setNotice('已保存到这台设备，只有你能在此查看。');
        }
        catch {
            setNotice('这个浏览器暂时无法保存，请先复制你的笔记。');
        }
    }
    function clearNote() {
        setClearedDraft(note);
        try {
            localStorage.removeItem(`life-note-${card.id}`);
        }
        catch { /* no stored note */ }
        setNote('');
        setNotice('这张卡的笔记已清空。');
    }
    function undoClear() {
        setNote(clearedDraft || '');
        setClearedDraft(null);
        setNotice('已恢复草稿，记得保存笔记。');
        document.getElementById('personal-note')?.focus();
    }
    const cardIndex = cards.findIndex(item => item.id === card.id);
    const adjacent = (delta: number) => onSelect(cards[(cardIndex + delta + cards.length) % cards.length].id);
    const requestContact = () => {
        // Close the native top layer before moving to a field outside it.
        restoreFocus.current = false;
        dialog.current?.close();
        onContact();
    };
    return <dialog ref={dialog} className="card-modal" aria-labelledby="modal-title" onCancel={onClose} onClick={e => {
            if (e.target === e.currentTarget)
                onClose();
        }}>
    <div className="modal-shell" style={{ '--accent': colors[card.dept] } as React.CSSProperties}>
      <div className="modal-top"><span className="micro">LIFE TOOL / {String(card.id).padStart(2, '0')}</span><span>{departments[card.dept][0]}</span><LanguageSwitch /><button className="icon-button" onClick={onClose} aria-label={t("关闭卡片")}><X size={22}/></button></div>
      <div className="modal-body" ref={content}>
        <div className="modal-visual">
          <span className="tag">{card.kind}</span>
          <h2 id="modal-title">{card.title.split('|').map(t => <span key={t}>{t}</span>)}</h2>
          <ModelArt id={card.id} alt={cardTitle(card)} context="detail"/>
          <ModelLegend id={card.id}/>
          <p className="model-name">{card.model}</p>
          <div className="modal-actions"><button className={`save-button ${saved.includes(card.id) ? 'is-saved' : ''}`} onClick={() => toggleSave(card.id)} aria-pressed={saved.includes(card.id)}><Heart size={17} fill={saved.includes(card.id) ? 'currentColor' : 'none'}/>{saved.includes(card.id) ? t("已放进我的抽屉") : t("放进我的抽屉")}</button><button className="contact-card-link" onClick={requestContact}><MessageCircle size={17}/>{t("了解完整卡包")}</button></div>
        </div>
        <div className="modal-reading">
          <div className="modal-tabs" role="tablist" aria-label={t("卡片内容")}><button id="tab-read" role="tab" aria-selected={tab === 'read'} aria-controls="panel-read" tabIndex={tab === 'read' ? 0 : -1} onKeyDown={e => {
            if (e.key === 'ArrowRight') {
                setTab('try');
                document.getElementById('tab-try')?.focus();
            }
        }} onClick={() => setTab('read')}>{t("看懂这一招")}</button><button id="tab-try" role="tab" aria-selected={tab === 'try'} aria-controls="panel-try" tabIndex={tab === 'try' ? 0 : -1} onKeyDown={e => {
            if (e.key === 'ArrowLeft') {
                setTab('read');
                document.getElementById('tab-read')?.focus();
            }
        }} onClick={() => setTab('try')}>{t("换成我的事")}</button></div>
          <div id="panel-read" role="tabpanel" aria-labelledby="tab-read" hidden={tab !== 'read'}>
            <p className="modal-when">{card.when}</p>
            <h3>{t("这招在做什么")}</h3><p>{card.mechanism}</p>
            <div className="story"><span className="micro">LIFE, FOR EXAMPLE</span><h3>{card.story_title}</h3><p>{card.story}</p></div>
            <button className="button primary" onClick={showPractice}>{t("写下我的下一步")}<ArrowRight size={18}/></button>
          </div>
          <div id="panel-try" role="tabpanel" aria-labelledby="tab-try" hidden={tab !== 'try'}>
            <p className="modal-when">{card.punch}</p>
            <ol className="steps">{card.steps.map(([title, body], index) => <li key={title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
            <label className="note-label" htmlFor="personal-note">{t("你的下一步（选填）")}</label><p id="note-prompt" className="note-prompt ui-hint"><Info size={17}/><span>{card.output}</span></p>
            <textarea id="personal-note" aria-describedby="note-prompt note-storage" value={note} onChange={e => { setClearedDraft(null); setNote(e.target.value); setNotice('尚未保存，记得点一下“保存笔记”。'); }} placeholder={t("愿意的话，在这里留一点自己的想法……")} maxLength={4000}/>
            <div className="note-actions"><button className="button secondary clear-note" disabled={!note} onClick={clearNote}>{t("清空")}</button></div>
            <p className="note-status" role="status">{t(notice)}{clearedDraft !== null && <button className="text-link" onClick={undoClear}>{t("撤销清空")}</button>}</p><p className="note-storage" id="note-storage"><Info size={15}/>{t("笔记只留在当前浏览器，不会上传。")}</p>
          </div>
          <details className="boundaries"><summary>{t("什么时候要换一种办法")}<ChevronDown size={16}/></summary><p>{card.boundary}</p><p>{card.next}</p></details>
          <details className="sources"><summary>{t("模型从哪里来")}<ChevronDown size={16}/></summary>{card.sources.map(key => { const source = sources[key]; return <div className="source" key={key}><a href={source[2]} target="_blank" rel="noreferrer">{source[0]} · {source[1]} <ExternalLink size={12}/></a><p>{source[3]}</p></div>; })}</details>
        </div>
      </div>
      <div className={`modal-foot ${tab === 'try' ? 'practice-foot' : ''}`}>
        {tab === 'try' ? <><button onClick={() => { setTab('read'); document.getElementById('tab-read')?.focus(); }}><ArrowLeft size={17}/>{t("返回解读")}</button><button className="small-button" onClick={saveNote}><Check size={16}/>{notice === '已保存到这台设备，只有你能在此查看。' ? t("已保存") : t("保存笔记")}</button></> : <><button onClick={() => adjacent(-1)}><ArrowLeft size={17}/>{t("上一张")}</button><span className="micro">{String(cardIndex + 1).padStart(2, '0')} / {cards.length}</span><button onClick={() => adjacent(1)}>{t("下一张")}<ArrowRight size={17}/></button></>}
      </div>
    </div>
  </dialog>;
}
