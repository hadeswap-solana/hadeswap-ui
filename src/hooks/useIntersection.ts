import { useEffect, useState, useMemo } from 'react';

type UseIntersection = (props?: { isSingle?: boolean }) => {
  ref: (node?: Element) => void;
  inView: boolean;
};

export const useIntersection: UseIntersection = (props) => {
  const isSingle = !!props?.isSingle;

  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [ref, setRef] = useState<Element | null>(null);

  const frozen = useMemo(
    () => entry?.isIntersecting && isSingle,
    [isSingle, entry],
  );

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };

  useEffect(() => {
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !ref) return;

    const observer = new IntersectionObserver(updateEntry);

    observer.observe(ref);

    return () => observer.disconnect();
  }, [ref, isSingle, frozen]);

  return {
    ref: setRef,
    inView: !!entry?.isIntersecting,
  };
};
