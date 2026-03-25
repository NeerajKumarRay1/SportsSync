// ─── User ─────────────────────────────────────────────────────────────────────
export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  primarySport?: string;
  skillLevel: number;        // 1–5
  reputationScore: number;   // 0–5 float
  gamesPlayed: number;
  gamesOrganized: number;
  reliabilityPct: number;    // 0–100
  verified: boolean;
}

// ─── Event ────────────────────────────────────────────────────────────────────
export type SportType =
  | 'Basketball' | 'Soccer' | 'Tennis'
  | 'Volleyball' | 'Golf' | 'Pickleball';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type EventStatus = 'OPEN' | 'FULL' | 'CANCELLED' | 'COMPLETED';

export interface SportEvent {
  eventId: string;
  title?: string;
  sport: SportType;
  status: EventStatus;
  eventDate: string;      // ISO-8601
  locationName: string;
  latitude: number;
  longitude: number;
  maxPlayers: number;
  currentPlayers: number;
  requiredSkill: SkillLevel;
  organizerId: string;
  organizerName: string;
}

// ─── Schedule ────────────────────────────────────────────────────────────────
export interface ScheduleEvent {
  eventId: string;
  sport: SportType;
  eventDate: string;
  locationName: string;
  role: 'PLAYING' | 'ORGANIZING';
}

// ─── Create event ─────────────────────────────────────────────────────────────
export interface CreateEventPayload {
  sport: SportType;
  eventDate: string;       // ISO-8601 datetime
  maxPlayers: number;
  requiredSkill: SkillLevel;
  latitude: number;
  longitude: number;
  locationName: string;
}
