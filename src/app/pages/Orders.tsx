import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  payment_status: string;
}

export function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error: any) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'border border-primary/30 bg-primary/10 text-primary';
      case 'cancelled':
        return 'border border-red-500/30 bg-red-500/10 text-red-300';
      case 'shipped':
        return 'border border-sky-500/30 bg-sky-500/10 text-sky-300';
      case 'processing':
        return 'border border-purple-500/30 bg-purple-500/10 text-purple-300';
      default:
        return 'border border-amber-500/30 bg-amber-500/10 text-amber-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto w-full max-w-[var(--section-max-width)] px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-9 w-40 rounded-md bg-white/10 animate-pulse" />
            <div className="mt-3 h-4 w-64 rounded-md bg-white/10 animate-pulse" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="cinematic-panel p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white/10" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 rounded bg-white/10" />
                      <div className="h-3 w-32 rounded bg-white/10" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="ml-auto h-4 w-24 rounded bg-white/10" />
                    <div className="ml-auto h-6 w-20 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 lg:py-14">
      <div className="mx-auto w-full max-w-[var(--section-max-width)] px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(12,14,20,0.95),rgba(10,11,16,0.84))] p-8 sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(73,201,255,0.16),transparent_36%),radial-gradient(circle_at_84%_78%,rgba(49,209,122,0.14),transparent_42%)]" />
          <div className="relative">
            <p className="cinematic-eyebrow">Account Chapter • Orders</p>
            <h1 className="mt-3 text-4xl font-semibold text-white/90 sm:text-5xl">
              My Orders
            </h1>
            <p className="mt-3 text-white/60">
              Track and manage your solar equipment orders
            </p>
          </div>
        </section>

        {orders.length > 0 && (
          <section className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="cinematic-panel p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-white/45">
                Total
              </p>
              <p className="mt-2 text-2xl font-semibold text-white/90">
                {orders.length}
              </p>
            </div>
            <div className="cinematic-panel p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-white/45">
                Delivered
              </p>
              <p className="mt-2 text-2xl font-semibold text-primary">
                {orders.filter((order) => order.status === 'delivered').length}
              </p>
            </div>
            <div className="cinematic-panel p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-white/45">
                In Transit
              </p>
              <p className="mt-2 text-2xl font-semibold text-sky-300">
                {orders.filter((order) => order.status === 'shipped').length}
              </p>
            </div>
            <div className="cinematic-panel p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-white/45">
                Processing
              </p>
              <p className="mt-2 text-2xl font-semibold text-amber-300">
                {
                  orders.filter(
                    (order) =>
                      order.status !== 'delivered' &&
                      order.status !== 'shipped' &&
                      order.status !== 'cancelled'
                  ).length
                }
              </p>
            </div>
          </section>
        )}

        <div className="mt-8">
          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="cinematic-panel-strong p-12 text-center">
              <Package className="mx-auto mb-4 h-16 w-16 text-white/35" />
              <h2 className="mb-2 text-2xl font-semibold text-white/90">
                No Orders Yet
              </h2>
              <p className="mb-6 text-white/60">
                You haven&apos;t placed any orders yet. Start shopping for solar
                solutions!
              </p>
              <a
                href="/products"
                className="inline-block rounded-md border border-primary/35 bg-primary/90 px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary"
              >
                Browse Products
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <motion.article
                  key={order.id}
                  className="cinematic-panel p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: index * 0.03 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <h3 className="font-semibold text-white/90">
                          Order #{order.id.slice(0, 8)}
                        </h3>
                        <p className="text-sm text-white/55">
                          Placed on{' '}
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white/90">
                        KES {order.total_amount.toLocaleString()}
                      </p>
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
