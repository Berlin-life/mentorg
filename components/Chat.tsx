
import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, Smile, Phone, Video, Info } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';

interface ChatProps {
  currentUser: UserProfile;
  selectedContact?: UserProfile;
}

const Chat: React.FC<ChatProps> = ({ currentUser, selectedContact }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedContact) {
      // Simulate loading message history
      setMessages([
        {
          id: '1',
          senderId: selectedContact.id,
          receiverId: currentUser.id,
          text: `Hi ${currentUser.name}! I reviewed your goals. Happy to help you with React optimization.`,
          timestamp: '10:30 AM'
        }
      ]);
    }
  }, [selectedContact, currentUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedContact) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedContact.id,
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate auto-reply
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: selectedContact.id,
        receiverId: currentUser.id,
        text: "That sounds great! Let's schedule a session to discuss further.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  if (!selectedContact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 h-full">
        <MessageSquare size={64} className="mb-4 opacity-20" />
        <h3 className="text-xl font-medium">Select a contact to start messaging</h3>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full relative">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center glass sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={selectedContact.avatar} className="w-10 h-10 rounded-full object-cover" alt={selectedContact.name} />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-none">{selectedContact.name}</h3>
            <span className="text-xs text-green-500 font-medium">Online now</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <button className="hover:text-indigo-600"><Phone size={20} /></button>
          <button className="hover:text-indigo-600"><Video size={20} /></button>
          <button className="hover:text-indigo-600"><Info size={20} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map(msg => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${
                isMe 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100' 
                  : 'bg-white text-slate-800 border rounded-tl-none'
              }`}>
                <p>{msg.text}</p>
                <span className={`text-[10px] mt-1 block opacity-70 ${isMe ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl">
          <button className="p-2 text-slate-500 hover:text-indigo-600 transition-colors">
            <Image size={20} />
          </button>
          <button className="p-2 text-slate-500 hover:text-indigo-600 transition-colors">
            <Smile size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-800 py-2"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            className={`p-3 rounded-xl transition-all ${
              inputText.trim() ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
import { MessageSquare } from 'lucide-react';
