export const getUrlParam = (key) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      return url.searchParams.get(key);
    }
    return null;
  };