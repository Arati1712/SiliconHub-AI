import { useState } from 'react';
import { generateQuiz } from '../services/geminiService';
import { BrainCircuit, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { QuizQuestion, SubjectType } from '../types';

export default function QuizSection() {
  const { user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [showLogic, setShowLogic] = useState(false);

  const startQuiz = async (subject: SubjectType) => {
    setSelectedSubject(subject);
    setQuestionText('');
    setUserAnswer(null);
    setShowLogic(false);
    setIsLoading(true);
    
    try {
      const q = await generateQuiz(subject);
      if (!q) {
        throw new Error("Empty response from AI");
      }
      setQuestionText(q);
    } catch (error: any) {
      console.error("Quiz Start Error:", error);
      setQuestionText(`Error: ${error.message || "Synthesis failure"}. Please check your connection or try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const parseQuiz = (text: string) => {
    const lines = text.split('\n');
    let question = '';
    let options: Record<string, string> = { A: '', B: '', C: '', D: '' };
    let answer = '';
    let logic = '';

    lines.forEach(line => {
      const trimmedLine = line.trim().replace(/^[\*\-\s]+/, ''); // Remove markdown bullets
      const lower = trimmedLine.toLowerCase();
      
      if (lower.includes('question:')) {
        question = trimmedLine.split(/question:/i)[1]?.trim() || trimmedLine;
      } else if (trimmedLine.match(/^[A-D][\)\.]/)) {
        const key = trimmedLine.charAt(0).toUpperCase();
        options[key] = trimmedLine.replace(/^[A-D][\)\.]\s*/, '').trim();
      } else if (lower.includes('correct answer:')) {
        const parts = trimmedLine.split(/correct answer:/i);
        const value = (parts[1] || '').trim();
        const match = value.match(/[A-D]/i);
        answer = match ? match[0].toUpperCase() : '';
      } else if (lower.includes('logic:')) {
        logic = trimmedLine.split(/logic:/i)[1]?.trim() || '';
      }
    });

    // Fallback: If AI is lazy and doesn't use Question: prefix
    if (!question && lines.length > 0) {
      // Find the first line that isn't an option or logic
      const firstNonMeta = lines.find(l => 
        !l.trim().match(/^[A-D][\)\.]/) && 
        !l.toLowerCase().includes('correct answer:') && 
        !l.toLowerCase().includes('logic:')
      );
      question = firstNonMeta?.trim() || lines[0].trim();
    }

    return { question, options, answer, logic };
  };

  const quiz = parseQuiz(questionText);

  const checkAnswer = async (opt: string) => {
    if (userAnswer) return;
    setUserAnswer(opt);
    setShowLogic(true);

    if (user && selectedSubject) {
      const path = `users/${user.uid}/quiz_results`;
      try {
        await addDoc(collection(db, path), {
          subject: selectedSubject,
          question: quiz.question,
          userAnswer: opt,
          correctAnswer: quiz.answer,
          isCorrect: opt === quiz.answer,
          timestamp: serverTimestamp()
        });
      } catch (dbError) {
        handleFirestoreError(dbError, OperationType.WRITE, path);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center py-10 border-b-2 border-brand-ink">
        <span className="editorial-label text-brand-indigo mb-4 block">Assessment Center</span>
        <h2 className="text-6xl editorial-heading mb-6 tracking-tighter">GATE <span className="italic font-normal">Expert</span> MCQs</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {(['DEMP', 'VLSI', 'SS'] as SubjectType[]).map((subj) => (
            <button
              key={subj}
              onClick={() => startQuiz(subj)}
              className={`px-8 py-3 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all border-2 ${
                selectedSubject === subj ? 'bg-brand-ink text-white border-brand-ink' : 'border-slate-200 hover:border-brand-ink'
              }`}
            >
              {subj} Practice
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Loader2 className="w-12 h-12 text-brand-indigo animate-spin mb-6" />
            <p className="editorial-label animate-pulse">Archival Query In Progress...</p>
          </motion.div>
        ) : questionText ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="editorial-card p-12 border-2 border-brand-ink relative"
          >
            {questionText.startsWith("Error:") ? (
              <div className="text-center py-10">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h3 className="text-2xl font-serif font-black mb-6 italic">{questionText}</h3>
                <button 
                  onClick={() => startQuiz(selectedSubject!)}
                  className="editorial-btn px-10"
                >
                  Retry Synthesis
                </button>
              </div>
            ) : (
              <>
                <div className="absolute top-0 right-12 translate-y-[-50%] bg-brand-indigo text-white px-6 py-2 editorial-label">
                  1 Mark MCQ
                </div>
                
                <div className="mb-10">
                  <span className="editorial-label opacity-40 mb-4 block">Question Synthesis</span>
                  <h3 className="text-2xl font-serif font-black leading-snug italic">{quiz.question}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['A', 'B', 'C', 'D'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => checkAnswer(opt)}
                      className={`text-left p-6 transition-all border-2 rounded-sm group ${
                        userAnswer 
                          ? opt === quiz.answer
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900' 
                            : userAnswer === opt 
                              ? 'bg-red-50 border-red-500 text-red-900' 
                              : 'border-slate-100 opacity-50'
                          : 'border-slate-100 hover:border-brand-indigo bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 flex items-center justify-center font-bold text-xs rounded-sm border ${
                          userAnswer ? opt === quiz.answer ? 'bg-emerald-500 border-emerald-500 text-white' : userAnswer === opt ? 'bg-red-500 border-red-500 text-white' : 'border-slate-200' : 'border-slate-200'
                        }`}>
                          {opt}
                        </span>
                        <span className="font-serif italic font-bold text-lg">{quiz.options[opt]}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {showLogic && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`mt-12 p-8 border-t-2 border-brand-ink ${
                      userAnswer === quiz.answer ? 'bg-emerald-50' : 'bg-red-50'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${userAnswer === quiz.answer ? 'bg-emerald-500' : 'bg-red-500'} text-white shadow-md`}>
                        {userAnswer === quiz.answer ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                      </div>
                      <div>
                        <h4 className={`editorial-label ${userAnswer === quiz.answer ? 'text-emerald-700' : 'text-red-700'}`}>
                          {userAnswer === quiz.answer ? 'Excellent Synthesis!' : 'Conceptual Mismatch Found'}
                        </h4>
                        <div className="flex flex-col">
                          <p className={`text-xs font-bold uppercase ${userAnswer === quiz.answer ? 'text-emerald-600' : 'text-red-400'}`}>
                            {userAnswer === quiz.answer ? 'Your selection is accurate' : `You selected Option ${userAnswer}`}
                          </p>
                          {userAnswer !== quiz.answer && (
                            <p className="text-sm font-black text-emerald-600 uppercase mt-1">
                              Correct Answer: ({quiz.answer})
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white p-4 border-l-4 border-brand-indigo rounded-r-sm">
                        <span className="editorial-label text-[10px] text-slate-400 mb-2 block uppercase">Detailed GATE Analysis</span>
                        <p className="text-lg font-serif italic leading-relaxed text-slate-700">
                          {quiz.logic}
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-200">
                        <button 
                          onClick={() => startQuiz(selectedSubject!)}
                          className={`editorial-btn w-full py-4 text-sm transition-all ${
                            userAnswer === quiz.answer 
                              ? 'bg-brand-indigo hover:bg-brand-indigo/90' 
                              : 'bg-red-600 hover:bg-red-700 text-white'
                          }`}
                        >
                          {userAnswer === quiz.answer ? 'Next GATE Synthesis' : 'Acknowledge Error & Next Question'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        ) : (
          <div className="editorial-card p-16 h-64 flex flex-col items-center justify-center text-center border-dashed border-2">
            <span className="editorial-label opacity-40 mb-4 block">Vault Locked</span>
            <p className="italic font-serif text-slate-400 text-xl">Select a CORE SUBJECT above to generate a new MCQ synthesis.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
