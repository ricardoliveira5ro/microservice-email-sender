import axios, { AxiosResponse } from 'axios';
import { GenerateAPIKey, InvalidateAPIKey, Login, Recovery, Reset, Signup } from './interfaces';

export const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
	get: (url: string) => api.get(url).then(responseBody),
	post: (url: string, body: object) => api.post(url, body).then(responseBody),
	put: (url: string, body: object) => api.put(url, body).then(responseBody),
	delete: (url: string) => api.delete(url).then(responseBody),
};

export const UsersAPI = {
	signup: (formData: Signup) => requests.post('/users/signup', formData),
	login: (formData: Login) => requests.post('/users/login', formData),
	verifyToken: () => requests.get('/users/token'),
	recovery: (formData: Recovery) => requests.post('/users/recovery', formData),
	reset: (formData: Reset, user: string, resetToken: string) => requests.post(`/users/reset?user=${encodeURIComponent(user)}&resetToken=${encodeURIComponent(resetToken)}`, formData),
	verifyResetToken: (user: string, resetToken: string) => requests.get(`/users/reset-token?user=${encodeURIComponent(user)}&resetToken=${encodeURIComponent(resetToken)}`),
};

export const KeysAPI = {
	all: () => requests.get('/apiKeys/all'),
	generateAPIKey: (formData: GenerateAPIKey) => requests.post('/apiKeys/generateApiKey', formData),
	invalidateAPIKey: (formData: InvalidateAPIKey) => requests.post('/apiKeys/invalidateApiKey', formData),
	deleteAPIKey: (authId: string) => requests.delete(`/apiKeys/${encodeURIComponent(authId)}`),
};