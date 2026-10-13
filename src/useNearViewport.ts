import { useEffect, useRef, useState } from 'react';

// Native lazy images can fetch several screens ahead. This also clips the
// horizontal carousel, so only the approaching cards request artwork.
export function useNearViewport<T extends Element>(margin = '320px') {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element || near) return;
    if (!('IntersectionObserver' in window)) { setNear(true); return; }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setNear(true);
        observer.disconnect();
      }
    }, {rootMargin:margin});
    observer.observe(element);
    return () => observer.disconnect();
  }, [margin, near]);
  return {ref, near};
}
