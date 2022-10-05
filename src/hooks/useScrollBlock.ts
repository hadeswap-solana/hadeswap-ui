import { useEffect } from "react";

export const useScrollBlock = (boolValue: boolean): void => {
  useEffect(() => {
    boolValue && (document.body.style.overflow = "hidden");
    return () => document.body.style.overflow = null;
  }, [boolValue]);
};
