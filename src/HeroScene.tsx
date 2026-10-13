import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import type { MotionValue } from 'motion/react';
import { useLocale } from './i18n';

const Scene = lazy(() => import('./Scene'));
class SceneBoundary extends Component<{children:ReactNode}, {failed:boolean}> {
  state = {failed:false};
  static getDerivedStateFromError() { return {failed:true}; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function HeroScene({progress, reduced, quiet}: {progress:MotionValue<number>; reduced:boolean; quiet:boolean}) {
  const {t} = useLocale();
  const cover = useRef<HTMLImageElement>(null);
  const [texture, setTexture] = useState('');
  const [enhance, setEnhance] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (reduced || quiet || !texture) { setEnhance(false); setReady(false); return; }
    const connection = (navigator as Navigator & {connection?:{saveData?:boolean;effectiveType?:string}}).connection;
    if (connection?.saveData || ['slow-2g','2g'].includes(connection?.effectiveType || '')) return;
    let cancelled = false;
    let timer = 0, idle = 0;
    // Reading, fonts and the first image get priority; WebGL is an enhancement.
    Promise.all([cover.current?.decode().catch(() => {}), document.fonts.ready]).then(() => {
      if (cancelled) return;
      timer = window.setTimeout(() => {
        const start = () => { if (!cancelled) setEnhance(true); };
        if ('requestIdleCallback' in window) idle = window.requestIdleCallback(start, {timeout:2000});
        else start();
      }, 800);
    });
    return () => { cancelled = true; clearTimeout(timer); if (idle) window.cancelIdleCallback(idle); };
  }, [reduced, quiet, texture]);
  return <div className={`scene-shell ${ready && !reduced && !quiet ? 'scene-enhanced' : ''}`}>
    <img ref={cover} className="scene-poster" src="/optimized/v2.3/cover-800.webp"
      srcSet="/optimized/v2.3/cover-480.webp 480w, /optimized/v2.3/cover-800.webp 800w, /optimized/v2.3/cover-1200.webp 1200w, /art/cover.webp 1400w"
      sizes="(max-width:760px) 58vw, 59vw" width="1400" height="933"
      fetchPriority="high" decoding="async" alt={ready ? '' : t("花草环绕的烦恼维修小屋")}
      onLoad={event => { const next = event.currentTarget.currentSrc; if (next !== texture) { setReady(false); setTexture(next); } }}/>
    {enhance && !reduced && !quiet && cover.current && <SceneBoundary><Suspense fallback={null}>
      <Scene key={texture} progress={progress} reduced={reduced} quiet={quiet} coverImage={cover.current} onReady={setReady}/>
    </Suspense></SceneBoundary>}
  </div>;
}
