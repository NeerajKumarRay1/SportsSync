package com.sportsync.controller;

import com.sportsync.dto.ChatMessageDTO;
import jakarta.validation.Valid;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class ChatController {

    @MessageMapping("/chat/{eventId}")
    @SendTo("/topic/event/{eventId}")
    public ChatMessageDTO sendMessage(
            @DestinationVariable Long eventId, 
            @Valid @Payload ChatMessageDTO chatMessage) {
        
        // Ensure timestamp is set right before broadcasting to subscribers
        LocalDateTime timestamp = chatMessage.timestamp() != null ? chatMessage.timestamp() : LocalDateTime.now();
        
        return new ChatMessageDTO(
                chatMessage.senderId(),
                chatMessage.senderName(),
                chatMessage.content(),
                timestamp
        );
    }
}
