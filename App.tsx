
import React, { useState, useEffect } from 'react';
import { UserRole, UserProfile } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import MatchingDashboard from './components/MatchingDashboard';
import Forum from './components/Forum';
import Chat from './components/Chat';
import Scheduler from './components/Scheduler';
import { MOCK_MENTORS } from './constants';
import { 
  User, 
  Mail, 
  Lock, 
  UserPlus, 
  LogIn, 
  ChevronRight, 
  Tag, 
  Calendar, 
  Layout, 
  ShieldCheck, 
  ArrowLeft, 
  GraduationCap, 
  Presentation, 
  AlertCircle,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<'role-select' | 'auth' | 'setup' | 'app'>('role-select');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Auth Forms State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  // Profile Setup State
  const [setupData, setSetupData] = useState({
    bio: '',
    skills: [] as string[],
    interests: [] as string[],
    availability: [] as string[],
    newSkill: '',
    newInterest: ''
  });

  useEffect(() => {
    const session = localStorage.getItem('currentUser');
    if (session) {
      const parsedUser = JSON.parse(session);
      setUser(parsedUser);
      setIsLoggedIn(true);
      setView('app');
    }
  }, []);

  const getDB = (): UserProfile[] => {
    const db = localStorage.getItem('user_database');
    return db ? JSON.parse(db) : [];
  };

  const saveToDB = (newUser: UserProfile) => {
    const db = getDB();
    db.push(newUser);
    localStorage.setItem('user_database', JSON.stringify(db));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (formData.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    setIsLoading(true);
    
    // Simulate API Delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const db = getDB();
    if (db.some(u => u.email === formData.email)) {
      setError("An account with this email already exists.");
      setIsLoading(false);
      return;
    }

    if (!selectedRole) {
      setIsLoading(false);
      return;
    }

    const newUser: UserProfile = {
      id: 'user-' + Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password, 
      role: selectedRole,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
      skills: [],
      interests: [],
      bio: '',
      availability: [],
      matches: [],
      isProfileComplete: false
    };

    saveToDB(newUser);
    setUser(newUser);
    setIsLoading(false);
    setView('setup');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    // Simulate API Delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const db = getDB();
    const foundUser = db.find(u => 
      u.email === formData.email && 
      u.password === formData.password && 
      u.role === selectedRole
    );

    if (foundUser) {
      setUser(foundUser);
      if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
      }
      setIsLoggedIn(true);
      setIsLoading(false);
      setView(foundUser.isProfileComplete ? 'app' : 'setup');
    } else {
      setIsLoading(false);
      const userExistsWithWrongRole = db.find(u => u.email === formData.email && u.password === formData.password);
      if (userExistsWithWrongRole) {
        setError(`This account is registered as a ${userExistsWithWrongRole.role}. Please select the correct role.`);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }
  };

  const handleSetupComplete = () => {
    if (!user) return;

    const isBioFilled = setupData.bio.trim().length > 0;
    const isSkillsFilled = setupData.skills.length > 0;
    const isInterestsFilled = setupData.interests.length > 0;
    const isAvailabilityFilled = setupData.availability.length > 0;

    if (!isBioFilled && !isSkillsFilled && !isInterestsFilled && !isAvailabilityFilled) {
      setSetupError("Please fill at least one profile detail before saving.");
      return;
    }

    const completedUser = {
      ...user,
      bio: setupData.bio,
      skills: setupData.skills,
      interests: setupData.interests,
      availability: setupData.availability,
      isProfileComplete: true
    };
    
    const db = getDB();
    const updatedDB = db.map(u => u.id === user.id ? completedUser : u);
    localStorage.setItem('user_database', JSON.stringify(updatedDB));
    
    setUser(completedUser);
    localStorage.setItem('currentUser', JSON.stringify(completedUser));
    setIsLoggedIn(true);
    setView('app');
  };

  const addTag = (type: 'skills' | 'interests') => {
    const value = type === 'skills' ? setupData.newSkill : setupData.newInterest;
    if (!value.trim()) return;
    
    setSetupError(null);
    setSetupData(prev => ({
      ...prev,
      [type]: [...prev[type], value.trim()],
      [type === 'skills' ? 'newSkill' : 'newInterest']: ''
    }));
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setUser(null);
    setSelectedRole(null);
    setView('role-select');
    setFormData({ email: '', password: '', name: '' });
    setSetupError(null);
    setIsLoading(false);
  };

  if (view === 'role-select') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[2.5rem] border shadow-2xl max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div>
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-100">
              <span className="text-4xl font-bold">M</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight">MentorMatch</h1>
            <p className="text-slate-500 mt-2 font-medium">Identify your role to get started</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => { setSelectedRole(UserRole.MENTEE); setView('auth'); setAuthMode('login'); }}
              className="group flex items-center justify-between p-6 rounded-3xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <GraduationCap size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Student</h3>
                  <p className="text-sm text-slate-500">I am looking for guidance</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </button>

            <button 
              onClick={() => { setSelectedRole(UserRole.MENTOR); setView('auth'); setAuthMode('login'); }}
              className="group flex items-center justify-between p-6 rounded-3xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Presentation size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">Instructor</h3>
                  <p className="text-sm text-slate-500">I want to mentor others</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="pt-4 text-xs text-slate-400 font-medium">
            Choose carefully. Roles determine your platform experience.
          </div>
        </div>
      </div>
    );
  }

  if (view === 'auth') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border shadow-2xl max-w-lg w-full space-y-8 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
          <button 
            onClick={() => setView('role-select')} 
            className="absolute top-6 left-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            disabled={isLoading}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100 mb-4">
              {selectedRole === UserRole.MENTEE ? <><GraduationCap size={14}/> Student</> : <><Presentation size={14}/> Instructor</>}
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-slate-500 mt-2">
              {authMode === 'login' ? 'Please enter your credentials to continue.' : 'Join our global community of learners.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-semibold border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle size={18} className="shrink-0" /> 
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-5">
            {authMode === 'register' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input 
                    required
                    type="text" 
                    placeholder="Jane Doe"
                    className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none border"
                    value={formData.name}
                    onChange={e => {
                      setFormData({...formData, name: e.target.value});
                      if (error) setError(null);
                    }}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  required
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none border"
                  value={formData.email}
                  onChange={e => {
                    setFormData({...formData, email: e.target.value});
                    if (error) setError(null);
                  }}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
                {authMode === 'login' && (
                  <button type="button" className="text-[10px] font-bold text-indigo-600 hover:underline">Forgot password?</button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  required
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-slate-200 rounded-2xl py-3.5 pl-12 pr-12 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none border"
                  value={formData.password}
                  onChange={e => {
                    setFormData({...formData, password: e.target.value});
                    if (error) setError(null);
                  }}
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {authMode === 'register' && (
                <p className="text-[10px] text-slate-400 mt-1 ml-1 italic">Minimum 6 characters required.</p>
              )}
            </div>

            <div className="flex items-center gap-2 ml-1">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
              />
              <label htmlFor="remember" className="text-xs font-medium text-slate-500 cursor-pointer select-none">Remember this device</label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 text-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                authMode === 'login' ? <><LogIn size={20}/> Log In</> : <><UserPlus size={20}/> Create Account</>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <button 
              onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError(null); }}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {authMode === 'login' ? "New here? Create an account" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'setup') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] border shadow-2xl max-w-2xl w-full space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500 relative">
          
          {setupError && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[calc(100%-4rem)] bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 z-10 shadow-sm">
              <AlertCircle size={20} className="shrink-0" />
              <span>{setupError}</span>
            </div>
          )}

          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">One Last Step</h2>
              <p className="text-slate-500 mt-2">Finish your profile to start finding matches.</p>
            </div>
            <div className="text-indigo-600 font-bold bg-indigo-50 px-4 py-2 rounded-2xl text-sm border border-indigo-100 uppercase">
              {user?.role === UserRole.MENTOR ? 'Instructor' : 'Student'}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Introduction / Bio</label>
              <textarea 
                rows={3}
                placeholder="Share a bit about your background..."
                className="w-full bg-slate-50 border-slate-200 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none border"
                value={setupData.bio}
                onChange={e => {
                  setSetupData({...setupData, bio: e.target.value});
                  if (setupError) setSetupError(null);
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-2"><Tag size={14}/> Key Skills</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. React"
                    className="flex-1 bg-slate-50 border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border"
                    value={setupData.newSkill}
                    onChange={e => setSetupData({...setupData, newSkill: e.target.value})}
                    onKeyDown={e => e.key === 'Enter' && addTag('skills')}
                  />
                  <button onClick={() => addTag('skills')} className="bg-slate-800 text-white px-4 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors">+</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {setupData.skills.map(s => (
                    <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100">{s}</span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-2"><Layout size={14}/> Interests</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. Fintech"
                    className="flex-1 bg-slate-50 border-slate-200 rounded-xl py-2.5 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border"
                    value={setupData.newInterest}
                    onChange={e => setSetupData({...setupData, newInterest: e.target.value})}
                    onKeyDown={e => e.key === 'Enter' && addTag('interests')}
                  />
                  <button onClick={() => addTag('interests')} className="bg-slate-800 text-white px-4 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors">+</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {setupData.interests.map(i => (
                    <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">{i}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1 flex items-center gap-2"><Calendar size={14}/> Availability</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Weekday Mornings', 'Weekday Evenings', 'Weekends', 'Flexible'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      if (setupError) setSetupError(null);
                      const exists = setupData.availability.includes(opt);
                      setSetupData({
                        ...setupData,
                        availability: exists 
                          ? setupData.availability.filter(a => a !== opt) 
                          : [...setupData.availability, opt]
                      });
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                      setupData.availability.includes(opt)
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t flex items-center justify-between">
            <button onClick={logout} className="text-slate-400 font-bold hover:text-red-500 transition-colors">Discard</button>
            <button 
              onClick={handleSetupComplete}
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 flex items-center gap-2 transition-all group active:scale-95"
            >
              Enter Dashboard <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        userRole={user?.role || UserRole.MENTEE} 
        onLogout={logout}
      />
      
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && user && <Dashboard user={user} />}
        {activeTab === 'matching' && user && <MatchingDashboard mentee={user} />}
        {activeTab === 'forum' && <Forum />}
        {activeTab === 'chat' && user && (
          <div className="h-screen flex">
            <div className="w-80 border-r bg-white h-full overflow-y-auto">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-slate-800">Messages</h2>
                <div className="mt-4 relative">
                  <input 
                    type="text" 
                    placeholder="Search people..." 
                    className="w-full bg-slate-100 border-none rounded-xl py-2 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="p-2 space-y-1">
                {MOCK_MENTORS.map(m => (
                  <button key={m.id} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group">
                    <img src={m.avatar} className="w-12 h-12 rounded-full object-cover group-hover:ring-2 ring-indigo-500 transition-all" alt={m.name} />
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="font-bold text-slate-800 truncate">{m.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium">10:30 AM</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate">Looking forward to our chat!</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <Chat currentUser={user} selectedContact={MOCK_MENTORS[0]} />
          </div>
        )}
        {activeTab === 'schedule' && <Scheduler />}
        {activeTab === 'settings' && (
          <div className="p-8 max-w-2xl mx-auto">
             <div className="bg-white rounded-3xl border p-8 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-bold text-slate-800">Profile Settings</h2>
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100 uppercase">
                    {user?.role === UserRole.MENTOR ? 'Instructor' : 'Student'}
                 </span>
               </div>
               <div className="space-y-6">
                 <div className="flex items-center gap-6">
                   <img src={user?.avatar} className="w-24 h-24 rounded-[2rem] border-4 border-indigo-50 shadow-md" alt="Avatar" />
                   <div className="space-y-2">
                    <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-semibold hover:bg-slate-200 transition-colors text-sm">Change Avatar</button>
                    <p className="text-[10px] text-slate-400 font-medium ml-1 uppercase tracking-wider">Using Dicebear avatars</p>
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                     <input type="text" className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue={user?.name} />
                   </div>
                   <div className="space-y-1">
                     <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Address</label>
                     <input type="email" className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none opacity-60 cursor-not-allowed" defaultValue={user?.email} disabled />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-400 uppercase ml-1">Biography</label>
                   <textarea rows={4} className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" defaultValue={user?.bio} />
                 </div>
                 <div className="flex justify-end gap-3 pt-6 border-t">
                   <button onClick={logout} className="px-6 py-2 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all">Sign Out</button>
                   <button className="bg-indigo-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">Save Changes</button>
                 </div>
               </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
