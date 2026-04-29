import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Lightbulb,
  TrendingUp,
  Users,
  Activity,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [cartCount, setCartCount] = useState(
    () => JSON.parse(localStorage.getItem('cart') || '[]').length
  );
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isStaff =
    profile?.role && ['admin', 'co_admin', 'employee'].includes(profile.role);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const refreshCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(Array.isArray(cart) ? cart.length : 0);
    };

    window.addEventListener('storage', refreshCartCount);
    window.addEventListener('cart:updated', refreshCartCount as EventListener);

    return () => {
      window.removeEventListener('storage', refreshCartCount);
      window.removeEventListener(
        'cart:updated',
        refreshCartCount as EventListener
      );
    };
  }, []);

  const handleSignOut = async () => {
    try {
      setIsOpen(false);
      await signOut();
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  const navLinkClass = (path: string) =>
    `relative text-sm font-medium transition-all duration-300 group ${
      location.pathname === path
        ? 'text-primary'
        : 'text-white/70 hover:text-white'
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        isCompact
          ? 'bg-[#0c0c12]/95 backdrop-blur-2xl border-white/5 shadow-lg shadow-primary/5'
          : 'bg-[#0c0c12]/80 backdrop-blur-xl border-white/10'
      }`}
      style={{
        background: isCompact
          ? 'linear-gradient(180deg, rgba(12,12,18,0.98) 0%, rgba(12,12,18,0.95) 100%)'
          : 'linear-gradient(180deg, rgba(12,12,18,0.90) 0%, rgba(12,12,18,0.80) 100%)',
      }}
    >
      {/* Animated green energy line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="mx-auto w-full max-w-[var(--section-max-width)] px-4 sm:px-6 lg:px-8">
        <div
          className={`flex justify-between items-center transition-[height] duration-500 ${
            isCompact ? 'h-14' : 'h-[4.5rem]'
          }`}
        >
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/images/logos/feraj-solar-logo.png"
                alt="Feraj Solar Limited Logo"
                className={`object-contain transition-all duration-500 ${
                  isCompact ? 'h-9 w-9' : 'h-11 w-11'
                } group-hover:drop-shadow-[0_0_12px_rgba(49,209,122,0.5)]`}
              />
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-orbitron font-bold tracking-wider text-white transition-all duration-500 ${
                  isCompact ? 'text-sm' : 'text-base'
                }`}
                style={{
                  textShadow: '0 0 20px rgba(49,209,122,0.3)',
                }}
              >
                FERAJ
              </span>
              <span
                className={`font-space-grotesk font-light text-primary/80 tracking-[0.2em] transition-all duration-500 ${
                  isCompact ? 'text-[10px]' : 'text-xs'
                }`}
              >
                SOLAR LIMITED
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {!isHome && (
              <Link to="/" className={navLinkClass('/')}>
                <span className="px-4 py-2 block">Home</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            )}
            <Link to="/products" className={navLinkClass('/products')}>
              <span className="px-4 py-2 block">Products</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link to="/about" className={navLinkClass('/about')}>
              <span className="px-4 py-2 block">About</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link to="/team" className={navLinkClass('/team')}>
              <span className="px-4 py-2 block">Our Team</span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
            {isStaff && (
              <Link
                to="/admin"
                className="relative text-sm font-medium text-primary/90 hover:text-primary transition-all duration-300 group"
              >
                <span className="px-4 py-2 block flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" />
                  Admin Panel
                </span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            )}

            {/* Resources Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-all duration-300 rounded-md hover:bg-white/5 group">
                Resources
                <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 min-w-[240px] rounded-xl border border-primary/20 bg-[#0c0c12]/98 p-2 text-white/85 shadow-2xl backdrop-blur-2xl"
                  sideOffset={8}
                >
                  <DropdownMenu.Item asChild>
                    <Link
                      to="/partnerships"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer outline-none group/item"
                    >
                      <div className="p-1.5 rounded-md bg-primary/10 group-hover/item:bg-primary/20 transition-colors">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Partnerships</p>
                        <p className="text-xs text-white/40">
                          Collaborate with us
                        </p>
                      </div>
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      to="/why-green"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer outline-none group/item"
                    >
                      <div className="p-1.5 rounded-md bg-primary/10 group-hover/item:bg-primary/20 transition-colors">
                        <Lightbulb className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Why Green Energy</p>
                        <p className="text-xs text-white/40">
                          Sustainable future
                        </p>
                      </div>
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      to="/energy-stats"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer outline-none group/item"
                    >
                      <div className="p-1.5 rounded-md bg-primary/10 group-hover/item:bg-primary/20 transition-colors">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Energy Stats</p>
                        <p className="text-xs text-white/40">
                          Live data insights
                        </p>
                      </div>
                    </Link>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-white/5 transition-all duration-300 group"
            >
              <ShoppingCart className="h-5 w-5 text-white/75 group-hover:text-primary transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-bold text-white shadow-lg shadow-primary/50 animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Link
                  to="/orders"
                  className="text-sm font-medium text-white/70 hover:text-primary transition-all duration-300 px-3 py-2 rounded-lg hover:bg-white/5"
                >
                  Orders
                </Link>

                {/* User Account Dropdown */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/75 hover:bg-white/5 transition-all duration-300 focus:outline-none group">
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary border-2 border-[#0c0c12]" />
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="z-50 min-w-[240px] rounded-xl border border-primary/20 bg-[#0c0c12]/98 p-2 text-white/85 shadow-2xl backdrop-blur-2xl"
                      sideOffset={8}
                      align="end"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white/90 font-space-grotesk">
                          {profile?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-white/45 mt-0.5">
                          {user.email}
                        </p>
                      </div>
                      <DropdownMenu.Item asChild>
                        <Link
                          to="/profile"
                          className="mt-1 flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer outline-none group/item"
                        >
                          <div className="p-1.5 rounded-md bg-white/5 group-hover/item:bg-primary/20 transition-colors">
                            <User className="h-4 w-4" />
                          </div>
                          My Profile
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link
                          to="/devices"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer outline-none group/item"
                        >
                          <div className="p-1.5 rounded-md bg-white/5 group-hover/item:bg-primary/20 transition-colors">
                            <Activity className="h-4 w-4" />
                          </div>
                          My Devices
                        </Link>
                      </DropdownMenu.Item>
                      {isStaff && (
                        <DropdownMenu.Item asChild>
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer outline-none group/item"
                          >
                            <div className="p-1.5 rounded-md bg-primary/10 group-hover/item:bg-primary/20 transition-colors">
                              <Users className="h-4 w-4" />
                            </div>
                            Admin Panel
                          </Link>
                        </DropdownMenu.Item>
                      )}
                      <div className="my-1.5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <DropdownMenu.Item
                        onSelect={(e) => {
                          e.preventDefault();
                          handleSignOut();
                        }}
                      >
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 cursor-pointer outline-none"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </>
            ) : (
              <Link
                to="/login"
                className="relative overflow-hidden group rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_100%] animate-gradient-x" />
                <span className="relative z-10 text-white font-space-grotesk">
                  Login
                </span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative p-1.5">
              <ShoppingCart className="h-5 w-5 text-white/75" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[10px] font-bold text-white shadow-lg shadow-primary/50">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-1.5 rounded-lg text-white/80 hover:bg-white/10 transition-all duration-300"
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
                />
                <X
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-primary/20 bg-[#0c0c12]/98 backdrop-blur-2xl md:hidden">
          <div className="px-4 py-3 space-y-1">
            {!isHome && (
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/78 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                onClick={() => setIsOpen(false)}
              >
                <span className="font-medium">Home</span>
              </Link>
            )}
            <Link
              to="/products"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/78 hover:bg-primary/10 hover:text-primary transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-medium">Products</span>
            </Link>
            <Link
              to="/about"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/78 hover:bg-primary/10 hover:text-primary transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-medium">About</span>
            </Link>
            <Link
              to="/team"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/78 hover:bg-primary/10 hover:text-primary transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-medium">Our Team</span>
            </Link>

            {/* Resources Section */}
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-primary/60 uppercase tracking-widest font-orbitron">
                Resources
              </p>
            </div>
            <Link
              to="/partnerships"
              className="flex items-center gap-3 px-4 py-3 pl-6 rounded-lg text-white/70 hover:bg-primary/10 hover:text-primary transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <Users className="h-4 w-4" />
              Partnerships
            </Link>
            <Link
              to="/why-green"
              className="flex items-center gap-3 px-4 py-3 pl-6 rounded-lg text-white/70 hover:bg-primary/10 hover:text-primary transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <Lightbulb className="h-4 w-4" />
              Why Green Energy
            </Link>
            <Link
              to="/energy-stats"
              className="flex items-center gap-3 px-4 py-3 pl-6 rounded-lg text-white/70 hover:bg-primary/10 hover:text-primary transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <TrendingUp className="h-4 w-4" />
              Energy Stats
            </Link>

            {user ? (
              <>
                <div className="pt-4 pb-2">
                  <p className="px-4 text-xs font-semibold text-primary/60 uppercase tracking-widest font-orbitron">
                    Account
                  </p>
                </div>
                <Link
                  to="/orders"
                  className="flex items-center gap-3 px-4 py-3 pl-6 rounded-lg text-white/78 hover:bg-primary/10 hover:text-primary transition-all duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 pl-6 rounded-lg text-white/78 hover:bg-primary/10 hover:text-primary transition-all duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/devices"
                  className="flex items-center gap-3 px-4 py-3 pl-6 rounded-lg text-white/78 hover:bg-primary/10 hover:text-primary transition-all duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  My Devices
                </Link>
                {isStaff && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-4 py-3 pl-6 rounded-lg text-white/78 hover:bg-primary/10 hover:text-primary transition-all duration-200 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <Zap className="h-4 w-4" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 pl-6 rounded-lg text-left text-red-300 hover:bg-red-500/10 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-3 font-semibold text-white shadow-lg shadow-primary/30"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
