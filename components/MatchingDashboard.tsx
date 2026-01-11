
import React, { useState, useEffect } from 'react';
import { Target, Star, Brain, Sparkles, MessageSquare, CheckCircle } from 'lucide-react';
import { UserProfile, MatchScore } from '../types';
import { MOCK_MENTORS } from '../constants';
import { geminiService } from '../services/geminiService';

interface MatchingDashboardProps {
  mentee: UserProfile;
}

const MatchingDashboard: React.FC<MatchingDashboardProps> = ({ mentee }) => {
  const [matches, setMatches] = useState<MatchScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [requestedIds, setRequestedIds] = useState<string[]>([]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const results = await geminiService.getMatchRecommendations(mentee, MOCK_MENTORS);
      setMatches(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [mentee]);

  const handleRequestMatch = (id: string) => {
    setRequestedIds(prev => [...prev, id]);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="text-indigo-600" size={24} />
            <h2 className="text-3xl font-bold text-slate-800">AI Matchmaking</h2>
          </div>
          <p className="text-slate-500 max-w-xl">
            We've analyzed your skills in <span className="text-indigo-600 font-semibold">{mentee.skills.join(', ')}</span> and goals to find mentors who can accelerate your growth.
          </p>
        </div>
        <button 
          onClick={fetchMatches}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
        >
          <Sparkles size={18} />
          Recalculate Matches
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-3xl border animate-pulse">
              <div className="flex gap-4 mb-4">
                <div className="w-14 h-14 bg-slate-100 rounded-full" />
                <div className="flex-1 space-y-2 py-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-10 bg-slate-50 rounded" />
                <div className="h-20 bg-slate-50 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map(match => {
            const mentor = MOCK_MENTORS.find(m => m.id === match.mentorId);
            if (!mentor) return null;
            const isRequested = requestedIds.includes(mentor.id);

            return (
              <div key={mentor.id} className="bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 -mr-12 -mt-12 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                
                <div className="flex items-center gap-4 mb-6 relative">
                  <img src={mentor.avatar} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md" alt={mentor.name} />
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{mentor.name}</h3>
                    <p className="text-sm text-indigo-600 font-medium">{mentor.experience}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-slate-400 font-bold">4.9 (12 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Compatibility</span>
                    <span className="text-xs font-bold text-indigo-600 px-2 py-1 bg-indigo-50 rounded-full">{match.score}% Match</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${match.score}%` }} />
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl mb-6">
                  <p className="text-xs text-slate-600 italic">"{match.reason}"</p>
                </div>

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {mentor.skills.map(skill => (
                      <span key={skill} className="text-[10px] font-bold px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => handleRequestMatch(mentor.id)}
                    disabled={isRequested}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      isRequested 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                    }`}
                  >
                    {isRequested ? (
                      <><CheckCircle size={18} /> Request Sent</>
                    ) : (
                      <><Target size={18} /> Request Match</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MatchingDashboard;
