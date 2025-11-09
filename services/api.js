import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode as btoa } from 'base-64';

const BASE_URL = 'https://motovision-api-8077.azurewebsites.net/api';

export const AUTH_TOKEN_KEY = '@auth_token';
export const AUTH_EMAIL_KEY = '@auth_email';

export async function setAuthCredentials({ email, password }) {
  if (!email || !password) {
    throw new Error('Credenciais inválidas para autenticação.');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const token = btoa(`${normalizedEmail}:${password}`);

  await AsyncStorage.multiSet([
    [AUTH_EMAIL_KEY, normalizedEmail],
    [AUTH_TOKEN_KEY, token],
  ]);

  return token;
}

export async function clearAuthCredentials() {
  await AsyncStorage.multiRemove([AUTH_EMAIL_KEY, AUTH_TOKEN_KEY]);
}

async function getAuthToken() {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) {
    const error = new Error('Nenhum token de autenticação encontrado.');
    error.code = 'AUTH_TOKEN_MISSING';
    throw error;
  }
  return token;
}

async function buildHeaders(extraHeaders = {}) {
  const token = await getAuthToken();
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Basic ${token}`,
    ...extraHeaders,
  };
}

async function handleResponse(response) {
  const raw = await response.text();
  let parsed = null;

  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      parsed = raw;
    }
  }

  if (!response.ok) {
    const error = new Error(
      parsed?.message || parsed?.error || 'Erro ao comunicar com o servidor.'
    );
    error.status = response.status;
    error.body = parsed;
    throw error;
  }

  return parsed;
}

async function request(path, options = {}) {
  const headers = await buildHeaders(options.headers);

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (networkError) {
    const error = new Error('Falha de rede ao acessar a API.');
    error.code = 'NETWORK_ERROR';
    error.cause = networkError;
    throw error;
  }

  return handleResponse(response);
}

export const MotoApi = {
  list: () => request('/motos/todos'),
  getById: (id) => request(`/motos/id/${id}`),
  create: (payload) =>
    request('/motos', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateById: (id, payload) =>
    request(`/motos/id/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteById: (id) =>
    request(`/motos/id/${id}`, {
      method: 'DELETE',
    }),
  filter: (params = {}) => {
    const searchParams = new URLSearchParams(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
    );
    const query = searchParams.toString();
    const suffix = query ? `?${query}` : '';
    return request(`/motos/filtro${suffix}`);
  },
};

export const PatioApi = {
  list: () => request('/patios'),
  create: (payload) =>
    request('/patios', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (id, payload) =>
    request(`/patios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  remove: (id) =>
    request(`/patios/${id}`, {
      method: 'DELETE',
    }),
};


