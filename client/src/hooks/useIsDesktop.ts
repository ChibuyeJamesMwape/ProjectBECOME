import { useEffect, useState } from "react";

export function useIsDesktop(breakpointPx = 900): boolean {
  const query = `(min-width: ${breakpointPx}px)`;
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setIsDesktop(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return isDesktop;
}
