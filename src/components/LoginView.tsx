import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Key, User, Hash, RefreshCw, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export default function LoginView({ t, onLogin }: { t: any, onLogin: (user: any) => void }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLogin({
        id: user.uid,
        name: user.displayName || 'User',
        email: user.email,
        photo: user.photoURL,
        phone: user.phoneNumber || '+91 98765 43210',
        address: 'Heritage Street, Channapatna, Karnataka'
      });
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (/\d/.test(password)) {
      setPasswordError(t.passwordNoDigits || 'Password cannot contain digits.');
      return;
    }
    if (userId.length === 6 && password && !passwordError) {
      onLogin({
        id: userId,
        name: 'Arjun Sharma',
        phone: '+91 98765 43210',
        address: '124, Heritage Street, Bengaluru, Karnataka 560001'
      });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (/\d/.test(val)) {
      setPasswordError(t.passwordNoDigits || 'Password cannot contain digits.');
    } else {
      setPasswordError('');
    }
  };
  
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewPassword(val);
    if (/\d/.test(val)) {
      setResetPasswordError(t.passwordNoDigits || 'Password cannot contain digits.');
    } else {
      setResetPasswordError('');
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (/\d/.test(newPassword)) {
      setResetPasswordError(t.passwordNoDigits || 'Password cannot contain digits.');
      return;
    }
    if (userId.length === 6 && newPassword && !resetPasswordError) {
      setResetSuccess(true);
      setTimeout(() => {
        setIsForgotPassword(false);
        setResetSuccess(false);
        setPassword('');
        setNewPassword('');
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-toy-wood-bg p-6 pt-12 relative overflow-x-hidden pb-24">
      
      {/* Decorative blobs */}
      <div className="absolute top-10 left-[-20px] w-32 h-32 bg-toy-yellow rounded-full opacity-30 blur-2xl z-0"></div>
      <div className="absolute bottom-20 right-[-30px] w-40 h-40 bg-toy-orange rounded-full opacity-30 blur-2xl z-0"></div>
      
      <AnimatePresence mode="wait">
        {!isForgotPassword ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-8 border-4 border-toy-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] relative z-10 w-full mb-8 pt-10 mt-8"
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-toy-wood-bg p-4 border-4 border-toy-black rounded-full shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] text-toy-brown">
              <User size={32} />
            </div>
            
            <h2 className="text-3xl font-black text-toy-black mb-2 mt-4 text-center">
              {t.loginTitle}
            </h2>
            <p className="text-toy-brown font-black text-center mb-8 leading-tight">
              {t.loginSubtitle}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-toy-orange">
                  <Hash size={20} />
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={userId}
                  onChange={(e) => setUserId(e.target.value.replace(/\D/g, ''))}
                  placeholder={t.idPlaceholder}
                  className="w-full bg-toy-wood-bg border-4 border-toy-brown/10 focus:border-toy-black rounded-2xl pl-12 pr-4 py-3 font-black text-toy-black placeholder:text-toy-brown/30 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all"
                  required
                />
              </div>

              <div className="relative">
                 <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-toy-orange">
                  <Key size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder={t.passwordPlaceholder}
                  className="w-full bg-toy-wood-bg border-4 border-toy-brown/10 focus:border-toy-black rounded-2xl pl-12 pr-4 py-3 font-black text-toy-black placeholder:text-toy-brown/30 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all"
                  required
                />
              </div>
              {passwordError && (
                <p className="text-toy-red font-black text-sm mt-[-10px] ml-2">{passwordError}</p>
              )}
              
              <div className="text-right">
                <button type="button" className="font-black text-toy-brown hover:text-toy-black text-sm" onClick={() => setIsForgotPassword(true)}>
                  {t.forgotPass}
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-toy-yellow text-toy-brown font-black text-lg py-4 rounded-2xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-toy-orange hover:text-white active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all flex justify-center items-center gap-2 mt-2"
              >
                <LogIn size={24} />
                {t.loginBtn}
              </button>

              <div className="flex items-center gap-4 my-2">
                <div className="flex-1 h-1 bg-toy-brown/10"></div>
                <span className="text-[10px] font-black uppercase text-toy-brown/40">OR</span>
                <div className="flex-1 h-1 bg-toy-brown/10"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white text-toy-black font-black text-lg py-4 rounded-2xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-gray-50 active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all flex justify-center items-center gap-3"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
                {isLoading ? 'Signing in...' : 'Sign in with Google'}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="forgot"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-8 border-4 border-toy-black shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] relative z-10 w-full mb-8 pt-10 mt-8"
          >
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-toy-yellow p-4 border-4 border-toy-black rounded-full shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] text-toy-brown">
              <RefreshCw size={32} />
            </div>
            
            <h2 className="text-3xl font-black text-toy-black mb-2 mt-4 text-center">
              {t.resetTitle}
            </h2>
            <p className="text-toy-brown font-black text-center mb-8 leading-tight">
              {t.resetSubtitle}
            </p>

            {resetSuccess ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-toy-green/10 border-2 border-toy-green rounded-2xl p-4 flex flex-col items-center justify-center gap-2 mb-4"
              >
                <CheckCircle2 className="text-toy-green" size={32} />
                <p className="text-toy-green font-black text-center">{t.resetSuccess}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleReset} className="flex flex-col gap-5">
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-toy-orange">
                    <Hash size={20} />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={userId}
                    onChange={(e) => setUserId(e.target.value.replace(/\D/g, ''))}
                    placeholder={t.idPlaceholder}
                    className="w-full bg-toy-wood-bg border-4 border-toy-brown/10 focus:border-toy-black rounded-2xl pl-12 pr-4 py-3 font-black text-toy-black placeholder:text-toy-brown/30 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all"
                    required
                  />
                </div>

                <div className="relative">
                   <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-toy-orange">
                    <Key size={20} />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    placeholder={t.newPasswordPlaceholder}
                    className="w-full bg-toy-wood-bg border-4 border-toy-brown/10 focus:border-toy-black rounded-2xl pl-12 pr-4 py-3 font-black text-toy-black placeholder:text-toy-brown/30 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] transition-all"
                    required
                  />
                </div>
                {resetPasswordError && (
                  <p className="text-toy-red font-black text-sm mt-[-10px] ml-2">{resetPasswordError}</p>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-toy-black text-white font-black text-lg py-4 rounded-2xl border-4 border-toy-black shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] hover:bg-toy-brown active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(26,26,26,1)] transition-all flex justify-center items-center gap-2 mt-2"
                >
                  <RefreshCw size={24} />
                  {t.resetBtn}
                </button>
              </form>
            )}

            <div className="text-center mt-6">
              <button 
                type="button" 
                className="font-black text-toy-brown hover:text-toy-black text-sm flex items-center justify-center gap-1 mx-auto" 
                onClick={() => setIsForgotPassword(false)}
              >
                <ArrowLeft size={16} /> {t.backToLogin}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isForgotPassword && (
        <div className="text-center relative z-10 pb-6">
          <button 
            onClick={() => onLogin({ name: 'Guest User', phone: 'N/A', address: 'N/A' })} 
            className="font-black text-toy-brown hover:text-toy-black transition-colors uppercase tracking-wider text-xs border-b-2 border-transparent hover:border-toy-black mb-8"
          >
            {t.skipLogin}
          </button>
        </div>
      )}
    </div>
  );
}
