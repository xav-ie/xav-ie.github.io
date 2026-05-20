import { useEffect, useRef } from 'react';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

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
    const imgLoad = imagesLoaded(el);
    const relayout = () => masonry.layout?.();
    imgLoad.on('progress', relayout);
    return () => {
      imgLoad.off('progress', relayout);
      masonry.destroy?.();
    };
  }, []);

  return ref;
};
