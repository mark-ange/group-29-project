import React, { useState } from 'react';
import { X, Eye, EyeOff, Box, Layers, Compass, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('alex.montgomery@luxestay.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        onSuccess?.();
        onClose();
      }, 900);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-neutral-100 grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Half: Dusk Luxury Villa & Glass Floating Card (Matches Image 2) */}
        <div className="hidden md:block md:col-span-6 relative overflow-hidden bg-neutral-900">
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=85"
            alt="Malibu Sunset Villa"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Floating Left Control Icons (Matches Image 2) */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
              <Box className="w-4 h-4" />
            </div>
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
              <Eye className="w-4 h-4" />
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#BA0934] flex items-center justify-center text-white shadow-md">
              <Layers className="w-4 h-4" />
            </div>
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
          </div>

          {/* Bottom Floating Glass Panel (Matches Image 2) */}
          <div className="absolute bottom-6 left-6 right-6 z-10 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#BA0934] text-white flex items-center justify-center shrink-0 shadow-md">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900">3D Virtual Tours Included</h4>
              <p className="text-[11px] text-neutral-500 leading-snug">
                Immerse yourself in our premium properties before you book.
              </p>
            </div>
          </div>
        </div>

        {/* Right Half: Form (Matches Image 2) */}
        <div className="md:col-span-6 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Brand Logo */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-7 h-7 rounded-lg bg-[#BA0934] text-white flex items-center justify-center">
                <Box className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-neutral-900">
                Luxe<span className="text-[#BA0934]">Stay</span>
              </span>
            </div>

            {/* Tabs (Matches Image 2) */}
            <div className="flex items-center gap-6 border-b border-neutral-200 mb-6">
              <button
                onClick={() => setMode('signin')}
                className={`pb-2 text-sm font-bold transition-all relative ${
                  mode === 'signin' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                Sign In
                {mode === 'signin' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#BA0934] rounded-full" />
                )}
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`pb-2 text-sm font-bold transition-all relative ${
                  mode === 'signup' ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                Create Account
                {mode === 'signup' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#BA0934] rounded-full" />
                )}
              </button>
            </div>

            {/* Heading */}
            <div className="space-y-1 mb-6">
              <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                {mode === 'signin' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-xs text-neutral-500">
                {mode === 'signin'
                  ? 'Enter your credentials to access your account.'
                  : 'Join LuxeStay to access private architectural walkthroughs.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-900 focus:outline-hidden focus:border-[#BA0934] focus:bg-white transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-neutral-700">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      className="text-xs font-medium text-[#BA0934] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs text-neutral-900 focus:outline-hidden focus:border-[#BA0934] focus:bg-white transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Cherry Red Sign In Button (Matches Image 2) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#BA0934] hover:bg-[#a00829] text-white text-xs font-bold shadow-md shadow-[#BA0934]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : successNotice ? (
                  <span className="flex items-center gap-1.5 text-white">
                    <CheckCircle2 className="w-4 h-4" /> Signed In
                  </span>
                ) : mode === 'signin' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>

              {/* SSO Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-[11px] text-neutral-400 uppercase">
                  <span className="bg-white px-2">Or continue with</span>
                </div>
              </div>

              {/* SSO Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
                  className="py-2.5 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
                  className="py-2.5 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.62-.75 1.04-1.8 0.93-2.84-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1 .08 2.02-.5 2.64-1.25z" />
                  </svg>
                  <span>Apple</span>
                </button>
              </div>
            </form>
          </div>

          {/* Footer links */}
          <div className="pt-6 flex justify-center gap-6 text-[11px] text-neutral-400">
            <a href="#help" className="hover:underline">Help</a>
            <a href="#privacy" className="hover:underline">Privacy</a>
            <a href="#terms" className="hover:underline">Terms</a>
          </div>
        </div>
      </div>
    </div>
  );
};
