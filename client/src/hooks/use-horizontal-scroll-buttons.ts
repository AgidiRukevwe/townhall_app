import { useCallback, useEffect, useRef, useState } from "react";

export function useHorizontalScrollButtons() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateScrollState = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;

    setAtStart(scrollLeft <= 0);
    setAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth);
  }, []);

  const scroll = (direction: "left" | "right", amount = 300) => {
    const container = containerRef.current;
    if (!container) return;

    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - amount
        : container.scrollLeft + amount;

    container.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  };

  // Assign scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    updateScrollState();
    container.addEventListener("scroll", updateScrollState);

    return () => {
      container.removeEventListener("scroll", updateScrollState);
    };
  }, [updateScrollState]);

  // Expose ref callback
  const refCallback = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    if (node) updateScrollState();
  };

  return {
    atStart,
    atEnd,
    scroll,
    ref: refCallback,
  };
}
