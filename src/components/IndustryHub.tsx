import { INDUSTRY_UPDATES } from '../constants';
import { Newspaper, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function IndustryHub() {
  return (
    <div className="space-y-12">
      <div className="bg-slate-900 text-white p-16 rounded-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="editorial-label text-brand-indigo mb-6 block">Strategic Overview</span>
          <h2 className="text-6xl font-serif font-black mb-8 leading-tight tracking-tighter">India’s Semiconductor <span className="italic">Renaissance</span></h2>
          <p className="text-xl text-slate-400 font-serif italic leading-relaxed mb-10">
            "The 2026 landscape is defined by the India Semiconductor Mission 2.0. We are no longer just consumers of technology, but the architects of global silicon."
          </p>
          <div className="flex gap-4">
            <button className="editorial-btn">Download Policy Paper</button>
            <button className="px-6 py-3 border border-white/20 hover:bg-white/10 text-[10px] uppercase font-bold tracking-widest transition-all">View Hub Map</button>
          </div>
        </div>
        <div className="absolute right-[-100px] bottom-[-100px] opacity-10 pointer-events-none">
          <Globe size={500} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <h3 className="editorial-label mb-8 flex items-center gap-3">
            <Newspaper size={16} />
            Dispatch Archive
          </h3>
          <div className="space-y-12">
            {INDUSTRY_UPDATES.map((update, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group cursor-pointer border-b border-slate-100 pb-8 last:border-0"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="editorial-label opacity-40">{update.source}</span>
                  <span className="editorial-label opacity-40">{update.date}</span>
                </div>
                <h4 className="text-2xl font-serif font-bold group-hover:text-brand-indigo transition-colors mb-4 leading-tight">{update.title}</h4>
                <p className="text-slate-500 line-clamp-2 text-sm leading-relaxed font-sans">{update.summary}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <h3 className="editorial-label mb-8">Active Hubs</h3>
          <div className="space-y-6">
            <HubCard city="Hyderabad" company="NVIDIA, Qualcomm" status="Expanding" />
            <HubCard city="Bengaluru" company="Intel, AMD, TI" status="Mature" />
            <HubCard city="Noida" company="Samsung, Dixon" status="Rising" />
          </div>
          
          <div className="bg-brand-indigo text-white p-8 rounded-sm">
            <h4 className="editorial-label mb-4">Placement Focus</h4>
            <p className="text-sm italic font-serif leading-relaxed mb-6">
              Recruiters are prioritizing RTL Design and Verification skills for the Q3 2026 hiring cycle.
            </p>
            <button className="w-full py-3 bg-white text-brand-indigo text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all">Career Roadmap</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HubCard({ city, company, status }: { city: string, company: string, status: string }) {
  return (
    <div className="p-6 editorial-card hover:border-brand-indigo group">
      <div className="flex justify-between items-center mb-2">
        <h5 className="font-serif font-black text-xl tracking-tight">{city}</h5>
        <span className="text-[10px] font-bold uppercase py-1 px-2 bg-slate-50 text-slate-400 group-hover:bg-brand-indigo group-hover:text-white transition-all">{status}</span>
      </div>
      <p className="text-xs text-slate-500 font-sans">{company}</p>
    </div>
  );
}
