import { QueryClient } from "@tanstack/react-query";

async function defaultQueryFn({ queryKey }: { queryKey: readonly unknown[] }) {
  const url = queryKey[0] as string;
  const response = await fetch(url, {
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }
  return response.json();
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export async function apiRequest(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  body?: unknown
): Promise<Response> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response;
}
