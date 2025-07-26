export const fetchWithNgrok = (url: string, options: RequestInit = {}) => {
  const headers = {
    ...(options.headers || {}),
    "ngrok-skip-browser-warning": "true",
  };

  return fetch(url, {
    ...options,
    headers,
  });
};
