package com.sportsync.entity;

/**
 * Enumeration representing user roles in the SportSync application.
 * Used for role-based access control and authorization.
 */
public enum Role {
    /**
     * Regular user role with standard permissions.
     * Can create events, join events, submit reviews, and manage their own profile.
     */
    USER,
    
    /**
     * Administrator role with elevated permissions.
     * Can perform all user actions plus system administration tasks,
     * delete any events, modify any user profiles, and access admin endpoints.
     */
    ADMIN
}