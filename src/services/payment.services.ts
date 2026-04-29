export interface PaymentLineItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface PaymentSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

const stripeCheckoutUrl =
  import.meta.env.VITE_STRIPE_CHECKOUT_URL?.trim() || '';

export function calculatePaymentSummary(
  items: PaymentLineItem[]
): PaymentSummary {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const shipping = subtotal > 1000 ? 0 : 49;

  return {
    subtotal,
    tax,
    shipping,
    total: subtotal + tax + shipping,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export function buildCheckoutMessage(summary: PaymentSummary) {
  const shippingLabel =
    summary.shipping === 0 ? 'Free' : `$${summary.shipping.toFixed(2)}`;

  return `Proceeding to payment gateway (Demo) - ${summary.itemCount} item${summary.itemCount === 1 ? '' : 's'}, subtotal $${summary.subtotal.toFixed(2)}, shipping ${shippingLabel}, total $${summary.total.toFixed(2)}`;
}

export function getStripeCheckoutUrl(summary: PaymentSummary) {
  if (!stripeCheckoutUrl) {
    return null;
  }

  try {
    const url = new URL(stripeCheckoutUrl);
    url.searchParams.set('subtotal', summary.subtotal.toFixed(2));
    url.searchParams.set('tax', summary.tax.toFixed(2));
    url.searchParams.set('shipping', summary.shipping.toFixed(2));
    url.searchParams.set('total', summary.total.toFixed(2));
    url.searchParams.set('items', String(summary.itemCount));
    return url.toString();
  } catch {
    return stripeCheckoutUrl;
  }
}
