import { art } from './data';
import { useLocale } from './i18n';
import allLabels from './art-labels.json';
import { useState } from 'react';
import { useNearViewport } from './useNearViewport';
// Both languages share reviewed sign centers; visible ink, not line boxes, is centered.
export default function ModelArt({id,alt='',context='gallery'}:{id:number;alt?:string;context?:'gallery'|'detail'|'takeaway'}) {
  const {locale}=useLocale();
  const {ref, near} = useNearViewport<HTMLDivElement>();
  const [loadedId, setLoadedId] = useState<number | null>(null);
  const name = String(id).padStart(2,'0');
  const sizes = context === 'detail' ? '(max-width:760px) 88vw, 520px' : context === 'takeaway' ? '(max-width:760px) 88vw, 46vw' : '(max-width:760px) 34vw, (max-width:1100px) 33vw, 350px';
  const labels=allLabels[String(id) as keyof typeof allLabels] || [];
  return <div ref={ref} className={`model-art model-art-${id}`}>
    {(near || context === 'detail') && <img key={id} src={art(id)} srcSet={`/optimized/v2.3/${name}-360.webp 360w, /optimized/v2.3/${name}-640.webp 640w, ${art(id)} 1000w`} sizes={sizes} alt={alt} width="1536" height="1024" decoding="async" draggable="false" onLoad={() => setLoadedId(id)}/>}
    <svg className="art-labels" style={{visibility:loadedId === id ? 'visible' : 'hidden'}} viewBox="0 0 1536 1024" role="img" aria-label={labels.map(label=>label[locale].text).join(', ')} aria-hidden={labels.length===0 || undefined}>
      {labels.map(label=>{const run=label[locale];return <g key={label.key} data-label={label.key} transform={`translate(${label.x} ${label.y}) rotate(${label.angle})`}>
        <text x={run.dx} y={run.dy} fontSize={run.fontSize} fontWeight="700" style={{fontKerning:'none',fontVariantLigatures:'none'}}>{run.text}</text>
      </g>;})}
    </svg>
  </div>;
}
export function ModelLegend({id}:{id:number}) {
  const {locale}=useLocale();
  const items=id===4?(locale==='zh'?['直接行动','协商影响','暂不可改变']:['Act directly','Influence together','Cannot change yet']):id===13?(locale==='zh'?['观察','感受','需要','请求']:['Observation','Feeling','Need','Request']):[];
  if(!items.length)return null;
  return <ol className="model-legend">{items.map((item,index)=><li key={index}><span>{index+1}</span>{item}</li>)}</ol>;
}
