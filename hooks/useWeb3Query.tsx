import { useState } from "react";

function useWeb3Query<T>(request: () => Promise<T>) {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    try {
      setLoading(true);
      setError(undefined);
      setData(undefined);

      const response = await request();
      setData(response);
    } catch (error: any) {
      console.log(error);
      setError(
        error?.walk?.()?.shortMessage ||
          error?.walk?.()?.message ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, fetch };
}

export default useWeb3Query;
