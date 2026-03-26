import { Home, Calendar, MessageCircle, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { icon: Home,          label: 'Home',     path: '/' },
  { icon: Calendar,      label: 'Schedule', path: '/schedule' },
  { icon: MessageCircle, label: 'Chat',     path: '/chat' },
  { icon: User,          label: 'Profile',  path: '/profile' },
];

export default function BottomNav() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#FFFFFF',
      borderTop: '1px solid #F0F0F5',
      display: 'flex',
      zIndex: 50,
    }}>
      {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
        const active = pathname === path || (path !== '/' && pathname.startsWith(path));
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '10px 0 14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: active ? '#FC5200' : '#999999',
              transition: 'color 0.15s',
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
            <span style={{ fontSize: 10, fontWeight: active ? 600 : 400 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

