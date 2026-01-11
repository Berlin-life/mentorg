
export enum UserRole {
  MENTOR = 'instructor',
  MENTEE = 'student'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string; // Only for the simulated database
  role: UserRole;
  avatar: string;
  skills: string[];
  interests: string[];
  bio: string;
  availability: string[];
  matches: string[];
  isProfileComplete: boolean;
  experience?: string;
  goals?: string;
}

export interface MatchScore {
  mentorId: string;
  score: number;
  reason: string;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  topic: string;
  timestamp: string;
  likes: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

export interface Booking {
  id: string;
  mentorId: string;
  menteeId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
