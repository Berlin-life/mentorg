
import React from 'react';
import { 
  Home, 
  Users, 
  MessageSquare, 
  Layout, 
  Calendar, 
  Settings, 
  LogOut,
  Target
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: string;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, userRole, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { 
      id: 'matching', 
      label: 'Find Mentors', 
      icon: Target, 
      hidden: userRole === UserRole.MENTOR 
    },
    { 
      id: 'mentees', 
      label: 'Mentees', 
      icon: Users, 
      hidden: userRole === UserRole.MENTEE 
    },
    { id: 'chat', label: 'Messages', icon: MessageSquare },
    { id: 'forum', label: 'Community', icon: Layout },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'settings', label: 'Profile', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">MentorMatch</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.filter(item => !item.hidden).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-semibold"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
