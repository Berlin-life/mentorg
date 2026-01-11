
import React from 'react';
import { 
  Users, 
  Clock, 
  MessageSquare, 
  TrendingUp,
  Award,
  BookOpen
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserProfile } from '../types';

interface DashboardProps {
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const stats = [
    { label: 'Active Sessions', value: '4', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Connections', value: '12', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Requests', value: '2', icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Goals Completed', value: '85%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const data = [
    { name: 'Mon', hours: 1.5 },
    { name: 'Tue', hours: 2.3 },
    { name: 'Wed', hours: 1.0 },
    { name: 'Thu', hours: 3.5 },
    { name: 'Fri', hours: 2.0 },
    { name: 'Sat', hours: 0.5 },
    { name: 'Sun', hours: 0.0 },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Welcome back, {user.name} 👋</h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your mentorship journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Learning Hours</h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#4f46e5' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Your Next Session</h3>
          <div className="space-y-6">
            <div className="flex gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <img src="https://picsum.photos/seed/sarah/100" className="w-12 h-12 rounded-xl object-cover" alt="Sarah" />
              <div>
                <h4 className="font-bold text-indigo-900">Sarah Chen</h4>
                <p className="text-xs text-indigo-700/70 font-medium">React Optimization</p>
                <div className="flex items-center gap-2 mt-2 text-xs font-bold text-indigo-600">
                  <Clock size={12} />
                  <span>Today, 2:00 PM</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Quick Actions</h4>
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                <div className="flex items-center gap-3">
                  <Award className="text-indigo-600" size={20} />
                  <span className="font-semibold text-slate-700">Submit Progress</span>
                </div>
                <TrendingUp size={16} className="text-slate-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-indigo-600" size={20} />
                  <span className="font-semibold text-slate-700">Learning Resources</span>
                </div>
                <TrendingUp size={16} className="text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
