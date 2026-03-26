package com.sportsync;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.TimeZone; // The required import
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.sportsync.entity.User;
import com.sportsync.entity.SkillLevel;
import com.sportsync.entity.Role;
import com.sportsync.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SportSyncApplication {
    public static void main(String[] args) {
        // Force the modern timezone name before the database connects to fix the Asia/Calcutta bug
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata")); 
        
        SpringApplication.run(SportSyncApplication.class, args);
    }

    @Bean
    @org.springframework.context.annotation.Profile("!test")
    public CommandLineRunner loadData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                // Create regular user
                User user = new User();
                user.setName("Alex Developer");
                user.setEmail("alex@example.com");
                user.setPassword(passwordEncoder.encode("Password123!"));
                user.setSkillLevel(SkillLevel.INTERMEDIATE);
                user.setLatitude(37.7749);
                user.setLongitude(-122.4194);
                user.setReputationScore(4.8);
                user.setPreferredSports(java.util.List.of("BASKETBALL", "TENNIS"));
                user.setRole(Role.USER);
                userRepository.save(user);
                
                // Create admin user
                User admin = new User();
                admin.setName("Admin User");
                admin.setEmail("admin@sportsync.com");
                admin.setPassword(passwordEncoder.encode("AdminPass123!"));
                admin.setSkillLevel(SkillLevel.ADVANCED);
                admin.setLatitude(37.7749);
                admin.setLongitude(-122.4194);
                admin.setReputationScore(5.0);
                admin.setPreferredSports(java.util.List.of("BASKETBALL", "TENNIS", "SOCCER"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                
                System.out.println("Mock users seeded: regular user and admin user.");
            }
        };
    }
}