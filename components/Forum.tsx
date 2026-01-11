
import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, PlusCircle } from 'lucide-react';
import { ForumPost } from '../types';
import { FORUM_TOPICS } from '../constants';

const Forum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: 'p1',
      authorId: 'u1',
      authorName: 'Kevin Lee',
      title: 'How to transition from Frontend to Fullstack?',
      content: 'I have been working with React for 2 years and want to learn Node.js. Any specific path recommendations?',
      topic: 'Career Advice',
      timestamp: '2 hours ago',
      likes: 12
    },
    {
      id: 'p2',
      authorId: 'u2',
      authorName: 'Maria Garcia',
      title: 'Best practices for React 18 server components?',
      content: 'Struggling to understand the boundary between client and server components in Next.js.',
      topic: 'React',
      timestamp: '5 hours ago',
      likes: 8
    }
  ]);

  const [activeTopic, setActiveTopic] = useState('All');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', topic: FORUM_TOPICS[0] });

  const filteredPosts = activeTopic === 'All' 
    ? posts 
    : posts.filter(p => p.topic === activeTopic);

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) return;
    const post: ForumPost = {
      id: Date.now().toString(),
      authorId: 'currentUser',
      authorName: 'Current User',
      title: newPost.title,
      content: newPost.content,
      topic: newPost.topic,
      timestamp: 'Just now',
      likes: 0
    };
    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', topic: FORUM_TOPICS[0] });
    setShowNewPost(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Community Forum</h2>
          <p className="text-slate-500">Ask questions and share knowledge with fellow members.</p>
        </div>
        <button 
          onClick={() => setShowNewPost(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-md"
        >
          <PlusCircle size={20} />
          New Question
        </button>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['All', ...FORUM_TOPICS].map(topic => (
          <button
            key={topic}
            onClick={() => setActiveTopic(topic)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeTopic === topic 
                ? 'bg-slate-800 text-white' 
                : 'bg-white text-slate-600 border hover:border-slate-300'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {showNewPost && (
        <div className="mb-8 bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-lg font-bold mb-4 text-slate-800">Ask the Community</h3>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Question Title"
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={newPost.title}
              onChange={e => setNewPost({...newPost, title: e.target.value})}
            />
            <select 
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={newPost.topic}
              onChange={e => setNewPost({...newPost, topic: e.target.value})}
            >
              {FORUM_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <textarea 
              placeholder="Describe your question in detail..."
              rows={4}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              value={newPost.content}
              onChange={e => setNewPost({...newPost, content: e.target.value})}
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowNewPost(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreatePost}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-all"
              >
                Post Question
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white p-6 rounded-2xl border hover:border-indigo-200 transition-all group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                  {post.topic}
                </span>
                <h3 className="text-xl font-bold mt-2 text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 mt-2 line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-4 mt-6 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200" />
                    <span className="font-medium text-slate-700">{post.authorName}</span>
                  </div>
                  <span>•</span>
                  <span>{post.timestamp}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 ml-6">
                <button className="flex flex-col items-center p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all">
                  <ThumbsUp size={20} />
                  <span className="text-xs font-bold mt-1">{post.likes}</span>
                </button>
                <button className="flex flex-col items-center p-2 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-all">
                  <MessageSquare size={20} />
                  <span className="text-xs font-bold mt-1">4</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;
