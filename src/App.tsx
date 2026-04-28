/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  BrainCircuit, 
  FileText, 
  MessageSquare, 
  Newspaper,
  Menu,
  X,
  Cpu,
  Layers,
  Activity,
  LogOut,
  LogIn,
  ArrowRight,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SubjectView from './components/SubjectView';
import MentorChat from './components/MentorChat';
import ResumeTool from './components/ResumeTool';
import IndustryHub from './components/IndustryHub';
import QuizSection from './components/QuizSection';
import LoginModal from './components/LoginModal';
import { useAuth } from './contexts/AuthContext';
import { Mail as MailIcon, LogIn as LogInIcon } from 'lucide-react';

type Tab = 'dashboard' | 'subjects' | 'quiz' | 'resume' | 'chat' | 'industry';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'subjects', label: 'Subject Expert', icon: BookOpen },
    { id: 'quiz', label: 'Quiz Master', icon: BrainCircuit },
    { id: 'resume', label: 'Resume Optimizer', icon: FileText },
    { id: 'chat', label: 'Mentor Chat', icon: MessageSquare },
    { id: 'industry', label: 'Industry Pulse', icon: Newspaper },
  ];

  return (
    <div className="flex h-screen bg-brand-bg text-brand-ink overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-white border-r border-slate-200 flex flex-col z-30 relative shrink-0 overflow-hidden"
      >
        <div className="p-8 pb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-brand-ink flex items-center justify-center">
            <Cpu className="text-white w-5 h-5" />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-serif font-black text-2xl tracking-tighter"
            >
              SiliconHub <span className="text-brand-indigo italic">AI</span>
            </motion.span>
          )}
        </div>

        {isSidebarOpen && (
          <div className="px-8 mb-8">
            <span className="editorial-label">Industry Mentor for ECE</span>
          </div>
        )}

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all uppercase text-[10px] font-bold tracking-widest ${
                activeTab === item.id 
                  ? 'bg-brand-indigo text-white shadow-sm' 
                  : 'text-slate-500 hover:text-brand-ink hover:bg-slate-50'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
              {isSidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-4 py-8 border-t border-slate-100 italic">
          {user ? (
            <div className={`flex items-center gap-3 ${isSidebarOpen ? '' : 'justify-center'}`}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                  <UserIcon size={16} />
                </div>
              )}
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-brand-ink truncate font-sans uppercase tracking-[0.1em]">{user.displayName || 'ECE Student'}</p>
                  <button 
                    onClick={logout}
                    className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 mt-1"
                  >
                    <LogOut size={10} /> Disconnect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setIsLoginOpen(true)}
              className={`w-full flex items-center gap-3 px-4 py-3 bg-brand-indigo text-white rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-brand-indigo/90 transition-all ${isSidebarOpen ? '' : 'justify-center'}`}
            >
              <LogIn size={16} />
              {isSidebarOpen && <span>Secure Entry</span>}
            </button>
          )}
        </div>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-8 text-slate-400 hover:text-brand-ink transition-colors flex items-center justify-center"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12 relative flex flex-col">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between border-b-2 border-brand-ink pb-6">
          <div>
            <span className="editorial-label block mb-2">Academic & Career Edition • 2026</span>
            <h1 className="text-6xl editorial-heading">
              {navItems.find(i => i.id === activeTab)?.label || 'Synthesis Hub'}
            </h1>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              ISM 2.0 Connected
            </span>
            <span className="hidden sm:inline">Volume IV</span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-grow"
          >
            {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
            {activeTab === 'subjects' && <SubjectView />}
            {activeTab === 'quiz' && <QuizSection />}
            {activeTab === 'resume' && <ResumeTool />}
            {activeTab === 'chat' && <MentorChat />}
            {activeTab === 'industry' && <IndustryHub />}
          </motion.div>
        </AnimatePresence>

        <footer className="mt-12 pt-6 border-t border-slate-200 flex justify-between editorial-label">
          <div>SiliconHub © 2026 • Career Excellence</div>
          <div className="flex gap-8">
            <span>Digital Electronics</span>
            <span>VLSI Design</span>
            <span>Signals & Systems</span>
          </div>
        </footer>
      </main>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

function Dashboard({ setActiveTab }: { setActiveTab: (tab: Tab) => void }) {
  const { user } = useAuth();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-12">
        <div className="bg-slate-900 text-white p-12 rounded-sm relative overflow-hidden group">
          <div className="relative z-10 max-w-lg">
            <span className="bg-brand-indigo px-3 py-1 text-[10px] uppercase font-bold tracking-widest mb-6 inline-block">Special Report</span>
            <h2 className="text-5xl font-serif leading-tight mb-6">Master the <span className="italic text-brand-indigo">Silicon</span> Frontier</h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed font-sans">
              Indian Semiconductor Mission 2.0 is transforming the landscape. 
              Master VLSI, Signals & Systems, and Microprocessors to secure your role in the next generation of global chip design.
            </p>
            <div className="flex gap-6">
              <button 
                onClick={() => setActiveTab('subjects')}
                className="editorial-btn"
              >
                Start Study Modules
              </button>
              <button 
                onClick={() => setActiveTab('resume')}
                className="editorial-btn bg-white text-brand-ink hover:bg-slate-200"
              >
                Career Tools
              </button>
            </div>
          </div>
          <div className="absolute right-[-40px] top-[-40px] opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
             <Cpu size={300} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <QuickAction 
            icon={Layers} 
            title="VLSI Flow" 
            desc="ASIC design from RTL to GDSII." 
            color="indigo"
            onClick={() => setActiveTab('subjects')}
          />
          <QuickAction 
            icon={Activity} 
            title="S&S Basics" 
            desc="Fourier & Z-Transforms simplified." 
            color="emerald"
            onClick={() => setActiveTab('subjects')}
          />
          <QuickAction 
            icon={Cpu} 
            title="8085 Arch" 
            desc="Master Microprocessor basics." 
            color="amber"
            onClick={() => setActiveTab('subjects')}
          />
        </div>
      </div>

      <div className="space-y-12">
        <div className="bg-white border-2 border-brand-ink p-8">
          <h3 className="editorial-label flex items-center gap-2 mb-6">
            <div className="w-2 h-2 bg-brand-indigo rounded-full"></div>
            Industry Pulse
          </h3>
          <div className="space-y-6">
            <NewsItem title="Delhi Semiconductor Policy 2026" date="Feb 2026" />
            <NewsItem title="ISM 2.0: ₹76,000 Cr Incentive" date="Jan 2026" />
            <NewsItem title="NVIDIA Expands Hyderabad R&D" date="Dec 2025" />
          </div>
          <button 
            onClick={() => setActiveTab('industry')}
            className="w-full mt-8 py-3 text-[10px] font-bold uppercase tracking-widest border border-slate-200 hover:border-brand-ink transition-all"
          >
            Read All Updates
          </button>
        </div>

        {user && (
          <div className="bg-white border-2 border-brand-ink p-8">
            <h3 className="editorial-label flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-brand-indigo rounded-full"></div>
              Recent Synthesis
            </h3>
            <p className="text-[10px] text-slate-400 italic mb-4">Last recorded career artifacts</p>
            <div className="space-y-4">
              <button 
                onClick={() => setActiveTab('resume')}
                className="w-full text-left p-4 bg-slate-50 border border-slate-100 hover:border-brand-indigo transition-all group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Resume Task</span>
                  <ArrowRight size={12} className="text-slate-300 group-hover:text-brand-indigo" />
                </div>
                <p className="text-xs font-serif italic mt-1 text-slate-600 line-clamp-1">View latest optimized resume points</p>
              </button>
              <button 
                onClick={() => setActiveTab('chat')}
                className="w-full text-left p-4 bg-slate-50 border border-slate-100 hover:border-brand-indigo transition-all group"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Mentor Query</span>
                  <ArrowRight size={12} className="text-slate-300 group-hover:text-brand-indigo" />
                </div>
                <p className="text-xs font-serif italic mt-1 text-slate-600 line-clamp-1">Resume recent academic consultation</p>
              </button>
            </div>
          </div>
        )}

        <div className="bg-indigo-50 border border-indigo-100 p-8">
          <h3 className="editorial-label text-indigo-900 mb-2">GATE Prep Lite</h3>
          <p className="text-xs text-slate-500 mb-6 italic">Subject: CMOS Inverter Transitions</p>
          <button 
            onClick={() => setActiveTab('quiz')}
            className="w-full py-3 bg-brand-indigo text-white text-[10px] font-bold uppercase tracking-widest rounded-sm shadow-md"
          >
            Take Quick Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, title, desc, color, onClick }: any) {
  const colorMap: any = {
    indigo: 'border-brand-indigo',
    emerald: 'border-brand-emerald',
    amber: 'border-brand-amber'
  };

  return (
    <button 
      onClick={onClick}
      className={`editorial-card p-6 flex flex-col items-start text-left border-l-4 ${colorMap[color] || 'border-brand-indigo'}`}
    >
      <div className="p-2 bg-slate-50 rounded-sm mb-4">
        <Icon size={18} className="text-slate-400" />
      </div>
      <h4 className="font-serif font-bold text-lg mb-2 italic leading-tight">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </button>
  );
}

function NewsItem({ title, date }: any) {
  return (
    <div className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
      <p className="text-sm font-bold hover:text-brand-indigo cursor-pointer transition-colors leading-snug">{title}</p>
      <p className="editorial-label opacity-40 mt-2">{date}</p>
    </div>
  );
}
