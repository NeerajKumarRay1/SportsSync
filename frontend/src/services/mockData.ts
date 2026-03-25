// Mock implementation
export interface User {
  id: string;
  name: string;
  reputationScore: number;
  avatar: string;
}

export interface Game {
  id: string;
  sport: string;
  time: string;
  location: [number, number];
  locationName: string;
  maxPlayers: number;
  currentPlayers: number;
  requiredSkill: string;
  distance: string;
  organizer: User;
}

export const mockUser: User = {
  id: 'u1',
  name: 'Alex D.',
  reputationScore: 4.8,
  avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
};

export const mockGames: Game[] = [
  {
    id: 'g1',
    sport: 'Basketball',
    time: 'Today, 6:00 PM',
    location: [-122.4194, 37.7749], // San Francisco
    locationName: 'Dolores Park Courts',
    maxPlayers: 10,
    currentPlayers: 7,
    requiredSkill: 'Intermediate',
    distance: '1.2 miles away',
    organizer: {
      id: 'o1',
      name: 'Sarah M.',
      reputationScore: 4.9,
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
    }
  },
  {
    id: 'g2',
    sport: 'Soccer',
    time: 'Tomorrow, 5:30 PM',
    location: [-122.4084, 37.7839],
    locationName: 'Yerba Buena Turf',
    maxPlayers: 14,
    currentPlayers: 12,
    requiredSkill: 'Advanced',
    distance: '0.8 miles away',
    organizer: mockUser
  }
];
