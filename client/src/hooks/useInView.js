import { useEffect, useRef, useState } from 'react';

// Tells you when an element is on screen. Usage: const [ref, inView] = useInView(); <div ref={ref} />
export default function useInView({ threshold = 0.15, rootMargin = '0px' } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold, rootMargin });
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView];
}
