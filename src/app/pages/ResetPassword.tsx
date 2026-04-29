import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AuthService } from '@/services/auth.service';
import { updatePasswordSchema } from '@/utils/validation';
import type { ZodError } from 'zod';
import { motion } from 'motion/react';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const fieldClassName =
    'w-full rounded-md border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white/88 placeholder:text-white/45 focus:ring-2 focus:ring-primary/35 focus:border-primary/30 disabled:bg-white/10 disabled:text-white/50';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      updatePasswordSchema.parse({ password, confirmPassword });

      // Update password
      const { error } = await AuthService.updatePassword(password);

      if (error) {
        toast.error(error.message);
        return;
      }

      setSuccess(true);
      toast.success('Password updated successfully!');

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      if (error.errors) {
        // Zod validation error
        const zodError = error as ZodError;
        const firstError = zodError.errors[0];
        toast.error(firstError.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-screen overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(73,201,255,0.2),transparent_35%),radial-gradient(circle_at_84%_82%,rgba(49,209,122,0.16),transparent_42%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,12,0.66)_0%,rgba(8,8,12,0.9)_100%)]" />
        <div className="relative flex min-h-[calc(100vh-6rem)] items-center justify-center">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.2, 0.65, 0.2, 1] }}
          >
            <div className="cinematic-panel-strong p-8 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-primary" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold text-white/90">
                Password Reset Successful
              </h2>
              <p className="mb-6 text-white/60">
                Your password has been updated. Redirecting to login...
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(73,201,255,0.2),transparent_35%),radial-gradient(circle_at_84%_82%,rgba(49,209,122,0.16),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,12,0.66)_0%,rgba(8,8,12,0.9)_100%)]" />
      <div className="relative flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
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

            <h2 className="mb-6 text-center text-2xl font-semibold text-white/90">
              Set New Password
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  New Password
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
                <p className="mt-2 text-xs text-white/52">
                  Must be at least 8 characters with uppercase, lowercase,
                  number, and special character
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    className={fieldClassName}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md border border-primary/35 bg-primary/90 py-3 font-semibold text-primary-foreground transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Updating password...
                  </span>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
