import { useCallback, useEffect, useState } from 'react';

type UseIntersection = (props?: { isSingle?: boolean }) => {
  ref: (node?: Element) => void;
  inView: boolean;
  resetRef: () => void;
};

export const useIntersection: UseIntersection = (props) => {
  const isSingle = !!props?.isSingle;

  const [ref, setRef] = useState<Element | null>(null);
  const [inView, setInView] = useState(false);

  const resetRef = useCallback(() => {
    setInView(false);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(entry.isIntersecting);
        resetRef();

        if (isSingle) {
          observer.unobserve(ref);
          setRef(null);
          return;
        }
      }
    });

    ref && observer.observe(ref);

    return () => {
      ref && observer.unobserve(ref);
    };
  }, [ref, inView, resetRef, isSingle]);

  return {
    ref: setRef,
    inView,
    resetRef,
  };
};
