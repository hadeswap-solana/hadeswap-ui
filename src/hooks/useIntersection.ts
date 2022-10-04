import { useCallback, useEffect, useState, useRef } from 'react';

type UseIntersection = (props?: { isSingle?: boolean }) => {
  ref: (node?: Element) => void;
  inView: boolean;
  resetRef: () => void;
  forceStop: () => void;
};

export const useIntersection: UseIntersection = (props) => {
  const isSingle = !!props?.isSingle;

  const [ref, setRef] = useState<Element | null>(null);
  const [inView, setInView] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);

  const resetRef = useCallback(() => {
    setInView(false);
  }, []);

  const forceStop = useCallback(() => {
    ref && observer?.current?.unobserve(ref);
    setRef(null);
    setInView(false);
  }, [ref]);

  useEffect(() => {
    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(entry.isIntersecting);
        resetRef();

        if (isSingle) {
          observer?.current?.unobserve(ref);
          setRef(null);
          return;
        }
      }
    });

    ref && observer?.current?.observe(ref);

    return () => {
      ref && observer?.current?.unobserve(ref);
    };
  }, [ref, inView, resetRef, isSingle]);

  return {
    ref: setRef,
    inView,
    resetRef,
    forceStop,
  };
};
