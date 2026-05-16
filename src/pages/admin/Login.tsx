import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isResetMode) {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/admin/reset-password',
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Password reset link sent to your email!');
        setIsResetMode(false);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success('Welcome to AI Metaworld Admin');
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#ceab7a]/5 via-[#050505] to-[#050505] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <img src="/Assets/logo.webp" alt="AI Metaworld" className="w-12 h-12 object-contain mx-auto mb-6" />
          <h1 className="text-3xl font-serif text-white tracking-tight mb-2">
            {isResetMode ? 'Reset Password' : 'Agency Access'}
          </h1>
          <p className="text-gray-400 text-sm">
            {isResetMode ? 'Enter your email to receive a reset link.' : 'Secure login to the AI Metaworld platform.'}
          </p>
        </div>

        <div className="bg-[#101010] border border-white/5 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#ceab7a]/30 to-transparent" />
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-gray-400 font-medium ml-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50 transition-colors"
                placeholder="aimetaworldd@gmail.com"
                required
              />
            </div>
            
            {!isResetMode && (
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs uppercase tracking-widest text-gray-400 font-medium">Password</label>
                  <button 
                    type="button" 
                    onClick={() => setIsResetMode(true)}
                    className="text-xs text-[#ceab7a] hover:text-white transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ceab7a]/50 transition-colors pr-10"
                    placeholder="••••••••"
                    required={!isResetMode}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#ceab7a] text-black font-bold text-sm py-4 rounded-xl uppercase tracking-widest hover:bg-white transition-all duration-300 disabled:opacity-50 flex justify-center items-center h-[52px]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : isResetMode ? (
                'Send Reset Link'
              ) : (
                'Authenticate'
              )}
            </button>

            {isResetMode && (
              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsResetMode(false)}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Back to Login
                </button>
              </div>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}
