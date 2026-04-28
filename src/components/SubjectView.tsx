import { useState } from 'react';
import { BookOpen, Cpu, Layers, Activity } from 'lucide-react';
import { SUBJECT_MODULES } from '../constants';
import { SubjectModule } from '../types';
import { motion } from 'motion/react';

const icons: Record<string, any> = {
  Cpu,
  Layers,
  Activity
};

export default function SubjectView() {
  const [selectedModule, setSelectedModule] = useState<SubjectModule | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-1 border-t-2 border-brand-ink pt-6 space-y-2">
        {SUBJECT_MODULES.map((module) => {
          const Icon = icons[module.icon];
          return (
            <button
              key={module.id}
              onClick={() => setSelectedModule(module)}
              className={`w-full text-left p-6 transition-all flex items-center gap-6 border-b border-slate-100 group ${
                selectedModule?.id === module.id ? 'bg-indigo-50 border-l-4 border-l-brand-indigo' : 'hover:bg-slate-50'
              }`}
            >
              <div className={`shrink-0 ${selectedModule?.id === module.id ? 'text-brand-indigo font-bold' : 'text-slate-300'}`}>
                <Icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="editorial-label opacity-40 mb-1">{module.type}</p>
                <h3 className="font-serif font-bold text-lg italic tracking-tight truncate leading-tight">{module.topic}</h3>
              </div>
            </button>
          );
        })}
      </div>

      <div className="lg:col-span-2">
        {selectedModule ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="editorial-card p-12 border-2 border-brand-ink"
          >
            <div className="mb-10 text-center border-b border-slate-100 pb-10">
              <div className="editorial-label text-brand-indigo mb-4 block">{selectedModule.type} MODULE • VOL 01</div>
              <h2 className="text-5xl font-serif font-black mb-4 tracking-tighter">{selectedModule.topic}</h2>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Comprehensive Technical Guide
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="font-serif text-xl leading-relaxed text-slate-700 italic border-l-4 border-brand-indigo pl-8 py-2">
                {selectedModule.content}
              </div>
              
              <div className="bg-slate-50 p-8 rounded-sm border border-slate-200">
                <h4 className="editorial-label mb-4 text-brand-indigo">Conceptual Synthesis</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  Mastering this topic is essential for {selectedModule.type} and frequently asked in GATE exams. 
                  Focus on the {selectedModule.type === 'VLSI' ? 'leakage currents and switching speeds' : selectedModule.type === 'DEMP' ? 'state transitions and timing diagrams' : 'frequency domain transforms'} to maximize performance.
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 flex gap-4">
              <button className="editorial-btn">Download Report</button>
              <button className="editorial-btn-outline">Practice Lab</button>
            </div>
          </motion.div>
        ) : (
          <div className="editorial-card p-12 h-full flex flex-col items-center justify-center text-center border-dashed border-2">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-6 text-slate-200 border-2 border-slate-100">
              <BookOpen size={30} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">Subject Selection</h3>
            <p className="text-slate-400 max-w-xs text-sm italic font-serif">
              Select a core module from the archive to begin your deep-dive synthesis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
