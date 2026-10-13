import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Info, Plus } from 'lucide-react';
import { useLocale } from './i18n';
import { springs } from './motion-tokens';
import { useNearViewport } from './useNearViewport';
import ModelArt from './ModelArt';

type Props = { reduced: boolean; onOpen: (id: number, tab?: 'read' | 'try') => void };

export default function Experience({ reduced, onOpen }: Props) {
  const { t, cards } = useLocale();
  const example = cards.find(card => card.id === 8)!;
  const parts = [
    { name: t("如果"), label: t("午饭后坐回工位，放下水杯"), title: t("具体到，一出现就能认出来。"), copy: t("“有空”没有明确的信号。坐回工位、放下水杯，是一个看得见、常发生的时刻。"), prompt: t("换成你的：一天里，哪个日常动作可以提醒你？"), move: { x: -9, y: -7, rotate: -1 } },
    { name: t("我就"), label: t("写一条今天已确认的决定"), title: t("小到，当下就能动手。"), copy: t("不要求整理完整份记录，先写一条就好。如果那个时刻总在开会，就换一个做得到的情境。"), prompt: t("换成你的：那一刻，能立刻做的一个小动作是什么？"), move: { x: 9, y: 7, rotate: 1 } },
  ];
  const [selected, setSelected] = useState(0);
  const [preview, setPreview] = useState<number | null>(null);
  const [exploded, setExploded] = useState(false);
  const { ref, near } = useNearViewport<HTMLDivElement>('300px');
  const visual = preview ?? selected;

  return <section id="repair" tabIndex={-1} aria-labelledby="repair-title" className="ifthen-section section-pad" data-effect="hotspot-exploded">
    <div className="experience-heading">
      <span className="eyebrow">{t("01 / 从一个日常烦恼开始")}</span>
      <h2 id="repair-title">{t("给“有空就做”，")}<br/>{t("补个收件地址。")}</h2>
      <p className="body-copy ifthen-lead">{example.when}</p>
    </div>
    <div className="ifthen-layout">
      <div ref={ref} className="ifthen-demo">
        <figure className="ifthen-figure">
          <div className="ifthen-stage" role="img" aria-label={t("水杯牵动开关，台灯照亮笔记本：把一个日常时刻，接到一个小动作。")}>
            {/* Two windows onto the same reviewed art. File and label anchors stay intact. */}
            {near && parts.map((part, i) => <motion.div key={i} aria-hidden="true" className={`ifthen-art-part ifthen-art-part-${i}`} animate={!reduced && (preview !== null || exploded) ? { ...part.move, opacity: visual === i ? 1 : .78 } : { x: 0, y: 0, rotate: 0, opacity: 1 }} transition={reduced ? { duration: 0 } : springs.gentle}><ModelArt id={8} context="takeaway"/></motion.div>)}
          </div>
          <figcaption className="ifthen-art-caption">{t("放下水杯，让记录有个开始。")}</figcaption>
        </figure>
        <div className="ifthen-switches" role="group" aria-label={t("拆开看看这句计划")} aria-describedby="ifthen-instruction">
          {parts.map((part, i) => <button type="button" key={i} className={`ifthen-switch ${selected === i ? 'active' : ''}`} onPointerEnter={e => { if (e.pointerType === 'mouse') setPreview(i); }} onPointerLeave={() => setPreview(null)} onFocus={() => setPreview(i)} onBlur={() => setPreview(null)} onClick={() => { setSelected(i); setExploded(true); }} aria-pressed={selected === i} aria-controls="ifthen-detail"><span aria-hidden="true">{selected === i ? <Check size={17}/> : <Plus size={17}/>}</span>{i === 0 ? t("如果：具体时刻") : t("我就：小动作")}</button>)}
        </div>
        <p className="ui-hint" id="ifthen-instruction"><Info size={17} aria-hidden="true"/><span>{t("点选上面的按钮，看看这句话为什么更容易开始。")}</span></p>
      </div>
      <div className="ifthen-plan">
        <div className="ifthen-plan-intro">
          <h3 className="ifthen-plan-title">{t("把“有空记一下”，换成这句：")}</h3>
          <div className="ifthen-sentence" aria-label={t("一条具体的行动计划")}>
            {parts.map((part, i) => <p key={i} className={selected === i ? 'is-current' : ''}><span>{part.name}</span><strong>{part.label}</strong></p>)}
          </div>
        </div>
        <div className="ifthen-detail" id="ifthen-detail" aria-live="polite" aria-atomic="true">
          <p className="ifthen-selected"><Check size={15} aria-hidden="true"/>{t("正在拆解")}{' · '}{parts[selected].name}</p>
          <h4>{parts[selected].title}</h4>
          <p className="body-copy">{parts[selected].copy}</p>
          <p className="ui-hint"><Info size={17} aria-hidden="true"/><span>{parts[selected].prompt}</span></p>
        </div>
        <div className="ifthen-next">
          <p className="ifthen-model"><span>TOOL 08</span>{example.model}</p>
          <button type="button" className="button primary" onClick={() => onOpen(8, 'try')}>{t("写下我的“如果……就……”")}<ArrowRight size={19} aria-hidden="true"/></button>
          <p className="action-caption">{t("打开这张卡，把例子换成自己的行动。")}</p>
        </div>
      </div>
    </div>
  </section>;
}
