const DEFAULT_API_BASE_URL = "/job-app";
const API_BASE_URL = (
  import.meta.env.VITE_API_URL?.trim() || DEFAULT_API_BASE_URL
).replace(/\/$/, "");

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
  } catch {
    throw new Error(
      "Cannot connect to the backend. Make sure the backend server is running."
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(data?.message || data || "Something went wrong");
  }

  return data;
}

export const apiGet = (path) => request(path);

export const apiPost = (path, body) =>
  request(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });

export const getErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again."
) => {
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
