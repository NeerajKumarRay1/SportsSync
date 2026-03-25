package com.sportsync.security;

import com.sportsync.dto.LoginRequest;
import com.sportsync.dto.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class JwtIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    private RegisterRequest validUser;
    private LoginRequest loginRequest;
    
    private String uniqueEmail;

    @BeforeEach
    void setUp() {
        uniqueEmail = "jwt.test." + UUID.randomUUID().toString() + "@example.com";
        
        validUser = new RegisterRequest();
        validUser.setDisplayName("JWT Test User");
        validUser.setEmail(uniqueEmail);
        validUser.setPassword("SecurePass123!");

        loginRequest = new LoginRequest();
        loginRequest.setEmail(uniqueEmail);
        loginRequest.setPassword("SecurePass123!");
    }

    @Test
    @DisplayName("Should generate JWT token with enhanced security on successful login")
    void shouldGenerateSecureJwtTokenOnLogin() {
        ResponseEntity<Map> registerResponse = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/auth/register",
            validUser,
            Map.class
        );
        assertEquals(HttpStatus.CREATED, registerResponse.getStatusCode());

        ResponseEntity<Map> loginResponse = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/auth/login",
            loginRequest,
            Map.class
        );

        assertEquals(HttpStatus.OK, loginResponse.getStatusCode());
        assertNotNull(loginResponse.getBody());
        assertTrue(loginResponse.getBody().containsKey("token"));

        String token = (String) loginResponse.getBody().get("token");
        assertNotNull(token);
        assertFalse(token.isEmpty());

        long dotCount = token.chars().filter(ch -> ch == '.').count();
        assertEquals(2, dotCount, "JWT token should have exactly 2 dots");      
    }

    @Test
    @DisplayName("Should return proper error for invalid credentials")
    void shouldReturnErrorForInvalidCredentials() {
        ResponseEntity<Map> registerResponse = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/auth/register",
            validUser,
            Map.class
        );
        assertEquals(HttpStatus.CREATED, registerResponse.getStatusCode());     

        LoginRequest wrongPassword = new LoginRequest();
        wrongPassword.setEmail(uniqueEmail);
        wrongPassword.setPassword("WrongPassword123!");

        ResponseEntity<Map> loginResponse = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/auth/login",
            wrongPassword,
            Map.class
        );

        assertEquals(HttpStatus.UNAUTHORIZED, loginResponse.getStatusCode());
    }

    @Test
    @DisplayName("Should handle registration with weak password")
    void shouldHandleWeakPassword() {
        RegisterRequest weakPasswordUser = new RegisterRequest();
        weakPasswordUser.setDisplayName("Weak Password User");
        weakPasswordUser.setEmail("weak" + UUID.randomUUID().toString() + "@example.com");
        weakPasswordUser.setPassword("weak");

        ResponseEntity<Map> response = restTemplate.postForEntity(
            "http://localhost:" + port + "/api/auth/register",
            weakPasswordUser,
            Map.class
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
    }
}
