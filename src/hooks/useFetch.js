import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useFetch = (url, requiresAuth = false) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { hasUser, token } = useContext(AuthContext);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("useFetch - URL:", url);
        console.log("useFetch - hasUser:", hasUser);
        console.log("useFetch - token:", token ? "Token exists" : "No token");

        if (requiresAuth && !hasUser) {
          setData(null);
          setError("Authentication required");
          setLoading(false);
          return;
        }

        if (!url || typeof url !== "string") {
          throw new Error(`Invalid URL: ${url}`);
        }

        const headers = {
          "Content-Type": "application/json",
        };

        if (hasUser && token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        console.log("Making request to:", url);
        console.log("Headers:", headers);

        const res = await fetch(url, {
          headers,
          signal,
        });

        if (!res.ok) {
          let errorMessage = `HTTP error! Status: ${res.status}`;
          try {
            const errorData = await res.json();
            errorMessage = errorData.message || errorMessage;
          } catch {}
          throw new Error(errorMessage);
        }

        const result = await res.json();
        console.log("🔍 result from API:", result);

        if (!signal.aborted) {
          setData(result.data); // ✅ adjust this if your API returns data inside another object (e.g., result.data.tours)
        }
      } catch (err) {
        if (!signal.aborted) {
          console.error("Fetch Error:", err);
          setError(err.message || "An error occurred while fetching data");
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (url) {
      fetchData();
    }

    return () => controller.abort();
  }, [url, hasUser, token, requiresAuth]);

  return { data, loading, error };
};

export default useFetch;
