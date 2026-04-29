import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AuthService } from '@/services/auth.service';
import { registerSchema, loginSchema } from '@/utils/validation';
import { useAuth } from '@/contexts/AuthContext';
import type { ZodError } from 'zod';
import { motion } from 'motion/react';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user?.email_confirmed_at && profile) {
      if (['admin', 'co_admin', 'employee'].includes(profile.role)) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/products', { replace: true });
      }
    }
  }, [user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Validate login input
        loginSchema.parse({ email, password });

        // Sign in
        const { error } = await AuthService.signIn(email, password);

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else if (error.message.includes('Email not confirmed')) {
            toast.error('Please verify your email before logging in');
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success('Login successful!');
        navigate('/products');
      } else {
        // Validate signup input
        registerSchema.parse({ email, password, fullName });

        // Sign up
        const { error } = await AuthService.signUp(email, password, fullName);

        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('An account with this email already exists');
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success(
          'Account created! Please check your email to verify your account.'
        );
        setEmailSent(true);
        setIsLogin(true);
      }
    } catch (error: any) {
      if (error.errors) {
        // Zod validation error
        const zodError = error as ZodError;
        const firstError = zodError.issues[0];
        toast.error(firstError.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email) {
        toast.error('Please enter your email address');
        return;
      }

      const { error } = await AuthService.resetPassword(email);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Password reset email sent! Check your inbox.');
      setShowResetPassword(false);
      setEmailSent(true);
    } catch {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldClassName =
    'w-full rounded-md border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white/88 placeholder:text-white/45 focus:ring-2 focus:ring-primary/35 focus:border-primary/30 disabled:bg-white/10 disabled:text-white/50';

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(73,201,255,0.2),transparent_34%),radial-gradient(circle_at_84%_82%,rgba(49,209,122,0.16),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,12,0.66)_0%,rgba(8,8,12,0.9)_100%)]" />
      <div className="relative flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.2, 0.65, 0.2, 1] }}
        >
          <div className="cinematic-panel-strong p-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-3">
                <img
                  src="/images/logos/feraj-solar-logo.png"
                  alt="Feraj Solar Limited Logo"
                  className="h-16 w-16 object-contain"
                />
                <span className="text-2xl font-semibold tracking-tight text-white/90">
                  Feraj Solar Limited
                </span>
              </div>
            </div>

            {/* Email verification notice */}
            {emailSent && (
              <div className="mb-6 flex items-start gap-3 rounded-md border border-primary/30 bg-primary/10 p-4">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-primary/90">
                    Please check your email and click the verification link to
                    activate your account.
                  </p>
                </div>
              </div>
            )}

            {/* Reset Password Form */}
            {showResetPassword ? (
              <>
                <h2 className="mb-2 text-center text-2xl font-semibold text-white/90">
                  Reset Password
                </h2>
                <p className="mb-6 text-center text-sm text-white/60">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </p>
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/75">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className={fieldClassName}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md border border-primary/35 bg-primary/90 py-3 font-semibold text-primary-foreground transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowResetPassword(false)}
                    className="w-full text-sm font-semibold text-primary transition hover:text-primary/85"
                  >
                    Back to Login
                  </button>
                </form>
              </>
            ) : (
              <>
                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      setEmailSent(false);
                    }}
                    className={`flex-1 rounded-md border py-2 text-center font-semibold transition ${
                      isLogin
                        ? 'border-primary/35 bg-primary/90 text-primary-foreground'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setIsLogin(false);
                      setEmailSent(false);
                    }}
                    className={`flex-1 rounded-md border py-2 text-center font-semibold transition ${
                      !isLogin
                        ? 'border-primary/35 bg-primary/90 text-primary-foreground'
                        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/75">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required={!isLogin}
                          disabled={loading}
                          className={fieldClassName}
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/75">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        className={fieldClassName}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/75">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        className={fieldClassName}
                        placeholder="••••••••"
                      />
                    </div>
                    {!isLogin && (
                      <p className="mt-2 text-xs text-white/52">
                        Must be at least 8 characters with uppercase, lowercase,
                        number, and special character
                      </p>
                    )}
                  </div>

                  {isLogin && (
                    <div className="flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => setShowResetPassword(true)}
                        className="text-sm text-primary transition hover:text-primary/85"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-md border border-primary/35 bg-primary/90 py-3 font-semibold text-primary-foreground transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        {isLogin ? 'Signing in...' : 'Creating account...'}
                      </span>
                    ) : isLogin ? (
                      'Sign In'
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-white/58">
                  {isLogin
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setEmailSent(false);
                    }}
                    disabled={loading}
                    className="font-semibold text-primary transition hover:text-primary/85 disabled:opacity-50"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
