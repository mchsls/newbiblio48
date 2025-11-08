// API configuration
const API_BASE = window.location.origin + '/api';
const TOKEN_KEY = 'biblio_token';
const USER_KEY = 'biblio_user';

// API service
class BiblioAPI {
    constructor() {
        this.token = localStorage.getItem(TOKEN_KEY);
        this.user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.detail || 'Ошибка сервера');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth methods
    async login(username, password) {
        const data = await this.request('/auth/login/', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });

        this.token = data.access;
        this.user = data.user;

        localStorage.setItem(TOKEN_KEY, data.access);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        return data;
    }

    async register(userData) {
        const data = await this.request('/auth/register/', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        this.token = data.access;
        this.user = data.user;

        localStorage.setItem(TOKEN_KEY, data.access);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        return data;
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

    // Book methods
    async getBooks(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return await this.request(`/books/?${queryString}`);
    }

    async getBook(id) {
        return await this.request(`/books/${id}/`);
    }

    async reserveBook(bookId) {
        return await this.request(`/books/${bookId}/reserve/`, {
            method: 'POST',
        });
    }

    async getMyReservations() {
        return await this.request('/books/my-reservations/');
    }

    async cancelReservation(reservationId) {
        return await this.request(`/books/cancel-reservation/${reservationId}/`, {
            method: 'POST',
        });
    }

    // Event methods
    async getEvents() {
        return await this.request('/events/');
    }

    async registerForEvent(eventId) {
        return await this.request(`/events/${eventId}/register/`, {
            method: 'POST',
        });
    }

    // News methods
    async getNews() {
        return await this.request('/news/');
    }

    // User methods
    async getProfile() {
        return await this.request('/auth/profile/');
    }

    async updateProfile(profileData) {
        return await this.request('/auth/profile/', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    isAuthenticated() {
        return !!this.token;
    }

    isAdmin() {
        return this.user && this.user.user_type === 'admin';
    }

    getUser() {
        return this.user;
    }
}

// Create global API instance
window.biblioAPI = new BiblioAPI();