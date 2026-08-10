const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4100";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data && data.error ? data.error : `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export function register({ email, password, displayName }) {
  return request("/api/auth/register", {
    method: "POST",
    body: { email, password, displayName },
  });
}

export function login({ email, password }) {
  return request("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function listResources({ tag, submittedBy } = {}) {
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);
  if (submittedBy) params.set("submittedBy", submittedBy);
  const query = params.toString() ? `?${params.toString()}` : "";
  return request(`/api/resources${query}`);
}

export function createResource({ title, url, description, tags }, token) {
  return request("/api/resources", {
    method: "POST",
    body: { title, url, description, tags },
    token,
  });
}

export function addReaction({ resourceId, emoji }, token) {
  return request(`/api/resources/${resourceId}/reactions`, {
    method: "POST",
    body: { emoji },
    token,
  });
}

export function removeReaction({ resourceId, reactionId }, token) {
  return request(`/api/resources/${resourceId}/reactions/${reactionId}`, {
    method: "DELETE",
    token,
  });
}
