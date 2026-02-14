const API_URL = '/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const api = {
    login: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw await res.json();
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    },

    signup: async (userData) => {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!res.ok) throw await res.json();
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },


    getRequests: async () => {
        const res = await fetch(`${API_URL}/requests`, {
            headers: getHeaders(),
        });
        if (!res.ok) throw await res.json();
        return res.json();
    },

    createRequest: async (requestData) => {
        const res = await fetch(`${API_URL}/requests`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(requestData),
        });
        if (!res.ok) throw await res.json();
        return res.json();
    },

    updateRequestStatus: async (id, status) => {
        const res = await fetch(`${API_URL}/requests/${id}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ status }),
        });
        if (!res.ok) throw await res.json();
        return res.json();
    },

    ignoreRequest: async (id) => {
        const res = await fetch(`${API_URL}/requests/${id}/ignore`, {
            method: 'PUT',
            headers: getHeaders(),
        });
        if (!res.ok) throw await res.json();
        return res.json();
    },


    getProfile: async () => {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: getHeaders(),
        });
        if (!res.ok) throw await res.json();
        return res.json();
    },

    updateProfile: async (profileData) => {
        const isFormData = profileData instanceof FormData;
        const headers = getHeaders();
        if (isFormData) {
            delete headers['Content-Type']; // Let browser set Content-Type for FormData
        }

        const res = await fetch(`${API_URL}/users/profile`, {
            method: 'PUT',
            headers: headers,
            body: isFormData ? profileData : JSON.stringify(profileData),
        });
        if (!res.ok) throw await res.json();
        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data)); // Update local user data
        return data;
    },
};
