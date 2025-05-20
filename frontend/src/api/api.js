import { ApiError } from "../utils/ApiError";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

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
  post: (path, body, options) => request(path, { method: "POST", body: JSON.stringify(body), ...options }),
  delete: (path, body, options) => request(path, { method: "DELETE", body: JSON.stringify(body), ...options }),
};

export const healthCheck = async () => {
  return await api.get("/health", {});
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
  return await api.post("/upload-image", payload);
}

export const getImages = async () => {
  return await api.get("/pictures", {});
}

export const deleteImage = async id => {
  return await api.delete(`/picture/${id}`, {});
}