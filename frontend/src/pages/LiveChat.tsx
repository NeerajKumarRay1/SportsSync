import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tokenStore } from '../services/api';

interface ChatMessage {
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export default function LiveChat() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const [messages, setMessages]   = useState<ChatMessage[]>([]);
  const [input, setInput]         = useState('');
  const [connected, setConnected] = useState(false);
  const clientRef  = useRef<Client | null>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If we only route to /chat but have no eventId, maybe default to some event or handle empty state.
    // For now, let it try connecting or stay empty if eventId is missing (or use a general chat).
    // The provided code assumes eventId exists.
    if (!eventId) return;

    const token = tokenStore.get();

    const client = new Client({
      webSocketFactory: () =>
        new SockJS('https://sportsync-backend-h7er.onrender.com/ws-sportsync'),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      onConnect: () => {
        setConnected(true);
        client.subscribe(`/topic/event/${eventId}`, (frame) => {
          const msg: ChatMessage = JSON.parse(frame.body);
          setMessages((prev) => [...prev, msg]);
        });
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => console.error('STOMP error:', frame),
    });

    client.activate();
    clientRef.current = client;

    return () => { client.deactivate(); };
  }, [eventId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !clientRef.current?.connected) return;
    clientRef.current.publish({
      destination: `/app/chat/${eventId}`,
      body: JSON.stringify({
        content:    input.trim(),
        senderId:   user?.userId,
        senderName: user?.displayName,
      }),
    });
    setInput('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#F0F0F5' }}>
      {/* Header */}
      <div style={{
        background: '#FFFFFF', padding: '16px 20px',
        borderBottom: '1px solid #F0F0F5',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: connected ? '#1DB954' : '#999',
        }} />
        <span style={{ fontWeight: 600, color: '#242428' }}>
          Event Chat {!connected && '(connecting...)'}
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>
        {messages.map((msg, i) => {
          const isMe = msg.senderId === user?.userId;
          return (
            <div key={i} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMe ? 'flex-end' : 'flex-start',
              marginBottom: 10,
            }}>
              {!isMe && (
                <span style={{ fontSize: 11, color: '#999', marginBottom: 3, marginLeft: 4 }}>
                  {msg.senderName}
                </span>
              )}
              <div style={{
                maxWidth: '72%',
                background: isMe ? '#FC4C02' : '#FFFFFF',
                color:      isMe ? '#FFFFFF' : '#242428',
                padding: '10px 14px',
                borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                fontSize: 14,
                lineHeight: 1.5,
              }}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        background: '#FFFFFF',
        padding: '12px 16px 28px',
        borderTop: '1px solid #F0F0F5',
        display: 'flex', gap: 10,
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Message..."
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: 24,
            border: '1px solid #E8E8EE',
            background: '#F0F0F5',
            fontSize: 14,
            color: '#242428',
            outline: 'none',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || !connected}
          style={{
            width: 44, height: 44,
            borderRadius: '50%',
            background: input.trim() && connected ? '#FC4C02' : '#E8E8EE',
            border: 'none',
            color: '#fff',
            fontSize: 18,
            cursor: input.trim() && connected ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s',
            flexShrink: 0,
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
