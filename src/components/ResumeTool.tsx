import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Copy, History, Trash2, BrainCircuit } from 'lucide-react';
import { optimizeResumePoint } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

export default function ResumeTool() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, 'users', user.uid, 'resume_points'),
        orderBy('timestamp', 'desc'),
        limit(20)
      );
      return onSnapshot(q, (snapshot) => {
        setHistory(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (error) => {
        console.error('Resume archive listener error:', error);
      });
    }
  }, [user]);

  const handleOptimize = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    
    let optimizedStr = '';
    
    try {
      // Step 1: AI Synthesis
      const result = await optimizeResumePoint(input);
      optimizedStr = result || 'Synthesis failed.';
      setOutput(optimizedStr);
      
      // Step 2: Background Storage (failure here shouldn't block the user from seeing the result)
      if (user && result) {
        const path = `users/${user.uid}/resume_points`;
        try {
          await addDoc(collection(db, path), {
            original: input,
            optimized: optimizedStr,
            timestamp: serverTimestamp()
          });
        } catch (dbError) {
          handleFirestoreError(dbError, OperationType.WRITE, path);
        }
      }
    } catch (error) {
      console.error('Synthesis Error:', error);
      setOutput('Technical connection error occurred during synthesis. Please verify your network and authorized status.');
    } finally {
      setIsLoading(false);
    }
  };

  const deletePoint = async (id: string) => {
    if (user) {
      await deleteDoc(doc(db, 'users', user.uid, 'resume_points', id));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    const timer = setTimeout(() => setCopied(false), 2000);
    // Note: In functional components without a ref or return, this timeout won't be cleared 
    // but the state update on an unmounted component is manageable in React 18+.
    // For absolute safety, we'd use a ref, but given the 2s window it's low risk.
  };

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-end border-b-2 border-brand-ink pb-12 gap-8">
        <div className="max-w-2xl">
          <span className="editorial-label text-brand-indigo mb-4 block">Architectural Synthesis</span>
          <h2 className="text-6xl editorial-heading mb-6 tracking-tight">Technical <span className="italic font-normal">Resume</span> Optimizer</h2>
          <p className="text-xl font-serif italic text-slate-500 leading-relaxed">
            Translating fundamental academic contributions into the high-precision technical lexicon required by leading semiconductor design houses.
          </p>
        </div>
        {user && (
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="editorial-btn-outline px-8 py-3 mb-1 flex items-center gap-3"
          >
            <History size={16} /> {showHistory ? 'Close Dossier' : 'Dossier Archive'}
          </button>
        )}
      </div>

      <AnimatePresence>
        {showHistory && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-100/50 border-x-2 border-slate-200"
          >
            <div className="p-12 border-b-2 border-slate-200">
              <div className="flex justify-between items-center mb-10">
                <h3 className="editorial-label text-slate-400">Historical Syntheses</h3>
                <span className="text-[10px] font-bold opacity-30">{history.length} RECORDS ATTESTED</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {history.map((item) => (
                  <div key={item.id} className="bg-white p-8 border border-slate-200 group relative flex flex-col h-full">
                    <button 
                      onClick={() => deletePoint(item.id)}
                      className="absolute top-4 right-4 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400 mb-4 tracking-widest leading-none">Record Entry</p>
                      <p className="text-base font-serif italic font-medium leading-relaxed mb-6">"{item.optimized}"</p>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(item.optimized)}
                      className="text-[10px] font-bold uppercase tracking-widest text-brand-indigo hover:text-brand-ink transition-colors flex items-center gap-2 mt-auto border-t border-slate-100 pt-4"
                    >
                      <Copy size={12} /> Extract String
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Step 1: Input */}
        <div className="lg:col-span-1 border-r-2 border-slate-100 hidden lg:flex flex-col justify-center items-center">
          <div className="writing-vertical-rl rotate-180 editorial-label opacity-20 text-4xl whitespace-nowrap -translate-x-1">STEP 01</div>
        </div>
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-2">
            <span className="editorial-label block text-slate-400">01 • Source Material</span>
            <h4 className="text-2xl font-serif font-bold italic">Draft Project Description</h4>
          </div>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-brand-indigo opacity-0 group-focus-within:opacity-10 transition-opacity rounded-sm"></div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Input raw technical contributions (e.g., 'Implemented SPI communication between two FPGAs')."
              className="relative w-full h-64 bg-white border-2 border-brand-ink rounded-sm p-10 text-lg focus:outline-none focus:border-brand-indigo transition-all resize-none leading-relaxed font-serif italic"
            />
          </div>
          <button
            onClick={handleOptimize}
            disabled={isLoading || !input.trim()}
            className="editorial-btn w-full h-16 text-xs tracking-[0.3em]"
          >
            {isLoading ? 'EXECUTING ARCHITECTURAL SYNTHESIS...' : 'AUTHORIZE SYNTHESIS'}
          </button>
        </div>

        {/* Transition */}
        <div className="lg:col-span-1 flex items-center justify-center">
          <ArrowRight className="text-slate-200 w-12 h-12 hidden lg:block" />
          <div className="h-12 w-[1px] bg-slate-200 lg:hidden font-bold"></div>
        </div>

        {/* Step 2: Output */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-2">
            <span className="editorial-label block text-slate-400">02 • Final Synthesis</span>
            <h4 className="text-2xl font-serif font-bold italic">Attested Resume String</h4>
          </div>
          <div className={`w-full min-h-[256px] p-12 relative flex flex-col justify-center border-2 transition-all ${output ? 'border-brand-indigo bg-indigo-50/20 shadow-xl shadow-brand-indigo/5' : 'border-dashed border-slate-200 bg-slate-50 opacity-50 grayscale'}`}>
            {output ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <blockquote className="text-2xl text-brand-ink leading-snug font-serif font-bold italic pr-12">
                  "{output}"
                </blockquote>
                <div className="flex items-center gap-8">
                  <button 
                    onClick={() => copyToClipboard(output)}
                    className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-indigo hover:text-brand-ink transition-colors"
                  >
                    {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    <span className="border-b border-brand-indigo/30 pb-1">{copied ? 'Attested' : 'Extract technical string'}</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-slate-300 space-y-6">
                <BrainCircuit size={64} className="mx-auto opacity-20" />
                <p className="editorial-label opacity-40">Synthetic Engine Idle</p>
              </div>
            )}
          </div>
          
          <div className="p-8 border-t-2 border-slate-100 flex items-start gap-6 bg-slate-50/50">
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
               <History size={16} />
            </div>
            <div>
              <h5 className="editorial-label text-slate-900 mb-2">Style Guide Compliance</h5>
              <p className="text-xs text-slate-500 font-serif leading-relaxed italic">
                Our synthesis follows the 2026 Industry Standard: Focus on metric-driven results, CMOS architectures, and verified ECE protocols.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
