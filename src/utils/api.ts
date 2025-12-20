/**
 * API Client for User Web Client
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface RequestOptions {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    token?: string;
}

class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, token } = options;

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new ApiError(response.status, errorData.message || errorData.detail || 'Request failed');
    }

    return response.json();
}

// Job types
export interface Job {
    id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    progress: number;
    page_count: number | null;
    pages_processed: number;
    original_filename: string | null;
    error_message: string | null;
    created_at: string;
    completed_at: string | null;
    has_result?: boolean;
}

export interface JobsResponse {
    jobs: Job[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface UploadResponse {
    job_id: string;
    status: string;
    message: string;
}

// Jobs API
export const jobsApi = {
    getMyJobs: (token: string, status?: string, page = 1, pageSize = 20) => {
        const params = new URLSearchParams();
        params.set('page', page.toString());
        params.set('page_size', pageSize.toString());
        if (status && status !== 'all') {
            params.set('status', status);
        }
        return request<JobsResponse>(`/api/user/jobs?${params.toString()}`, { token });
    },

    getJob: (token: string, jobId: string) =>
        request<Job>(`/api/user/jobs/${jobId}`, { token }),

    cancelJob: (token: string, jobId: string) =>
        request<{ success: boolean; message: string }>(`/api/user/jobs/${jobId}/cancel`, {
            method: 'POST',
            token,
        }),

    downloadJobResult: async (token: string, jobId: string, filename: string) => {
        const response = await fetch(`${API_BASE_URL}/api/user/jobs/${jobId}/download`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new ApiError(response.status, 'Failed to download result');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    },
};

// Upload API - uses FormData, different from JSON requests
export async function uploadFile(token: string, file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/user/upload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new ApiError(response.status, errorData.message || errorData.detail || 'Upload failed');
    }

    return response.json();
}

// User API
export interface UserProfile {
    id: string;
    email: string;
    display_name: string | null;
    credit_balance: number;
}

export const userApi = {
    getProfile: (token: string) => request<UserProfile>('/api/user/profile', { token }),
};
