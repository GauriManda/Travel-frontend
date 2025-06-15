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
        console.log("useFetch - requiresAuth:", requiresAuth);
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

        // Only add auth header if we have a token AND either requiresAuth is true OR we have a user
        if (token && (requiresAuth || hasUser)) {
          headers["Authorization"] = `Bearer ${token}`;
          console.log("Added Authorization header");
        } else {
          console.log("No Authorization header added");
        }

        console.log("Making request to:", url);
        console.log("Headers:", headers);

        const res = await fetch(url, {
          headers,
          signal,
        });

        console.log("Response status:", res.status);
        console.log("Response ok:", res.ok);

        if (!res.ok) {
          let errorMessage = `HTTP error! Status: ${res.status}`;
          try {
            const errorData = await res.json();
            console.log("Error response data:", errorData);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (parseError) {
            console.log("Could not parse error response:", parseError);
          }
          throw new Error(errorMessage);
        }

        const result = await res.json();
        console.log("🔍 Full result from API:", result);

        if (!signal.aborted) {
          // Try to handle different response structures
          if (result.data) {
            setData(result.data);
          } else if (result.tours) {
            setData(result.tours);
          } else if (Array.isArray(result)) {
            setData(result);
          } else {
            setData(result);
          }
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
