import Cookies from "js-cookie";

// Custom storage object for cookies
export const cookieStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = Cookies.get(name);
      return value || null;
    } catch (error) {
      console.warn(`Error reading cookie ${name}:`, error);
      return null;
    }
  },
  setItem: (name: string, value: string, options = {}): void => {
    try {
      Cookies.set(name, value, {
        ...options,
        expires: 30,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
        path: "/", // Ensure cookie is available everywhere
      });
    } catch (error) {
      console.error(`Error setting cookie ${name}:`, error);
    }
  },
  removeItem: (name: string): void => {
    Cookies.remove(name, { path: "/" }); // Ensure cookie is removed from all paths
  },
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    return tokenData.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
