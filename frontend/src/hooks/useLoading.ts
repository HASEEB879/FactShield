"use client";

import { useEffect, useState } from "react";

export default function useLoading(duration = 5000) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return loading;
}