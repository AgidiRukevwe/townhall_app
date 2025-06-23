// hooks/useHorizontalScroll.ts
import { useEffect, useRef, useState } from "react";

interface ScrollState {
  atStart: boolean;
  atEnd: boolean;
}

export function useHorizontalScroll<T extends string>() {
  const scrollRefs = useRef<Record<T, HTMLDivElement | null>>(
    {} as Record<T, HTMLDivElement | null>
  );
  const [scrollState, setScrollState] = useState<Record<T, ScrollState>>(
    {} as Record<T, ScrollState>
  );

  const updateScrollState = (key: T) => {
    const container = scrollRefs.current[key];
    if (!container) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setScrollState((prev) => ({
      ...prev,
      [key]: {
        atStart: container.scrollLeft <= 5,
        atEnd: container.scrollLeft >= maxScrollLeft - 5,
      },
    }));
  };

  useEffect(() => {
    const listeners: { key: T; handler: () => void }[] = [];

    Object.keys(scrollRefs.current).forEach((key) => {
      const container = scrollRefs.current[key as T];
      if (container) {
        const handler = () => updateScrollState(key as T);
        container.addEventListener("scroll", handler);
        updateScrollState(key as T);
        listeners.push({ key: key as T, handler });
      }
    });

    return () => {
      listeners.forEach(({ key, handler }) => {
        const container = scrollRefs.current[key];
        container?.removeEventListener("scroll", handler);
      });
    };
  }, []);

  const scrollBy = (key: T, direction: "left" | "right", amount = 300) => {
    const container = scrollRefs.current[key];
    if (!container) return;

    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - amount
        : container.scrollLeft + amount;

    container.scrollTo({ left: newScrollLeft, behavior: "smooth" });

    setTimeout(() => updateScrollState(key), 300);
  };

  return {
    scrollRefs,
    scrollState,
    scrollBy,
  };
}
