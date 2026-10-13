import { useEffect, useState } from 'react';

// Listen for preference changes while the page is open as well as on load.
// The first render is deterministic and does not read browser globals.
export function useSystemReducedMotion() {
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync=()=>setReduced(media.matches);
    sync();media.addEventListener('change',sync);
    return ()=>media.removeEventListener('change',sync);
  },[]);
  return reduced;
}
