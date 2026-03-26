# SportSync - Project Progress Report

Last updated: March 26, 2026

## 1. Current Deployment Status

### Production topology
- Backend is deployed on Render.
- Frontend is deployed on Vercel.
- Frontend API client is configured to use environment variable VITE_API_BASE_URL when provided.
- Fallback API behavior currently supports local dev and hosted backend:
  - DEV fallback: http://localhost:8080
  - Non-DEV fallback: https://sportsync-backend-h7er.onrender.com

### Runtime and stack
- Frontend: React + TypeScript + Vite + Tailwind CSS.
- Backend: Spring Boot 3.x + Spring Security + JWT + Flyway.
- Database: PostgreSQL-oriented schema and config, with migration history managed by Flyway.

## 2. Features Executed (Implemented in Code)

## 2.1 Authentication and Session Security
- User registration endpoint implemented: POST /api/auth/register.
- User login endpoint implemented: POST /api/auth/login.
- Stateless logout endpoint implemented: POST /api/auth/logout.
- Password hashing via BCrypt in backend service layer.
- JWT generation and validation implemented with expiration handling.
- JWT request filter integrated into Spring Security filter chain.
- Public route rules configured for auth endpoints and health endpoint.
- Protected route behavior implemented on frontend with auth context + route guard.
- Frontend stores JWT in memory (not localStorage) and injects Bearer token via Axios interceptor.
- Global 401 interceptor clears token and triggers auth-expired flow.

## 2.2 Event Discovery and Event Lifecycle

### Discovery
- Nearby event discovery endpoint implemented: GET /api/events with lat/lng/radius/sport.
- Backend supports optional sport filtering.
- Frontend Discovery page fetches live data via eventsApi.getNearby.
- Leaflet map rendering implemented with marker plotting for each event.
- Geolocation hook implemented and used to center/fly map to user location.

### Event details and creation
- Event detail endpoint implemented: GET /api/events/{id}.
- Event creation endpoint implemented: POST /api/events.
- Backend create flow maps request payload to Event entity and returns EventResponse.
- Frontend Create Event page includes map-based location picker and reverse geocoding.

### Join and leave
- Join endpoint implemented: POST /api/events/{id}/join.
- Leave endpoint implemented: DELETE /api/events/{id}/leave.
- Backend enforces status/capacity checks and updates OPEN/FULL state accordingly.

## 2.3 User Profile and Schedule
- Current user profile fetch endpoint implemented: GET /api/users/me/profile.
- Profile update endpoint implemented: PATCH /api/users/me/profile.
- Current user schedule endpoint implemented: GET /api/users/me/events.
- Backend schedule aggregates both participant and organizer roles and sorts by date.
- Frontend My Schedule page implemented with PLAYING/ORGANIZING tabs and live API integration.
- Frontend Player Dashboard page implemented with profile rendering, loading/error states, and retry.

## 2.4 Reviews, Rosters, and Reputation
- Roster join endpoint implemented: POST /api/rosters/join.
- Review submission endpoint implemented: POST /api/reviews/.
- Review service persists review records and recalculates target user reputation score.
- Roster service enforces duplicate-join prevention and event capacity constraints.

## 2.5 Realtime Chat Infrastructure
- STOMP WebSocket broker configured in backend.
- SockJS endpoint exposed: /ws-sportsync.
- Chat message mapping implemented at /app/chat/{eventId} and broadcast to /topic/event/{eventId}.

Note:
- Frontend has LiveChat and PostGameRating components present.
- These components currently use mock/local state and are not wired to a production chat route in the main router yet.

## 2.6 Input Validation, Sanitization, and Error Handling
- Global exception handling implemented for validation, auth, JWT, access, and generic failures.
- Structured validation error responses include fieldErrors map.
- OWASP HTML Sanitizer utility implemented for XSS mitigation.
- Dedicated sanitization service exists for multiple DTO types.
- Security-related tests exist for sanitizer and validation behaviors.

## 2.7 Database Schema and Migrations
- Flyway migrations implemented and versioned:
  - V1 initial schema (users, user_preferred_sports, events, rosters, reviews, indexes).
  - V2 password column update for BCrypt hash length.
  - V3 user profile extensions and event_participants join table; location_name on events.
- Health endpoint is operational and reports database status.

## 3. Frontend Product Surface (What Users Can Do Today)
- Access auth screen and register/login.
- Access protected routes after authentication.
- Browse nearby events on map/list style discovery page.
- Create a new event with date/skill/location inputs.
- View personal schedule grouped by playing vs organizing role.
- View profile dashboard data from backend.
- Navigate via bottom navigation (Home, Schedule, Chat, Profile).

## 4. Quality and Verification Snapshot

### Backend test artifacts detected in surefire reports
- com.sportsync.migration.FlywayMigrationTest: 1 test, 0 failures.
- com.sportsync.controller.EventControllerTest: 1 test, 0 failures.
- com.sportsync.service.UserServiceTest: 1 test, 0 failures.
- com.sportsync.service.SanitizationServiceTest: 7 tests, 0 failures.
- com.sportsync.security.JwtIntegrationTest: 3 tests, 0 failures.
- com.sportsync.util.InputSanitizerTest: 15 tests, 0 failures.
- com.sportsync.util.PasswordValidatorTest: 8 tests, 0 failures.
- com.sportsync.validation.SanitizedValidatorTest: 7 tests, 0 failures.

Observed total in reported artifacts: 43 backend tests, 0 failures, 0 errors.

## 5. Recent Completed Fixes
- Auth failure UX improved to show context-aware login/register/network messages.
- Frontend API default base URL behavior updated to favor localhost in DEV and hosted backend outside DEV.
- CORS security configuration includes local frontend origins and supports configured production origins.

## 6. Known Gaps and Unimplemented/Dummy Features
- **Realtime Chat Routing:** The frontend `LiveChat` component uses dummy mock messages and is not wired to a production route or connected to the backend STOMP WebSocket endpoint.
- **Post-Game Ratings:** The `PostGameRating` component uses mock player data and isn't triggered automatically by backend game-completion events; it relies on a dummy trigger button.
- **Profile Updates:** The `ProfileSettings` screen currently uses local React state (variables like `isEditing`) and dummy mock user/settings data; it drops changes on reload and isn't integrated with the `PATCH /api/users/me/profile` backend endpoint.
- **Matchmaking Service Execution:** Backend implements `MatchmakingService.java` to find player matches by radius and skill level, but this isn't integrated or invocable from the frontend UI.
- **Password Updates:** The "Update Password" button on the profile settings page is a static UI placeholder without an associated backend action or flow.
- **Admin Panel Tools:** Database schema supports an `ADMIN` role, but no admin-exclusive frontend views or tools have been established.
- **Advanced Match Form validations:** Some complex rules (preventing overlaps natively in UI calendar, complex dynamic validations) exist only as basic DB constraints instead of fully parity frontend restrictions.
- **Push Alerts / Notifications:** Notification slider components in the profile page do nothing, and the backend has no notification push delivery service setup (FCM/APNS).
- **Testing Coverage Automation:** End-to-end (E2E) browser simulation paths (Cypress/Playwright) aren't built; automated tests are currently constrained to the backend unit-test and integration levels.

## 7. Next Execution Targets
- Wire chat tab route to LiveChat page and integrate with backend STOMP endpoint instead of mock messages.
- Replace placeholder profile/settings flow with backend-backed update and persistence in ProfileSettings.
- Add frontend integration for roster join/review submission flows where not yet exposed in routed pages.
- Expand automated tests for end-to-end frontend/backend auth, event creation, and schedule flows.
- Add deployment runbook section with exact Render and Vercel environment variable matrix.

## 8. Overall Status
- Core platform functions are implemented and deployed: auth, discovery, event lifecycle, profile, schedule, migration-backed persistence, and secured API boundaries.
- Realtime and engagement enhancements exist in codebase and backend infrastructure, with remaining work primarily around full frontend wiring and production hardening.
