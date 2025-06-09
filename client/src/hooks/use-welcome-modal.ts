import { useState, useEffect } from "react";

export function useWelcomeModal() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem("townhall-welcome-seen");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const markWelcomeAsSeen = () => {
    localStorage.setItem("townhall-welcome-seen", "true");
    setShowWelcome(false);
  };

  const resetWelcome = () => {
    localStorage.removeItem("townhall-welcome-seen");
    setShowWelcome(true);
  };

  return {
    showWelcome,
    markWelcomeAsSeen,
    resetWelcome,
  };
}
