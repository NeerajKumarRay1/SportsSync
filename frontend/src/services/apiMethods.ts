import api from './api';
import type {
  SportEvent,
  UserProfile,
  ScheduleEvent,
  CreateEventPayload,
} from '../types';

// ─── Events ───────────────────────────────────────────────────────────────────

export const eventsApi = {
  /**
   * GET /api/events?lat=&lng=&radius=&sport=
   * Returns nearby events for the Discovery map.
   */
  getNearby(params: {
    lat: number;
    lng: number;
    radius?: number;   // km, default 10
    sport?: string;
  }): Promise<SportEvent[]> {
    return api
      .get<SportEvent[]>('/api/events', { params })
      .then((r) => r.data);
  },

  /**
   * GET /api/events/:id
   */
  getById(eventId: string): Promise<SportEvent> {
    return api.get<SportEvent>(`/api/events/${eventId}`).then((r) => r.data);
  },

  /**
   * POST /api/events
   */
  create(payload: CreateEventPayload): Promise<SportEvent> {
    return api.post<SportEvent>('/api/events', payload).then((r) => r.data);
  },

  /**
   * POST /api/events/:id/join
   */
  join(eventId: string): Promise<void> {
    return api.post(`/api/events/${eventId}/join`).then(() => undefined);
  },

  /**
   * DELETE /api/events/:id/leave
   */
  leave(eventId: string): Promise<void> {
    return api.delete(`/api/events/${eventId}/leave`).then(() => undefined);
  },
};

// ─── User / Profile ───────────────────────────────────────────────────────────

export const userApi = {
  /**
   * GET /api/users/me/profile
   */
  getMyProfile(): Promise<UserProfile> {
    return api.get<UserProfile>('/api/users/me/profile').then((r) => r.data);
  },

  /**
   * PATCH /api/users/me/profile
   */
  updateProfile(updates: Partial<Pick<UserProfile, 'displayName' | 'bio' | 'primarySport'>>): Promise<UserProfile> {
    return api.patch<UserProfile>('/api/users/me/profile', updates).then((r) => r.data);
  },
};

// ─── Schedule ─────────────────────────────────────────────────────────────────

export const scheduleApi = {
  /**
   * GET /api/users/me/events
   * Returns events the current user is playing in or organizing.
   */
  getMyEvents(): Promise<ScheduleEvent[]> {
    return api.get<ScheduleEvent[]>('/api/users/me/events').then((r) => r.data);
  },
};
