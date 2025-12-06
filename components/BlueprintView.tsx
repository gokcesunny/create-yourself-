import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { GeneratedRole, UserProfile } from '../types';
import { generateRoleBlueprint, chatWithCareerCoach } from '../services/geminiService';
import { Send, ArrowLeft, Download, MessageSquare, X } from 'lucide-react';

interface BlueprintViewProps {
  role: GeneratedRole;
  profile: UserProfile;
  onBack: () => void;
}

export const BlueprintView: React.FC<BlueprintViewProps> = ({ role, profile, onBack }) => {
  const [blueprintContent, setBlueprintContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchBlueprint = async () => {
      try {
        const content = await generateRoleBlueprint(role, profile);
        if (isMounted) {
          setBlueprintContent(content);
          setLoading(false);
          // Initialize chat with context
          setChatHistory([
            { role: 'model', text: `Hi! I'm your Career Architect for the role of **${role.title}**. What questions do you have about this path?` }
          ]);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    };
    fetchBlueprint();
    return () => { isMounted = false; };
  }, [role, profile]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, chatOpen]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    try {
      // Format history for API
      const apiHistory = chatHistory.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }));
      // Add current role context implicitly by the prompt structure in service, 
      // but strictly for the chat method, we can just rely on the ongoing context or prepend system instruction.
      // The service creates a new chat each time in this simple implementation, 
      // so for persistent chat, we should pass the full history including the context about the role.
      // However, to keep it simple and robust, we will just pass the history array.
      
      // Let's prepend context if it's the first real interaction or rely on system instruction.
      // Ideally, the system instruction in `geminiService` knows about general career coaching. 
      // To make it context aware of the *current* role, we can prepend a hidden system message in the history if the API allowed, 
      // or just trust the user's prompt references the blueprint. 
      // A better way: Let's assume the user asks specific questions.
      
      const response = await chatWithCareerCoach(apiHistory, userMsg);
      
      if (response) {
        setChatHistory(prev => [...prev, { role: 'model', text: response }]);
      }
    } catch (error) {
      console.error(error);
      setChatHistory(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const downloadBlueprint = () => {
    const element = document.createElement("a");
    const file = new Blob([blueprintContent], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${role.title.replace(/\s+/g, '_')}_Blueprint.md`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="relative min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-900 font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Roles
          </button>
          <div className="flex items-center gap-4">
            <button 
              onClick={downloadBlueprint}
              disabled={loading}
              className="p-2 text-slate-500 hover:text-indigo-600 transition-colors"
              title="Download Markdown"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={() => setChatOpen(!chatOpen)}
              className={`p-2 transition-colors ${chatOpen ? 'text-indigo-600 bg-indigo-50 rounded-lg' : 'text-slate-500 hover:text-indigo-600'}`}
              title="Chat Assistant"
            >
              <MessageSquare size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 flex gap-8">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${chatOpen ? 'lg:mr-[350px]' : ''}`}>
          <div className="mb-8">
            <span className="text-indigo-600 font-bold tracking-wider text-xs uppercase mb-2 block">
              Career Blueprint
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              {role.title}
            </h1>
            <p className="text-xl text-slate-600 font-light border-l-4 border-indigo-500 pl-4 py-1">
              {role.tagline}
            </p>
          </div>

          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-32 bg-slate-100 rounded-xl mt-8"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mt-8"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
            </div>
          ) : (
            <div className="prose prose-slate prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-900">
               <ReactMarkdown>{blueprintContent}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        <div className={`fixed top-16 right-0 bottom-0 w-[350px] bg-white border-l border-slate-200 shadow-2xl transform transition-transform duration-300 z-20 flex flex-col ${chatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-indigo-600" />
              Coach Assistant
            </h3>
            <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md' 
                    : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
                }`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                 <div className="bg-white border border-slate-200 rounded-2xl p-3 rounded-bl-none shadow-sm flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                 </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleChatSubmit} className="p-4 bg-white border-t border-slate-200">
            <div className="relative">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about this role..."
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-0 text-sm transition-colors"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim() || chatLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L14.39 9.61L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.61L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);