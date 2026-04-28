import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, LogIn, Github, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { loginWithEmail, signupWithEmail, signInWithGoogle, logout } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isSignup) {
        await signupWithEmail(email, password, name);
        onClose();
      } else {
        await loginWithEmail(email, password);
        onClose();
      }
    } catch (err: any) {
      console.error('Auth Error:', err.code);
      if (err.code === 'auth/invalid-credential') {
        setError('Incorrect email or password. If you seeking first entry, please Create Profile.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already associated with a dossier. Please Sign In.');
      } else if (err.code === 'auth/weak-password') {
        setError('Security risk: Access key must be at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white border-2 border-brand-ink p-10 editorial-card shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-400 hover:text-brand-ink transition-colors"
            >
              <X size={20} />
            </button>

            {verificationEmail ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-brand-indigo/10 text-brand-indigo rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail size={32} />
                </div>
                <h3 className="text-2xl editorial-heading mb-4 text-brand-ink italic">Verify Identity</h3>
                <p className="text-sm font-serif italic text-slate-500 mb-8 leading-relaxed">
                  We have sent you a verification email to <span className="font-bold text-brand-ink not-italic">{verificationEmail}</span>. Please verify it and log in.
                </p>
                <button
                  onClick={() => {
                    setVerificationEmail(null);
                    setIsSignup(false);
                    setError('');
                  }}
                  className="editorial-btn w-full py-4 text-xs tracking-[0.2em]"
                >
                  Login
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <span className="editorial-label text-brand-indigo mb-2 block">Dossier Access</span>
                  <h2 className="text-4xl editorial-heading">
                    {isSignup ? 'Create Account' : 'Secure Entry'}
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {isSignup && (
                    <div className="space-y-1">
                      <label className="editorial-label text-[10px] opacity-60">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-indigo transition-all font-serif italic"
                          placeholder="e.g. Aratika Lagate"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="editorial-label text-[10px] opacity-60">Corporate/Academic Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-indigo transition-all font-serif italic"
                        placeholder="student@siliconhub.in"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="editorial-label text-[10px] opacity-60">Private Access Key</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-indigo transition-all font-serif italic"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider text-center">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="editorial-btn w-full py-4 text-xs tracking-[0.2em]"
                  >
                    {loading ? 'Processing...' : isSignup ? 'Establish Profile' : 'Authorize Entry'}
                  </button>
                </form>

                <div className="mt-8">
                  <div className="relative flex items-center justify-center mb-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-100"></div>
                    </div>
                    <span className="relative px-4 bg-white editorial-label text-[9px] opacity-40">Or Federated ID</span>
                  </div>

                  <button
                    onClick={handleGoogle}
                    disabled={loading}
                    className="w-full py-4 border-2 border-slate-100 rounded-sm flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest hover:border-brand-ink transition-all"
                  >
                    <LogIn size={16} /> Continue with Google
                  </button>
                </div>

                <p className="mt-10 text-center editorial-label text-[10px] opacity-60">
                  {isSignup ? 'Already registered?' : 'Seeking first entry?'}
                  <button
                    onClick={() => setIsSignup(!isSignup)}
                    className="ml-2 text-brand-indigo hover:text-brand-ink font-bold transition-colors"
                  >
                    {isSignup ? 'Sign In' : 'Create Profile'}
                  </button>
                </p>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
