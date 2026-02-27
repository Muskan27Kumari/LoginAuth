import ls from "localstorage-slim";

let globalToken: string | null = null;

export const setGlobalToken = (token: string | null) => {
  globalToken = token;
};

export const getGlobalToken = (): string | null => {
  return globalToken;
};

export const getToken = (): string | null => {
  if (globalToken && globalToken.length > 0) {
    return globalToken;
  }

  const storeData = getStorage("[client-dashboard][0]") as { token?: string } | null;
  if (storeData?.token && typeof storeData.token === "string" && storeData.token.length > 0) {
    return storeData.token;
  }

  try {
    const allKeys = Object.keys(localStorage);
    const storeKeys = allKeys.filter((key) => key.includes("client-dashboard"));
    for (const key of storeKeys) {
      const data = getStorage(key) as { token?: string } | null;
      if (data?.token && typeof data.token === "string" && data.token.length > 0) {
        return data.token;
      }
    }
  } catch {
    // ignore
  }

  const directToken = ls.get("token", { decrypt: true });
  if (directToken && typeof directToken === "string" && directToken.length > 0) {
    return directToken;
  }

  return null;
};

export const getStorage = (key: string): unknown => {
  return ls.get(key, { decrypt: true });
};

export const removeStorage = (key: string) => {
  ls.remove(key);
};

export const setStorage = (key: string, value: unknown) => {
  ls.set(key, value);
};
