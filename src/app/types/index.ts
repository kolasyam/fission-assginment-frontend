export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
}
export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  currentAttendees: number;
  imageUrl: string;
  creator: User;
  attendees: User[];
  createdAt: string;
}
export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}
export interface EventsResponse {
  success: boolean;
  count: number;
  events: Event[];
}
export interface SingleEventResponse {
  success: boolean;
  event: Event;
}
export interface ApiError {
  success: false;
  message: string;
}