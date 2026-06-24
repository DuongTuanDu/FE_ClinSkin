const stripApiPath = (url) =>
  url.replace(/\/api\/v\d+\/?$/, "").replace(/\/$/, "");

export const getSocketServerUrl = () => {
  const apiUrl =
    import.meta.env.VITE_APP_SOCKET_URL ||
    import.meta.env.VITE_APP_API_BASE_URL ||
    import.meta.env.VITE_APP_API_URL ||
    import.meta.env.VITE_APP_API_URl ||
    "http://localhost:9999";

  if (apiUrl.includes("/api/")) {
    return stripApiPath(apiUrl);
  }

  return apiUrl.replace(/\/$/, "");
};
