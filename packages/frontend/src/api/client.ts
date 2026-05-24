import type { FolderTreeNode, FolderChild, SearchResult } from "@windows-explorer/shared";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    throw new ApiError(
      (data as { error?: string })?.error || response.statusText,
      response.status,
      data
    );
  }

  return response.json() as Promise<T>;
}

export const api = {
  health: () => fetchJson<{ status: string; db: string; timestamp: string }>("/api/v1/health"),
  
  getTree: () => fetchJson<FolderTreeNode[]>("/api/v1/folders/tree"),
  
  getRoots: () => fetchJson<FolderChild[]>("/api/v1/folders/roots"),
  
  getChildren: (id: number) => fetchJson<FolderChild[]>(`/api/v1/folders/${id}/children`),
  
  search: (query: string, limit: number = 20) =>
    fetchJson<SearchResult[]>(`/api/v1/folders/search?q=${encodeURIComponent(query)}&limit=${limit}`),
};

export { ApiError };
