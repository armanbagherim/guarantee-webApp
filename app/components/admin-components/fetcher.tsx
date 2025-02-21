import { useQuery, UseQueryResult } from "react-query";
import { getSession } from "next-auth/react";

interface FetcherParams {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: Record<any>;
  isFile?: boolean;
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
}: FetcherParams): Promise<unknown> => {
  const session = await getSession();

  const requestOptions: RequestInit = {
    method: method,
    keepalive: true,
    headers: {
      "Content-Type": `${isFile ? "multipart/form-data" : "application/json"}`,
      Authorization: `Bearer ${session?.token || ""}`,
    },
    body: JSON.stringify(body),
  };
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + url,
    requestOptions
  );
  let result = await response.json();
  if (response.ok) {
    return result;
  } else {
    let errorText = "";
    if (typeof result.errors === "string") {
      errorText = result.errors;
    } else {
      result.errors.map((value) => {
        errorText += value + "\n";
      });
    }
    throw new Error(errorText);
  }
};

interface UseFetcherOptions {
  onSuccess?: (data: unknown) => void;
}

const useFetcher = (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: Record<string, unknown>,
  options: UseFetcherOptions = {}
): UseQueryResult<unknown, Error> => {
  return useQuery([url, method, body], () => fetcher({ url, method, body }), {
    staleTime: Infinity,
    onSuccess: options.onSuccess,
  });
};

export { useFetcher };
