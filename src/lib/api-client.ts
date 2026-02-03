import { API_BASE_URL } from '@/config/api';

/**
 * API Client utility for fetching from Laravel backend with authentication
 */

export async function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');

    // Normalize URL: if it doesn't start with http, prepend API_BASE_URL
    const finalUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;

    const headers = new Headers(options.headers || {});
    headers.set('Accept', 'application/json');

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // Default Content-Type to application/json if sending a body
    if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(finalUrl, {
        ...options,
        headers
    });

    if (response.status === 401) {
        // Handle unauthorized - maybe redirect to login or clear token
        console.warn('Unauthorized request detected. Clearing local session.');
    }

    return response;
}
