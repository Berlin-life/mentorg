
import { UserRole, UserProfile } from './types';

export const MOCK_MENTORS: UserProfile[] = [
  {
    id: 'm1',
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    role: UserRole.MENTOR,
    avatar: 'https://picsum.photos/seed/sarah/200',
    skills: ['React', 'TypeScript', 'System Design', 'UI/UX'],
    interests: ['Mentoring', 'Open Source'],
    bio: 'Senior Software Engineer at a Big Tech company. Loves teaching React and building scalable architectures.',
    experience: '8 years in Web Development',
    availability: ['2024-05-20T10:00:00Z', '2024-05-21T14:00:00Z'],
    // Added missing properties to satisfy UserProfile interface
    matches: [],
    isProfileComplete: true
  },
  {
    id: 'm2',
    name: 'James Wilson',
    email: 'james@example.com',
    role: UserRole.MENTOR,
    avatar: 'https://picsum.photos/seed/james/200',
    skills: ['Node.js', 'Python', 'Machine Learning', 'AWS'],
    interests: ['AI', 'Data Engineering'],
    bio: 'Backend specialist with a passion for high-performance systems and AI research.',
    experience: '10 years in Backend & Data Science',
    availability: ['2024-05-22T09:00:00Z'],
    // Added missing properties to satisfy UserProfile interface
    matches: [],
    isProfileComplete: true
  },
  {
    id: 'm3',
    name: 'Elena Rodriguez',
    email: 'elena@example.com',
    role: UserRole.MENTOR,
    avatar: 'https://picsum.photos/seed/elena/200',
    skills: ['Product Management', 'Agile', 'Strategy', 'Startup'],
    interests: ['Product Growth', 'Leadership'],
    bio: 'Former founder and current Lead PM. Helping mentees navigate the business side of tech.',
    experience: '12 years in Product Management',
    availability: ['2024-05-23T16:00:00Z'],
    // Added missing properties to satisfy UserProfile interface
    matches: [],
    isProfileComplete: true
  }
];

export const FORUM_TOPICS = ['React', 'Career Advice', 'Backend', 'AI & ML', 'Soft Skills'];
