import { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal — wraps children and reveals them with a cinematic animation
 * when they scroll into view.
 *
 * Props:
 *   animation  'fadeUp' | 'fadeLeft' | 'fadeRight' | 'scaleIn' | 'fadeIn'
 *   delay      ms  (default 0)
 *   duration   ms  (default 800)
 *   threshold  0-1 (default 0.15)
 *   once       bool (default true)
 *   className  extra CSS classes
 *   as         wrapper element (default 'div')
 */
export default function ScrollReveal({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 800,
  threshold = 0.15,
  once = true,
  className = '',
  as: Tag = 'div',
  ...rest
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return (
    <Tag
      ref={ref}
      className={`sr sr-${animation} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ '--sr-delay': `${delay}ms`, '--sr-duration': `${duration}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
