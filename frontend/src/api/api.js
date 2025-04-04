import { ApiError } from "../utils/ApiError";

const BASE_URL = import.meta.env.VITE_AUTH_URL;

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  const isJSON = res.headers.get("content-type")?.includes("application/json");
  const data = isJSON ? await res.json() : null;

  if (!res.ok) throw ApiError.fromResponse(res, data);
  return data;
};

export const api = {
  get: (path, options) => request(path, { method: "GET", ...options }),
  post: (path, body, options) =>
    request(path, { method: "POST", body: JSON.stringify(body), ...options }),
};

export const login = async (email, password) => {
  return await api.post("/login", { email, password });
}

export const forceChangePassword = async (session, username, newPassword) => {
  return await api.post("/respond-to-challenge", { session, username, newPassword });
}

export const refreshToken = async (refreshToken) => {
  return await api.post("/refresh-token", { refreshToken });
}

export const uploadImage = async (payload) => {
  return await api.post("/upload-image", { payload });
}
