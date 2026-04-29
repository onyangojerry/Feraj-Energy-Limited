import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Save,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { createAuditLog } from '@/services/audit.service';
import { motion } from 'motion/react';

export function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    company_name: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        company_name: profile.company_name || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sensitiveBefore = {
        phone: profile?.phone || '',
        company_name: profile?.company_name || '',
      };
      const sensitiveAfter = {
        phone: formData.phone,
        company_name: formData.company_name,
      };
      const sensitiveChanged =
        sensitiveBefore.phone !== sensitiveAfter.phone ||
        sensitiveBefore.company_name !== sensitiveAfter.company_name;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          company_name: formData.company_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      await refreshProfile();

      if (sensitiveChanged && user?.id) {
        await createAuditLog({
          actor_user_id: user.id,
          target_user_id: user.id,
          action: 'profile.update',
          metadata: {
            before: sensitiveBefore,
            after: sensitiveAfter,
          },
        });
      }

      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'border border-purple-500/35 bg-purple-500/10 text-purple-300';
      case 'co_admin':
        return 'border border-indigo-500/35 bg-indigo-500/10 text-indigo-300';
      case 'employee':
        return 'border border-sky-500/35 bg-sky-500/10 text-sky-300';
      default:
        return 'border border-primary/35 bg-primary/10 text-primary';
    }
  };

  const fieldClassName =
    'w-full rounded-md border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white/88 placeholder:text-white/45 focus:ring-2 focus:ring-primary/35 focus:border-primary/30 disabled:bg-white/10 disabled:text-white/55';

  if (!profile) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto w-full max-w-[var(--section-max-width)] px-4 sm:px-6 lg:px-8">
          {/* Loading / Missing Profile State */}
          <div className="cinematic-panel p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-48 rounded bg-white/10" />
              <div className="h-4 w-80 rounded bg-white/10" />
              <div className="h-24 w-full rounded-lg bg-white/10" />
              <div className="h-4 w-64 rounded bg-white/10" />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => refreshProfile()}
                className="rounded-md border border-primary/35 bg-primary/90 px-4 py-2 text-primary-foreground transition hover:bg-primary"
                disabled={!user}
              >
                Retry
              </button>
              <a href="/" className="px-4 py-2 rounded-md btn-secondary">
                Back to Home
              </a>
            </div>
            <p className="mt-4 text-xs text-white/50">
              If this persists, ensure the Supabase profile trigger exists or
              backfill the profile record for your user.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 lg:py-14">
      <div className="mx-auto w-full max-w-[var(--section-max-width)] px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(12,14,20,0.95),rgba(9,11,16,0.84))] p-8 sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(73,201,255,0.16),transparent_35%),radial-gradient(circle_at_84%_78%,rgba(49,209,122,0.14),transparent_42%)]" />
          <div className="relative">
            <p className="cinematic-eyebrow">Account Chapter • Profile</p>
            <h1 className="mt-3 text-4xl font-semibold text-white/90 sm:text-5xl">
              My Profile
            </h1>
            <p className="mt-3 text-white/60">
              Manage your account information and preferences
            </p>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="cinematic-panel-strong overflow-hidden">
              <div className="bg-[linear-gradient(120deg,rgba(49,209,122,0.2),rgba(73,201,255,0.16))] px-6 py-7">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-white/10">
                    <User className="h-8 w-8 text-white/85" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white/90">
                      {profile.full_name || 'User'}
                    </p>
                    <p className="text-sm text-white/65">{profile.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                      profile.role
                    )}`}
                  >
                    <Shield className="h-3 w-3" />
                    {profile.role
                      .replace('_', ' ')
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </span>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <h3 className="mb-3 text-xs uppercase tracking-[0.14em] text-white/45">
                    Account Information
                  </h3>
                  <div className="space-y-2 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>
                        Member since{' '}
                        {new Date(profile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Profile Form */}
          <motion.div
            className="cinematic-panel p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    disabled={!editing || loading}
                    className={fieldClassName}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full rounded-md border border-white/10 bg-white/10 py-2 pl-10 pr-4 text-white/58"
                  />
                </div>
                <p className="mt-1 text-xs text-white/50">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={!editing || loading}
                    className={fieldClassName}
                    placeholder="+254 XXX XXXXXX"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Company Name (Optional)
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData({ ...formData, company_name: e.target.value })
                    }
                    disabled={!editing || loading}
                    className={fieldClassName}
                    placeholder="Your Company Ltd"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="rounded-md border border-primary/35 bg-primary/90 px-6 py-2 font-medium text-primary-foreground transition hover:bg-primary"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 rounded-md border border-primary/35 bg-primary/90 px-6 py-2 font-medium text-primary-foreground transition hover:bg-primary disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          full_name: profile.full_name || '',
                          phone: profile.phone || '',
                          company_name: profile.company_name || '',
                        });
                      }}
                      disabled={loading}
                      className="px-6 py-2 rounded-md btn-secondary disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
