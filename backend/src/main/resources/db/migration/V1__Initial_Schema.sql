-- Initial Schema Migration for SportSync Application
-- Creates all tables based on existing JPA entities with proper constraints and indexes

-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    skill_level VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    reputation_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_users_skill_level CHECK (skill_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    CONSTRAINT chk_users_role CHECK (role IN ('USER', 'ADMIN'))
);

-- Create user_preferred_sports table (for @ElementCollection)
CREATE TABLE user_preferred_sports (
    user_id BIGINT NOT NULL,
    sport VARCHAR(255) NOT NULL,
    CONSTRAINT fk_user_preferred_sports_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create events table
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    organizer_id BIGINT NOT NULL,
    sport_type VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    date_time TIMESTAMP NOT NULL,
    max_player_count INTEGER NOT NULL,
    required_skill_level VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_organizer FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_events_skill_level CHECK (required_skill_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    CONSTRAINT chk_events_status CHECK (status IN ('OPEN', 'FULL', 'COMPLETED'))
);

-- Create rosters table
CREATE TABLE rosters (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_rosters_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_rosters_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uk_rosters_event_user UNIQUE (event_id, user_id)
);

-- Create reviews table
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    reviewer_id BIGINT NOT NULL,
    reviewee_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    rating INTEGER NOT NULL,
    comment VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_reviewee FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT uk_reviews_reviewer_reviewee_event UNIQUE (reviewer_id, reviewee_id, event_id),
    CONSTRAINT chk_reviews_rating CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT chk_reviews_different_users CHECK (reviewer_id != reviewee_id)
);

-- Create indexes for performance optimization

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_location ON users(latitude, longitude);
CREATE INDEX idx_users_skill_level ON users(skill_level);
CREATE INDEX idx_users_reputation_score ON users(reputation_score DESC);

-- User preferred sports indexes
CREATE INDEX idx_user_preferred_sports_user_id ON user_preferred_sports(user_id);
CREATE INDEX idx_user_preferred_sports_sport ON user_preferred_sports(sport);

-- Events table indexes
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_sport_type ON events(sport_type);
CREATE INDEX idx_events_location ON events(latitude, longitude);
CREATE INDEX idx_events_date_time ON events(date_time);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_skill_level ON events(required_skill_level);
CREATE INDEX idx_events_date_status ON events(date_time, status);
CREATE INDEX idx_events_sport_location ON events(sport_type, latitude, longitude);

-- Rosters table indexes
CREATE INDEX idx_rosters_event_id ON rosters(event_id);
CREATE INDEX idx_rosters_user_id ON rosters(user_id);
CREATE INDEX idx_rosters_joined_at ON rosters(joined_at);

-- Reviews table indexes
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_event_id ON reviews(event_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);

-- Add comments for documentation
COMMENT ON TABLE users IS 'Stores user account information and preferences';
COMMENT ON TABLE user_preferred_sports IS 'Stores user preferred sports as a collection';
COMMENT ON TABLE events IS 'Stores sports events created by users';
COMMENT ON TABLE rosters IS 'Stores event participation records';
COMMENT ON TABLE reviews IS 'Stores post-event user reviews and ratings';

COMMENT ON COLUMN users.reputation_score IS 'User reputation based on reviews received';
COMMENT ON COLUMN events.max_player_count IS 'Maximum number of players allowed in the event';
COMMENT ON COLUMN reviews.rating IS 'Rating from 1 to 5 stars';
COMMENT ON COLUMN reviews.comment IS 'Optional review comment, max 500 characters';