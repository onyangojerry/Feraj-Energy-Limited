import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  Cpu,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Home,
  Handshake,
  FileText,
  Mail,
  Briefcase,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function AdminLayout() {
  const { profile, permissions, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = profile?.role === 'admin';
  const isCoAdmin = profile?.role === 'co_admin';
  const isEmployee = profile?.role === 'employee';

  const canManageProducts =
    isAdmin || isCoAdmin || (isEmployee && permissions?.can_manage_products);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, visible: true },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      visible: isAdmin || isCoAdmin,
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      visible: canManageProducts,
    },
    {
      name: 'Devices',
      href: '/admin/devices',
      icon: Cpu,
      visible: isAdmin || isCoAdmin,
    },
    { name: 'Audit', href: '/admin/audit', icon: ShoppingBag, visible: true },
    {
      name: 'Partnership Requests',
      href: '/admin/partnership-requests',
      icon: Handshake,
      visible: true,
    },
    {
      name: 'Legal Documents',
      href: '/admin/legal-documents',
      icon: FileText,
      visible: true,
    },
    {
      name: 'Newsletters',
      href: '/admin/newsletters',
      icon: Mail,
      visible: true,
    },
    {
      name: 'Job Postings',
      href: '/admin/job-postings',
      icon: Briefcase,
      visible: true,
    },
  ].filter((item) => item.visible);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(49,209,122,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(73,201,255,0.08),transparent_30%),linear-gradient(180deg,#08090c_0%,#0b0d12_100%)] text-white/86">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-white/10 bg-[linear-gradient(180deg,rgba(10,12,18,0.98),rgba(6,8,12,0.96))] shadow-2xl shadow-black/30 backdrop-blur-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
            <Link to="/admin" className="flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-white/92">
                Control Room
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/55 hover:text-white/90"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== '/admin' &&
                  location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'border border-primary/20 bg-white/8 text-white font-medium shadow-[0_0_0_1px_rgba(49,209,122,0.16)]'
                      : 'text-white/66 hover:bg-white/5 hover:text-white/92'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info & actions */}
          <div className="border-t border-white/10 px-4 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-white/8 flex items-center justify-center ring-1 ring-white/10">
                <span className="text-primary font-semibold">
                  {profile?.full_name?.charAt(0) ||
                    profile?.email?.charAt(0) ||
                    'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90 truncate">
                  {profile?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-white/50 truncate">
                  {profile?.email}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                to="/"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white/92"
              >
                <Home className="h-4 w-4" />
                <span>Back to Site</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 border-b border-white/10 bg-[rgba(7,9,13,0.78)] backdrop-blur-xl">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/60 hover:text-white/90"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-2 lg:hidden">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-white/92">
                Control Room
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-white/6 px-3 py-1 text-xs font-medium text-primary">
                {profile?.role ? profile.role.replace('_', ' ') : 'Staff'}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
