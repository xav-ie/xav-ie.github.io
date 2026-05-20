import { useEffect, useRef } from 'react';
import Masonry from 'masonry-layout';

export const useMasonry = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const masonry = new Masonry(el, {
      itemSelector: '.project',
      columnWidth: '.project',
      gutter: 16,
      transitionDuration: 0,
    });

    let raf = 0;
    const relayout = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        masonry.layout?.();
      });
    };

    const observer = new ResizeObserver(relayout);
    for (const item of el.querySelectorAll('.project')) observer.observe(item);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      masonry.destroy?.();
    };
  }, []);

  return ref;
};
