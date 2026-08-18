const baseUrl = "/api";

export class ApiError extends Error {
  public readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T | undefined> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new ApiError(
      response.status,
      message || `API request failed: ${response.status}`,
    );
  }

  if (response.status === 204) {
    return undefined;
  }

  return response.json() as Promise<T>;
}

export default apiFetch;
