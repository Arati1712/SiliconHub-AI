import { useState, useRef, useEffect } from 'react';
import { Bot, User as UserIcon, Send } from 'lucide-react';
import { getMentorResponseStream } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
  isStreaming?: boolean;
}

export default function MentorChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am SiliconHub AI. I am here to facilitate your masters in core ECE subjects and optimize your career trajectory. How may I assist your synthesis today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isInitialLoad = true;
    if (user) {
      const q = query(
        collection(db, 'users', user.uid, 'chat_messages'),
        orderBy('timestamp', 'asc'),
        limit(50)
      );

      const path = `users/${user.uid}/chat_messages`;
      const unsubscribe = onSnapshot(q, (snapshot) => {
        try {
          const history: Message[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Message));
          
          if (history.length > 0 && isInitialLoad) {
            setMessages([
              { role: 'assistant', content: 'Hello! I am SiliconHub AI. I am here to facilitate your masters in core ECE subjects and optimize your career trajectory. How may I assist your synthesis today?' },
              ...history
            ]);
            isInitialLoad = false;
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, path);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      });

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setIsLoading(true);
    setStreamingText('');

    // Optimistic UI update
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

    if (user) {
       const path = `users/${user.uid}/chat_messages`;
       addDoc(collection(db, path), {
        role: 'user',
        content: userMsg,
        timestamp: serverTimestamp()
      }).catch(e => handleFirestoreError(e, OperationType.WRITE, path));
    }

    try {
      const contextHistory = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const stream = await getMentorResponseStream(userMsg, contextHistory);
      
      let fullResponse = '';
      for await (const chunk of stream) {
        if (chunk.text) {
          fullResponse += chunk.text;
          setStreamingText(fullResponse);
        }
      }

      if (user) {
        const path = `users/${user.uid}/chat_messages`;
        addDoc(collection(db, path), {
          role: 'assistant',
          content: fullResponse,
          timestamp: serverTimestamp()
        }).catch(e => handleFirestoreError(e, OperationType.WRITE, path));
      }
      setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
    } catch (error) {
      console.error('Mentor synthesis error:', error);
      const errorMsg = "Advisory: A technical connection interruption occurred during synthesis. Please verify your authorized status and network connectivity.";
      if (!user) {
        setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      }
    } finally {
      setIsLoading(false);
      setStreamingText('');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-280px)] editorial-card overflow-hidden bg-white shadow-xl border-slate-900">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-sm bg-brand-ink flex items-center justify-center text-white shadow-sm ring-2 ring-slate-100">
            <Bot size={24} />
          </div>
          <div>
            <h3 className="font-serif font-black text-xl tracking-tight">SiliconHub Intelligence</h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="editorial-label opacity-60">System Online • Pro Synthesis Engine</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] bg-slate-50/30">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`editorial-label text-[9px] mb-2 px-2 flex items-center gap-2 ${msg.role === 'user' ? 'text-brand-indigo' : 'text-slate-400'}`}>
              {msg.role === 'user' ? (
                <>Aspiring ECE Engineer <UserIcon size={10} /></>
              ) : (
                <><Bot size={10} /> SiliconHub Architecture AI</>
              )}
            </div>
            <div className={`flex max-w-[85%] gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`p-6 rounded-none text-sm leading-relaxed font-sans shadow-lg border-2 ${
                msg.role === 'user' 
                  ? 'bg-slate-900 text-white border-slate-900 rounded-bl-3xl' 
                  : 'bg-white text-slate-800 border-slate-200 font-serif italic text-base rounded-tr-3xl shadow-slate-200/50'
              }`}>
                {msg.content}
              </div>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex max-w-[85%] gap-4">
              <div className="bg-brand-indigo/5 text-slate-800 border-2 border-brand-indigo/20 p-6 rounded-tr-3xl font-serif italic text-base shadow-sm">
                {streamingText || (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-brand-indigo rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-brand-indigo rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-brand-indigo rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-8 bg-white border-t-2 border-slate-900">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center gap-4"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query technical logic or carrier roadmap..."
            className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-none px-8 py-5 text-base focus:outline-none focus:border-slate-900 transition-all font-serif italic"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-slate-900 text-white px-10 py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-brand-indigo transition-all disabled:opacity-50 disabled:grayscale flex items-center gap-3"
          >
            Consult <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
