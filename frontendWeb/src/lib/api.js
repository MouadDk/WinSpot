export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');

export const apiUrl = (path) => {
  if (!API_BASE_URL) {
    throw new Error('VITE_BACKEND_URL is not configured');
  }

  return `${API_BASE_URL}${path}`;
};

export const authHeaders = (token, extraHeaders = {}) => {
  if (!token) {
    throw new Error('Authentication token is missing');
  }

  return {
    Authorization: `Bearer ${token}`,
    ...extraHeaders,
  };
};

export const parseApiResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  const rawBody = await response.text();

  let data = null;
  if (contentType.includes('application/json') && rawBody) {
    try {
      data = JSON.parse(rawBody);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const fallbackMessage = rawBody.startsWith('<!DOCTYPE')
      ? 'Backend returned HTML instead of JSON. Check backend URL and API routes.'
      : rawBody || `Request failed with status ${response.status}`;
    throw new Error(data?.message || fallbackMessage);
  }

  if (!data) {
    throw new Error('Backend response is not valid JSON');
  }

  return data;
};