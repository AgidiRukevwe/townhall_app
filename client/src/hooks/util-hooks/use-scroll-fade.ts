import { useEffect, useState } from "react";

export function useScrollFade(delay = 150) {
  const [hidden, setHidden] = useState(false);
  let lastScrollY = 0;
  let timeout: NodeJS.Timeout;

  useEffect(() => {
    const updateScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setHidden(true);
      } else {
        // Scrolling up
        setHidden(false);
      }

      lastScrollY = currentScrollY;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setHidden(false); // Fade in after user stops scrolling
      }, delay);
    };

    window.addEventListener("scroll", updateScroll);
    return () => {
      window.removeEventListener("scroll", updateScroll);
      clearTimeout(timeout);
    };
  }, [delay]);

  return hidden;
}
