import { useState, useEffect } from "react";

const useSimpleFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // More specific error handling
          if (response.status === 401) {
            throw new Error(
              "Authentication required. Please log in to view featured tours."
            );
          } else if (response.status === 403) {
            throw new Error(
              "Access forbidden. You don't have permission to view this content."
            );
          } else if (response.status === 404) {
            throw new Error(
              "Tours not found. The requested resource does not exist."
            );
          } else if (response.status >= 500) {
            throw new Error("Server error. Please try again later.");
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        const result = await response.json();

        // Handle different response structures
        let extractedData;
        if (result.success === false) {
          throw new Error(result.message || "Failed to fetch tours");
        } else if (result.data !== undefined) {
          extractedData = result.data;
        } else if (result.tours !== undefined) {
          extractedData = result.tours;
        } else if (Array.isArray(result)) {
          extractedData = result;
        } else {
          extractedData = result;
        }

        setData(extractedData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]); // Only depend on URL

  return { data, loading, error };
};

export default useSimpleFetch;
