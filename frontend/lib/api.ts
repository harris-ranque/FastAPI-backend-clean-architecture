const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface ListUsersResponse {
  users: Array<{
    id_: string;
    username: string;
    role: UserRole;
    is_active: boolean;
  }>;
  total: number;
}

async function apiRequest<T>(
  path: string,
  method: HttpMethod,
  body?: unknown,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`HTTP ${response.status}: ${message || response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function healthCheck() {
  return apiRequest<{ status: string }>("/health", "GET");
}

export async function signUp(input: {
  username: string;
  password: string;
  role: UserRole;
}) {
  return apiRequest<{ id: string }>("/account/singup", "POST", input);
}

export async function logIn(input: { username: string; password: string }) {
  return apiRequest<void>("/account/login", "POST", input);
}

export async function logOut() {
  return apiRequest<void>("/account/logout", "DELETE");
}

export async function changePassword(input: {
  current_password: string;
  new_password: string;
}) {
  return apiRequest<void>("/account/password", "PUT", input);
}

export async function listUsers(query: {
  limit: number;
  offset: number;
  sorting_field: string;
  sorting_order: "asc" | "desc";
}) {
  const params = new URLSearchParams({
    limit: String(query.limit),
    offset: String(query.offset),
    sorting_field: query.sorting_field,
    sorting_order: query.sorting_order,
  });

  // Backend path currently uses "/uesrs" in router.
  return apiRequest<ListUsersResponse>(`/uesrs/?${params.toString()}`, "GET");
}

export async function createUser(input: {
  username: string;
  password: string;
  role: UserRole;
}) {
  return apiRequest<{ id: string }>("/uesrs/", "POST", input);
}

export async function setUserPassword(userId: string, password: string) {
  return apiRequest<void>(`/uesrs/${userId}/password`, "PUT", password);
}

export async function grantAdmin(userId: string) {
  return apiRequest<void>(`/uesrs/${userId}/roles/admin`, "PUT");
}

export async function revokeAdmin(userId: string) {
  return apiRequest<void>(`/uesrs/${userId}/roles/admin`, "DELETE");
}

export async function activateUser(userId: string) {
  return apiRequest<void>(`/uesrs/${userId}/activation`, "PUT");
}

export async function deactivateUser(userId: string) {
  return apiRequest<void>(`/uesrs/${userId}/activation`, "POST");
}
