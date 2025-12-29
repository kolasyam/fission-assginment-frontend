import axios from 'axios';
import type { AuthResponse, EventsResponse, SingleEventResponse } from '../types';
const API_URL = "https://fission-assginment-backend-eg9n.onrender.com";
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Auth APIs
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/register', { name, email, password }),
  
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/api/auth/login', { email, password }),
  
  getCurrentUser: () =>
    api.get<AuthResponse>('/api/auth/me'),
};
// Event APIs
export const eventAPI = {
  getEvents: (search?: string, date?: string) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (date) params.append('date', date);
    return api.get<EventsResponse>(`/api/events?${params.toString()}`);
  },
  getEvent: (id: string) =>
    api.get<SingleEventResponse>(`/api/events/${id}`),
  createEvent: (formData: FormData) =>
    api.post<SingleEventResponse>('/api/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateEvent: (id: string, formData: FormData) =>
    api.put<SingleEventResponse>(`/api/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteEvent: (id: string) =>
    api.delete(`/api/events/${id}`),
  getMyEvents: () =>
    api.get<EventsResponse>('/api/events/user/my-events'),
  getAttendingEvents: () =>
    api.get<EventsResponse>('/api/events/user/attending'),
};
// RSVP APIs
export const rsvpAPI = {
  rsvpToEvent: (eventId: string) =>
    api.post<SingleEventResponse>(`/api/rsvp/${eventId}`),
  cancelRsvp: (eventId: string) =>
    api.delete<SingleEventResponse>(`/api/rsvp/${eventId}`),
};

export default api;