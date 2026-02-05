/**
 * API Utility (Axios)
 *
 * Helper functions untuk fetch data dari backend API
 */

import axios, { AxiosRequestConfig, AxiosError } from 'axios';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  // Supaya kelihatan kalau env belum di-set

  console.warn('NEXT_PUBLIC_API_URL is not defined');
}

/**
 * Axios instance utama
 */
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generic fetch function dengan error handling
 * Bisa dipakai untuk GET/POST/PUT/DELETE, dll.
 *
 * Contoh:
 *  fetchAPI<BlogPost[]>('/posts'); // GET
 *  fetchAPI('/auth/register', { method: 'POST', data: payload });
 */
export async function fetchAPI<T>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await api.request<T>({
      url: endpoint,
      method: config?.method ?? 'GET',
      ...config,
    });

    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    console.error('API Fetch Error:', message);
    throw new Error(message);
  }
}

/**
 * Helper untuk mengambil pesan error yang lebih rapi
 */
function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    const data = axiosError.response?.data;

    if (data?.message) return data.message;
    if (data?.error) return data.error;

    if (axiosError.response) {
      return `Request failed with status ${axiosError.response.status}`;
    }
    if (axiosError.request) {
      return 'No response from server';
    }
    return axiosError.message;
  }

  if (error instanceof Error) return error.message;
  return 'Unknown error';
}
