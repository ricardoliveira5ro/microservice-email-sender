import axios, { AxiosResponse } from 'axios';
import { Login, Signup } from './interfaces';

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
};