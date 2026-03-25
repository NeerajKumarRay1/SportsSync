package com.sportsync.service;

import com.sportsync.entity.User;
import com.sportsync.repository.ReviewRepository;
import com.sportsync.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void updateReputationScore_ShouldUpdateAndSaveUser() {
        Long userId = 1L;
        User mockUser = new User();
        mockUser.setId(userId);
        mockUser.setReputationScore(0.0);

        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
        when(reviewRepository.calculateAverageReputationScore(userId)).thenReturn(4.5);

        userService.updateReputationScore(userId);

        assertEquals(4.5, mockUser.getReputationScore());
        verify(userRepository).save(mockUser);
    }
}
