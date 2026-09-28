import { useCallback, useEffect, useState } from "react";

import { getErrorMessage } from "@/api/axios";

// const { data, loading, error, reload, updatedAt } = useFetch(() => getDashboardStats(year), [year]);
// - runs again whenever something in `deps` changes
// - keeps the old data on screen while new data loads
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetcher()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setUpdatedAt(new Date());
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  return { data, loading, error, reload, updatedAt };
}