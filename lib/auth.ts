export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  plan?: string;
};

const TOKEN_KEY = "mydost_token";
const USER_KEY = "mydost_user";

export const getAuth = () => {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }
  const token = window.localStorage.getItem(TOKEN_KEY);
  const rawUser = window.localStorage.getItem(USER_KEY);
  const user = rawUser ? (JSON.parse(rawUser) as AuthUser) : null;
  return { token, user };
};

export const setAuth = (token: string, user: AuthUser) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuth = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
};
