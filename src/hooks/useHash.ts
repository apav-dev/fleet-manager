import { useEffect, useState } from "react";

// A hook that tracks the current hash in a URL.
export default function useHash() {
  const [hash, setHash] = useState(() =>
    typeof window !== "undefined" ? window.location.hash : ""
  );

  useEffect(() => {
    // Ensure this component is only mounted in a browser-like environment
    if (typeof window !== "undefined") {
      const handleHashChange = () => setHash(window.location.hash);

      // Subscribe to hash changes
      window.addEventListener("hashchange", handleHashChange);

      // Clean up subscription on unmount
      return () => {
        window.removeEventListener("hashchange", handleHashChange);
      };
    }
  }, []); // Empty array means this effect runs once on mount and clean up on unmount

  return hash;
}
