// import { useEffect, useRef, useState } from "react";

// export function useScrollFade(delay = 150) {
//   const [isScrolling, setIsScrolling] = useState(false);
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolling(true);
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);

//       timeoutRef.current = setTimeout(() => {
//         setIsScrolling(false);
//       }, delay);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     };
//   }, [delay]);

//   return isScrolling;
// }

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
