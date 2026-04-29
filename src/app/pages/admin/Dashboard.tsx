// import { useState, useEffect } from 'react';
// import { getUserStats } from '@/services/users.service';
// import { getProducts, type Product } from '@/services/products.service';
// import {
//   Users,
//   Package,
//   ShoppingCart,
//   TrendingUp,
//   AlertCircle,
//   DollarSign,
//   Loader2,
//   ArrowUpRight,
//   Boxes,
//   ShieldCheck,
// } from 'lucide-react';
// import { Link } from 'react-router';

// interface DashboardStats {
//   totalUsers: number;
//   totalProducts: number;
//   totalOrders: number;
//   activeProducts: number;
//   outOfStockProducts: number;
//   lowStockProducts: number;
//   recentUsers: number;
//   totalRevenue: number;
// }

// export function AdminDashboard() {
//   const [stats, setStats] = useState<DashboardStats>({
//     totalUsers: 0,
//     totalProducts: 0,
//     totalOrders: 0,
//     activeProducts: 0,
//     outOfStockProducts: 0,
//     lowStockProducts: 0,
//     recentUsers: 0,
//     totalRevenue: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const totalStockTracked = stats.totalProducts || 1;
//   const outOfStockPercent = Math.round(
//     (stats.outOfStockProducts / totalStockTracked) * 100
//   );
//   const lowStockPercent = Math.round(
//     (stats.lowStockProducts / totalStockTracked) * 100
//   );
//   const healthyStockProducts = Math.max(
//     stats.totalProducts - stats.outOfStockProducts - stats.lowStockProducts,
//     0
//   );
//   const healthyStockPercent = Math.round(
//     (healthyStockProducts / totalStockTracked) * 100
//   );

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);

//       // Fetch all data in parallel
//       const [userStats, products] = await Promise.all([
//         getUserStats(),
//         getProducts(),
//       ]);

//       // Calculate product stats
//       const activeProducts = products.filter(
//         (p: Product) => p.is_active
//       ).length;
//       const outOfStockProducts = products.filter(
//         (p: Product) => p.stock_quantity === 0
//       ).length;
//       const lowStockProducts = products.filter(
//         (p: Product) => p.stock_quantity > 0 && p.stock_quantity < 10
//       ).length;

//       // Calculate revenue (placeholder - will be implemented when order creation is added)
//       const totalRevenue = 0;

//       setStats({
//         totalUsers: userStats.totalUsers,
//         totalProducts: products.length,
//         totalOrders: 0, // Will be implemented when order creation is added
//         activeProducts,
//         outOfStockProducts,
//         lowStockProducts,
//         recentUsers: userStats.recentUsers.length,
//         totalRevenue,
//       });
//     } catch (error: any) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       <div className="rounded-2xl border border-border bg-gradient-to-r from-primary/10 via-secondary/70 to-primary/5 p-6 sm:p-8">
//         <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
//               Control Center
//             </p>
//             <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
//               Admin Dashboard
//             </h1>
//             <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
//               Monitor users, products, and inventory status from one place.
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
//             <div className="rounded-xl border border-primary/15 bg-background/80 px-4 py-3">
//               <p className="text-xs text-muted-foreground">Users</p>
//               <p className="mt-1 text-xl font-semibold text-foreground">
//                 {stats.totalUsers}
//               </p>
//             </div>
//             <div className="rounded-xl border border-primary/15 bg-background/80 px-4 py-3">
//               <p className="text-xs text-muted-foreground">Products</p>
//               <p className="mt-1 text-xl font-semibold text-foreground">
//                 {stats.totalProducts}
//               </p>
//             </div>
//             <div className="rounded-xl border border-primary/15 bg-background/80 px-4 py-3 col-span-2 sm:col-span-1">
//               <p className="text-xs text-muted-foreground">Revenue</p>
//               <p className="mt-1 text-xl font-semibold text-foreground">
//                 KES {stats.totalRevenue.toLocaleString()}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
//         <Link
//           to="/admin/users"
//           className="group rounded-xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//                 Total Users
//               </p>
//               <p className="mt-1 text-3xl font-bold text-foreground">
//                 {stats.totalUsers}
//               </p>
//               {stats.recentUsers > 0 && (
//                 <p className="mt-2 text-sm text-primary">
//                   +{stats.recentUsers} this month
//                 </p>
//               )}
//             </div>
//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100">
//               <Users className="h-5 w-5 text-blue-700" />
//             </div>
//           </div>
//           <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
//             Open users <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
//           </div>
//         </Link>

//         <Link
//           to="/admin/products"
//           className="group rounded-xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//                 Total Products
//               </p>
//               <p className="mt-1 text-3xl font-bold text-foreground">
//                 {stats.totalProducts}
//               </p>
//               <p className="mt-2 text-sm text-muted-foreground">
//                 {stats.activeProducts} active
//               </p>
//             </div>
//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-100">
//               <Package className="h-5 w-5 text-violet-700" />
//             </div>
//           </div>
//           <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
//             Open catalog <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
//           </div>
//         </Link>

//         <Link
//           to="/admin/orders"
//           className="group rounded-xl border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//                 Total Orders
//               </p>
//               <p className="mt-1 text-3xl font-bold text-foreground">
//                 {stats.totalOrders}
//               </p>
//               <p className="mt-2 text-sm text-muted-foreground">All time</p>
//             </div>
//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary">
//               <ShoppingCart className="h-5 w-5 text-primary" />
//             </div>
//           </div>
//           <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
//             Review orders <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
//           </div>
//         </Link>

//         <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
//                 Total Revenue
//               </p>
//               <p className="mt-1 text-3xl font-bold text-foreground">
//                 KES {stats.totalRevenue.toLocaleString()}
//               </p>
//               <p className="mt-2 text-sm text-muted-foreground">All time</p>
//             </div>
//             <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100">
//               <DollarSign className="h-5 w-5 text-amber-700" />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
//         <div className="xl:col-span-2 rounded-xl border border-border bg-white p-6 shadow-sm">
//           <div className="mb-5 flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-semibold text-foreground">
//                 Inventory Health
//               </h2>
//               <p className="text-sm text-muted-foreground">
//                 Snapshot of product availability.
//               </p>
//             </div>
//             <Boxes className="h-5 w-5 text-muted-foreground" />
//           </div>

//           <div className="space-y-4">
//             <div>
//               <div className="mb-2 flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Healthy stock</span>
//                 <span className="font-medium text-foreground">
//                   {healthyStockProducts} ({healthyStockPercent}%)
//                 </span>
//               </div>
//               <div className="h-2 rounded-full bg-secondary">
//                 <div
//                   className="h-full rounded-full bg-emerald-500"
//                   style={{ width: `${healthyStockPercent}%` }}
//                 />
//               </div>
//             </div>

//             <div>
//               <div className="mb-2 flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Low stock</span>
//                 <span className="font-medium text-foreground">
//                   {stats.lowStockProducts} ({lowStockPercent}%)
//                 </span>
//               </div>
//               <div className="h-2 rounded-full bg-secondary">
//                 <div
//                   className="h-full rounded-full bg-amber-500"
//                   style={{ width: `${lowStockPercent}%` }}
//                 />
//               </div>
//             </div>

//             <div>
//               <div className="mb-2 flex items-center justify-between text-sm">
//                 <span className="text-muted-foreground">Out of stock</span>
//                 <span className="font-medium text-foreground">
//                   {stats.outOfStockProducts} ({outOfStockPercent}%)
//                 </span>
//               </div>
//               <div className="h-2 rounded-full bg-secondary">
//                 <div
//                   className="h-full rounded-full bg-red-500"
//                   style={{ width: `${outOfStockPercent}%` }}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
//             <Link
//               to="/admin/products"
//               className="rounded-lg border border-red-200 bg-red-50 px-4 py-3"
//             >
//               <p className="text-xs font-medium uppercase tracking-wide text-red-700">
//                 Out of Stock
//               </p>
//               <p className="mt-1 text-2xl font-bold text-red-700">
//                 {stats.outOfStockProducts}
//               </p>
//             </Link>
//             <Link
//               to="/admin/products"
//               className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3"
//             >
//               <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
//                 Low Stock
//               </p>
//               <p className="mt-1 text-2xl font-bold text-amber-700">
//                 {stats.lowStockProducts}
//               </p>
//             </Link>
//             <Link
//               to="/admin/products"
//               className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3"
//             >
//               <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
//                 Active Products
//               </p>
//               <p className="mt-1 text-2xl font-bold text-emerald-700">
//                 {stats.activeProducts}
//               </p>
//             </Link>
//           </div>
//         </div>

//         <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-semibold text-foreground">
//                 Quick Actions
//               </h2>
//               <p className="text-sm text-muted-foreground">Common tasks</p>
//             </div>
//             <ShieldCheck className="h-5 w-5 text-muted-foreground" />
//           </div>
//           <Link
//             to="/admin/products"
//             className="group mb-3 flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:border-primary/40 hover:bg-secondary/50"
//           >
//             <span className="font-medium text-foreground">Add New Product</span>
//             <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
//           </Link>
//           <Link
//             to="/admin/users"
//             className="group mb-3 flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:border-primary/40 hover:bg-secondary/50"
//           >
//             <span className="font-medium text-foreground">Manage Users</span>
//             <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
//           </Link>
//           <Link
//             to="/admin/orders"
//             className="group flex items-center justify-between rounded-lg border border-border px-4 py-3 hover:border-primary/40 hover:bg-secondary/50"
//           >
//             <span className="font-medium text-foreground">View Orders</span>
//             <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
//           </Link>
//         </div>
//       </div>

//       {(stats.outOfStockProducts > 0 || stats.lowStockProducts > 0) && (
//         <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-5">
//           <div className="flex items-start gap-3">
//             <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-700" />
//             <div>
//               <h3 className="mb-1 font-semibold text-amber-900">
//                 Inventory Alerts
//               </h3>
//               <ul className="space-y-1 text-sm text-amber-800">
//                 {stats.outOfStockProducts > 0 && (
//                   <li>
//                     • {stats.outOfStockProducts} product(s) are out of stock
//                   </li>
//                 )}
//                 {stats.lowStockProducts > 0 && (
//                   <li>
//                     • {stats.lowStockProducts} product(s) have low stock (&lt;10
//                     units)
//                   </li>
//                 )}
//               </ul>
//               <Link
//                 to="/admin/products"
//                 className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-900 underline hover:text-amber-700"
//               >
//                 Manage inventory <ArrowUpRight className="h-4 w-4" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { getUserStats } from '@/services/users.service';
import { getProducts, type Product } from '@/services/products.service';
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  activeProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  recentUsers: number;
  totalRevenue: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    activeProducts: 0,
    outOfStockProducts: 0,
    lowStockProducts: 0,
    recentUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [userStats, products] = await Promise.all([
        getUserStats(),
        getProducts(),
      ]);

      const activeProducts = products.filter(
        (p: Product) => p.is_active
      ).length;
      const outOfStockProducts = products.filter(
        (p: Product) => p.stock_quantity === 0
      ).length;
      const lowStockProducts = products.filter(
        (p: Product) => p.stock_quantity > 0 && p.stock_quantity < 10
      ).length;

      const totalRevenue = 0;

      setStats({
        totalUsers: userStats.totalUsers,
        totalProducts: products.length,
        totalOrders: 0,
        activeProducts,
        outOfStockProducts,
        lowStockProducts,
        recentUsers: userStats.recentUsers.length,
        totalRevenue,
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm text-white/60">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const cardBase =
    'group rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,26,0.96),rgba(9,11,16,0.92))] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_28px_90px_rgba(0,0,0,0.32)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50';
  const iconWrapBase =
    'h-12 w-12 rounded-2xl flex items-center justify-center ring-1 ring-white/10 transition';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(13,16,23,0.96),rgba(8,10,15,0.86))] p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(49,209,122,0.14),transparent_28%),radial-gradient(circle_at_85%_0%,rgba(73,201,255,0.12),transparent_30%)]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="cinematic-eyebrow">Admin Console</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white/92">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Overview of your platform&apos;s key metrics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchDashboardData}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-sm font-medium text-white/84 shadow-sm transition hover:bg-white/10"
            >
              <Loader2 className="h-4 w-4 opacity-0 group-hover:opacity-100" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <Link to="/admin/users" className={cardBase}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white/58">Total Users</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-white/92">
                {stats.totalUsers}
              </p>
              {stats.recentUsers > 0 && (
                <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  +{stats.recentUsers} this month
                </p>
              )}
            </div>

            <div
              className={`${iconWrapBase} bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/15`}
            >
              <Users className="h-6 w-6" />
            </div>
          </div>
        </Link>

        {/* Total Products */}
        <Link to="/admin/products" className={cardBase}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white/58">
                Total Products
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-white/92">
                {stats.totalProducts}
              </p>
              <p className="mt-2 text-sm text-white/58">
                <span className="font-medium text-white/86">
                  {stats.activeProducts}
                </span>{' '}
                active
              </p>
            </div>

            <div
              className={`${iconWrapBase} bg-purple-500/10 text-purple-600 group-hover:bg-purple-500/15`}
            >
              <Package className="h-6 w-6" />
            </div>
          </div>
        </Link>

        {/* Total Orders */}
        <Link to="/admin/orders" className={cardBase}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white/58">Total Orders</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-white/92">
                {stats.totalOrders}
              </p>
              <p className="mt-2 text-sm text-white/58">All time</p>
            </div>

            <div
              className={`${iconWrapBase} bg-primary/10 text-primary group-hover:bg-primary/15`}
            >
              <ShoppingCart className="h-6 w-6" />
            </div>
          </div>
        </Link>

        {/* Total Revenue */}
        <div className={`${cardBase} cursor-default hover:translate-y-0`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white/58">Total Revenue</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-white/92">
                KES {stats.totalRevenue.toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-white/58">All time</p>
            </div>

            <div className={`${iconWrapBase} bg-orange-500/10 text-orange-600`}>
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Link
          to="/admin/products"
          className={`${cardBase} border-l-4 border-l-red-500`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/58">Out of Stock</p>
              <p className="mt-2 text-2xl font-semibold text-red-600">
                {stats.outOfStockProducts}
              </p>
              <p className="mt-1 text-xs text-white/50">products</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </Link>

        <Link
          to="/admin/products"
          className={`${cardBase} border-l-4 border-l-orange-500`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/58">Low Stock</p>
              <p className="mt-2 text-2xl font-semibold text-orange-600">
                {stats.lowStockProducts}
              </p>
              <p className="mt-1 text-xs text-white/50">
                products (&lt;10 units)
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-600" />
          </div>
        </Link>

        <Link
          to="/admin/products"
          className={`${cardBase} border-l-4 border-l-primary`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white/58">
                Active Products
              </p>
              <p className="mt-2 text-2xl font-semibold text-primary">
                {stats.activeProducts}
              </p>
              <p className="mt-1 text-xs text-white/50">visible to customers</p>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(15,18,26,0.95),rgba(9,11,16,0.92))] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight text-white/90">
            Quick Actions
          </h2>
          <p className="hidden text-sm text-white/55 sm:block">
            Common admin workflows
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            to="/admin/products"
            className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm transition hover:bg-white/8 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <div
              className={`${iconWrapBase} h-11 w-11 bg-primary/10 text-primary`}
            >
              <Package className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-white/90">Add New Product</p>
              <p className="text-sm text-white/55">
                Create a new product listing
              </p>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm transition hover:bg-white/8 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <div
              className={`${iconWrapBase} h-11 w-11 bg-blue-500/10 text-blue-600`}
            >
              <Users className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-white/90">Manage Users</p>
              <p className="text-sm text-white/55">
                View and update user roles
              </p>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm transition hover:bg-white/8 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            <div
              className={`${iconWrapBase} h-11 w-11 bg-primary/10 text-primary`}
            >
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-white/90">View Orders</p>
              <p className="text-sm text-white/55">Monitor customer orders</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Alerts Section */}
      {(stats.outOfStockProducts > 0 || stats.lowStockProducts > 0) && (
        <div className="rounded-2xl border border-orange-500/20 bg-[linear-gradient(180deg,rgba(51,20,9,0.78),rgba(19,10,7,0.82))] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-200 ring-1 ring-orange-500/20">
              <AlertCircle className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-white/92">Inventory Alerts</h3>
              <ul className="mt-2 space-y-1 text-sm text-white/72">
                {stats.outOfStockProducts > 0 && (
                  <li>
                    •{' '}
                    <span className="font-semibold">
                      {stats.outOfStockProducts}
                    </span>{' '}
                    product(s) are out of stock
                  </li>
                )}
                {stats.lowStockProducts > 0 && (
                  <li>
                    •{' '}
                    <span className="font-semibold">
                      {stats.lowStockProducts}
                    </span>{' '}
                    product(s) have low stock (&lt;10 units)
                  </li>
                )}
              </ul>

              <Link
                to="/admin/products"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-orange-300 underline decoration-orange-400 underline-offset-4 hover:text-orange-200"
              >
                Manage Inventory <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
