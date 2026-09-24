import api from "../lib/axios";

export async function loginUser(username, password) {
  const { data } = await api.post("/auth/login", {
    username,
    password,
  });
  return data; // contains accessToken, user info, etc.
}