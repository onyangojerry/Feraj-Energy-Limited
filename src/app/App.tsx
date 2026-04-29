import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { AdminRoute } from '@/app/components/AdminRoute';

const Home = lazy(() =>
  import('@/app/pages/Home').then((module) => ({ default: module.Home }))
);
const Products = lazy(() =>
  import('@/app/pages/Products').then((module) => ({
    default: module.Products,
  }))
);
const Cart = lazy(() =>
  import('@/app/pages/Cart').then((module) => ({ default: module.Cart }))
);
const Orders = lazy(() =>
  import('@/app/pages/Orders').then((module) => ({ default: module.Orders }))
);
const Profile = lazy(() =>
  import('@/app/pages/Profile').then((module) => ({ default: module.Profile }))
);
const Devices = lazy(() =>
  import('@/app/pages/Devices').then((module) => ({ default: module.Devices }))
);
const Login = lazy(() =>
  import('@/app/pages/Login').then((module) => ({ default: module.Login }))
);
const AuthCallback = lazy(() =>
  import('@/app/pages/AuthCallback').then((module) => ({
    default: module.AuthCallback,
  }))
);
const ResetPassword = lazy(() =>
  import('@/app/pages/ResetPassword').then((module) => ({
    default: module.ResetPassword,
  }))
);
const About = lazy(() =>
  import('@/app/pages/About').then((module) => ({ default: module.About }))
);
const Partnerships = lazy(() =>
  import('@/app/pages/Partnerships').then((module) => ({
    default: module.Partnerships,
  }))
);
const PartnershipRequest = lazy(() =>
  import('@/app/pages/PartnershipRequest').then((module) => ({
    default: module.PartnershipRequest,
  }))
);
const TermsOfService = lazy(() =>
  import('@/app/pages/TermsOfService').then((module) => ({
    default: module.TermsOfService,
  }))
);
const PrivacyPolicy = lazy(() =>
  import('@/app/pages/PrivacyPolicy').then((module) => ({
    default: module.PrivacyPolicy,
  }))
);
const Careers = lazy(() =>
  import('@/app/pages/Careers').then((module) => ({
    default: module.Careers,
  }))
);
const WhyGreen = lazy(() =>
  import('@/app/pages/WhyGreen').then((module) => ({
    default: module.WhyGreen,
  }))
);
const EnergyStats = lazy(() =>
  import('@/app/pages/EnergyStats').then((module) => ({
    default: module.EnergyStats,
  }))
);
const Team = lazy(() =>
  import('@/app/pages/Team').then((module) => ({ default: module.Team }))
);
const AdminLayout = lazy(() =>
  import('@/app/components/layouts/AdminLayout').then((module) => ({
    default: module.AdminLayout,
  }))
);
const AdminDashboard = lazy(() =>
  import('@/app/pages/admin/Dashboard').then((module) => ({
    default: module.AdminDashboard,
  }))
);
const AdminUsers = lazy(() =>
  import('@/app/pages/admin/Users').then((module) => ({
    default: module.AdminUsers,
  }))
);
const AdminProducts = lazy(() =>
  import('@/app/pages/admin/Products').then((module) => ({
    default: module.AdminProducts,
  }))
);
const AdminAudit = lazy(() =>
  import('@/app/pages/admin/Audit').then((module) => ({
    default: module.AdminAudit,
  }))
);
const AdminDevices = lazy(() =>
  import('@/app/pages/admin/Devices').then((module) => ({
    default: module.AdminDevices,
  }))
);
const AdminPartnershipRequests = lazy(() =>
  import('@/app/pages/admin/PartnershipRequests').then((module) => ({
    default: module.PartnershipRequests,
  }))
);
const AdminLegalDocuments = lazy(() =>
  import('@/app/pages/admin/LegalDocuments').then((module) => ({
    default: module.LegalDocuments,
  }))
);
const AdminNewsletters = lazy(() =>
  import('@/app/pages/admin/Newsletters').then((module) => ({
    default: module.Newsletters,
  }))
);
const AdminJobPostings = lazy(() =>
  import('@/app/pages/admin/JobPostings').then((module) => ({
    default: module.JobPostings,
  }))
);

function RouteLoadingFallback() {
  return (
    <div className="relative z-10 flex min-h-[42vh] items-center justify-center px-6">
      <div className="rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm text-white/72">
        Loading section...
      </div>
    </div>
  );
}
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId: number;
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, nextProgress)));
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-[60] h-1 w-full bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="cinematic-shell min-h-screen flex flex-col">
        <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[44vh] bg-[radial-gradient(circle_at_15%_0%,rgba(49,209,122,0.16),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(73,201,255,0.12),transparent_38%)]" />
        <ScrollProgress />
        <Toaster position="top-right" richColors />
        <Navbar />
        <main className="relative z-10 flex-1">
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/partnerships" element={<Partnerships />} />
              <Route
                path="/partnership-request"
                element={<PartnershipRequest />}
              />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/why-green" element={<WhyGreen />} />
              <Route path="/energy-stats" element={<EnergyStats />} />
              <Route path="/team" element={<Team />} />

              {/* Protected Routes */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/devices"
                element={
                  <ProtectedRoute>
                    <Devices />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="devices" element={<AdminDevices />} />
                <Route path="audit" element={<AdminAudit />} />
                <Route
                  path="partnership-requests"
                  element={<AdminPartnershipRequests />}
                />
                <Route
                  path="legal-documents"
                  element={<AdminLegalDocuments />}
                />
                <Route path="newsletters" element={<AdminNewsletters />} />
                <Route path="job-postings" element={<AdminJobPostings />} />
                <Route path="orders" element={<Orders />} />
              </Route>
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
