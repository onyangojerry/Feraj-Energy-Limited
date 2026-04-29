import { useState, useEffect } from 'react';
import { products as fallbackProducts } from '@/app/data/products';
import { Trash2, Plus, Minus, CreditCard, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import {
  getProducts,
  type Product as DbProduct,
} from '@/services/products.service';
import {
  buildCheckoutMessage,
  calculatePaymentSummary,
  getStripeCheckoutUrl,
} from '@/services/payment.services';

interface CartItem {
  id: string;
  quantity: number;
}

interface CartDisplayItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const categoryMap: Record<string, string> = {
  panels: 'Solar Panels',
  inverters: 'Inverters',
  batteries: 'Battery Storage',
  accessories: 'Accessories',
};

const fallbackImage =
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400';

export function Cart() {
  const readCart = () =>
    JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];

  const [cart, setCart] = useState<CartItem[]>(() => readCart());
  const [dbProducts, setDbProducts] = useState<DbProduct[]>([]);

  // Sync cart across tabs/windows
  useEffect(() => {
    const handleStorage = () => setCart(readCart());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const data = await getProducts();
        if (!cancelled) {
          setDbProducts(data);
        }
      } catch (error: any) {
        if (!cancelled) {
          console.error('Cart product hydration failed:', error);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateQuantity = (productId: string, change: number) => {
    const newCart = cart
      .map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cart:updated'));
    window.dispatchEvent(new Event('storage'));
  };

  const removeItem = (productId: string) => {
    const newCart = cart.filter((item) => item.id !== productId);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    toast.success('Item removed from cart');
    window.dispatchEvent(new Event('cart:updated'));
    window.dispatchEvent(new Event('storage'));
  };

  const cartItems = cart
    .map((item): CartDisplayItem | null => {
      const dbProduct = dbProducts.find((p) => p.id === item.id);
      if (dbProduct) {
        return {
          id: dbProduct.id,
          name: dbProduct.name,
          description: dbProduct.description || 'Premium solar equipment',
          category: categoryMap[dbProduct.category] || dbProduct.category,
          price: dbProduct.price,
          quantity: item.quantity,
          imageUrl: dbProduct.images?.[0] || fallbackImage,
        };
      }

      const fallbackProduct = fallbackProducts.find((p) => p.id === item.id);
      if (fallbackProduct) {
        return { ...fallbackProduct, quantity: item.quantity };
      }

      return null;
    })
    .filter((item): item is CartDisplayItem => item !== null);

  const paymentSummary = calculatePaymentSummary(
    cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))
  );

  const handleCheckout = () => {
    const stripeCheckoutUrl = getStripeCheckoutUrl(paymentSummary);

    if (stripeCheckoutUrl) {
      toast.success('Redirecting to Stripe Checkout...');
      window.location.assign(stripeCheckoutUrl);
      return;
    }

    toast.success(buildCheckoutMessage(paymentSummary));
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto w-full max-w-[var(--section-max-width)] px-4 sm:px-6 lg:px-8">
          <div className="cinematic-panel-strong mx-auto max-w-2xl p-10 text-center sm:p-14">
            <div className="mb-5 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5 text-primary">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </div>
            <h2 className="mb-4 text-3xl font-semibold text-white/90">
              Your Cart is Empty
            </h2>
            <p className="mb-8 text-white/60">
              Add some products to get started!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center rounded-md border border-primary/35 bg-primary/90 px-8 py-3 font-semibold text-primary-foreground transition hover:bg-primary"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 lg:py-14">
      <div className="mx-auto w-full max-w-[var(--section-max-width)] px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(140deg,rgba(12,14,20,0.95),rgba(9,11,17,0.82))] p-8 sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(73,201,255,0.18),transparent_35%),radial-gradient(circle_at_88%_76%,rgba(49,209,122,0.16),transparent_40%)]" />
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="cinematic-eyebrow">Checkout Chapter • Cart</p>
              <h1 className="mt-3 text-4xl font-semibold text-white/90 sm:text-5xl">
                Shopping Cart
              </h1>
              <p className="mt-3 text-white/60">
                Review quantities, verify pricing, and proceed when ready.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/65">
              {cartItems.length} line item{cartItems.length === 1 ? '' : 's'}
            </div>
          </div>
        </section>

        <div className="mt-9 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <motion.article
                key={item.id}
                className="cinematic-panel p-5 sm:p-6"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
              >
                <div className="flex gap-5">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-28 w-28 rounded-md object-cover sm:h-32 sm:w-32"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white/90">
                          {item.name}
                        </h3>
                        <p className="text-sm text-white/55">{item.category}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="rounded-md p-1 text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <p className="mb-4 line-clamp-2 text-sm text-white/60">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="rounded-md p-1 text-white/80 transition hover:bg-white/10"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-lg font-semibold text-white/90">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="rounded-md p-1 text-white/80 transition hover:bg-white/10"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-semibold text-white/90">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-sm text-white/55">
                          ${item.price} each
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="cinematic-panel-strong sticky top-24 p-6">
              <h2 className="mb-6 text-xl font-semibold text-white/90">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>${paymentSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Tax (8%)</span>
                  <span>${paymentSummary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Shipping</span>
                  <span>
                    {paymentSummary.shipping === 0
                      ? 'Free'
                      : `$${paymentSummary.shipping.toFixed(2)}`}
                  </span>
                </div>
                {paymentSummary.subtotal > 1000 && (
                  <div className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-primary">
                    Free shipping on orders over $1,000!
                  </div>
                )}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between text-lg font-semibold text-white/90">
                    <span>Total</span>
                    <span>${paymentSummary.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-primary/35 bg-primary/90 px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary"
              >
                <CreditCard className="h-5 w-5" />
                Proceed to Checkout
              </button>

              <p className="mt-4 text-center text-xs text-white/50">
                Secure payment processing • Stripe supported • SSL encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
