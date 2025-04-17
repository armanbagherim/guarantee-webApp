import { useQuery, UseQueryResult } from "react-query";
import { getSession } from "next-auth/react";

interface FetcherParams {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: Record<any>;
  isFile?: boolean;
  responseType?: "json" | "blob";
  fileName?: string; // Optional filename for blob downloads
}

interface FetcherReturn {
  data: unknown;
  isLoading: boolean;
  error: Error | null;
}

export const fetcher = async ({
  url,
  method,
  body,
  isFile,
  responseType = "json",
  fileName,
}: FetcherParams): Promise<unknown> => {
  const session = await getSession();

  const requestOptions: RequestInit = {
    method: method,
    keepalive: true,
    headers: {
      "Content-Type": `${isFile ? "multipart/form-data" : "application/json"}`,
      Authorization: `Bearer ${session?.token || ""}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + url,
    requestOptions
  );

  if (!response.ok) {
    // Handle error cases
    let result;
    try {
      result = await response.json();
    } catch (e) {
      throw new Error(response.statusText);
    }

    let errorText = "";
    if (typeof result.errors === "string") {
      errorText = result.errors;
    } else if (Array.isArray(result.errors)) {
      result.errors.map((value) => {
        errorText += value + "\n";
      });
    } else {
      errorText = response.statusText;
    }
    throw new Error(errorText);
  }

  // Handle successful blob response
  if (responseType === "blob") {
    const blob = await response.blob();

    // If running in browser, trigger download
    if (typeof window !== "undefined") {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "download"; // Use provided filename or default to "download"
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }

    return blob;
  }

  // Default JSON response
  return await response.json();
};

interface UseFetcherOptions {
  onSuccess?: (data: unknown) => void;
  responseType?: "json" | "blob";
  fileName?: string;
}

const useFetcher = (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: Record<string, unknown>,
  options: UseFetcherOptions = {}
): UseQueryResult<unknown, Error> => {
  return useQuery([url, method, body], () => fetcher({
    url,
    method,
    body,
    responseType: options.responseType,
    fileName: options.fileName
  }), {
    staleTime: Infinity,
    onSuccess: options.onSuccess,
  });
};

export { useFetcher };