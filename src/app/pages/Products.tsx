import { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Search, Filter, Info } from 'lucide-react';
import { toast } from 'sonner';
import { getProducts } from '@/services/products.service';
import type { Product } from '@/services/products.service';
import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import { Slider } from '@/app/components/ui/slider';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { ProductCarousel } from '@/app/components/ProductCarousel';

// --- Constants & Types ---

const CATEGORY_GROUPS = {
  'Core PV Components': ['panels', 'inverters', 'batteries', 'controllers'],
  'Water Solutions': ['pumps', 'heaters'],
  'Decentralized & Off-Grid': ['shs', 'street_lights', 'portable_power'],
};

const CATEGORY_LABELS: Record<string, string> = {
  panels: 'Solar Panels',
  inverters: 'Hybrid Inverters',
  batteries: 'Lithium-ion Batteries',
  controllers: 'MPPT Controllers',
  pumps: 'Solar Water Pumps',
  heaters: 'Solar Water Heaters',
  shs: 'Solar Home Systems',
  street_lights: 'All-in-One Street Lights',
  portable_power: 'Portable Power Stations',
};

const BRANDS = {
  panels: ['Jinko', 'Trina', 'Longi', 'Canadian Solar', 'ZNSHINE'],
  inverters: ['Deye', 'SRNE', 'GoodWe', 'Solis', 'Growatt', 'MUST', 'Victron'],
  batteries: ['BYD', 'Felicity', 'Vestwoods', 'Pylontech'],
  pumps: ['Grundfos', 'Lorentz', 'Dayliff', 'Veichi'],
  heaters: ['Megasun'],
  others: ['Bluetti', 'EcoFlow', 'Jackery', 'Sun King', 'M-Kopa'],
};

const APPLICATIONS = [
  'Residential',
  'Commercial & Industrial (C&I)',
  'Agriculture',
  'Off-Grid / Rural',
  'Emergency Backup',
  'Public Infrastructure',
];

// --- Main Component ---

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<string[]>(
    []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [inStockOnly, setInStockOnly] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category);

      const matchesBrand =
        selectedBrands.length === 0 ||
        (p.brand && selectedBrands.includes(p.brand));

      const matchesApplication =
        selectedApplications.length === 0 ||
        (p.application &&
          p.application.some((app) => selectedApplications.includes(app)));

      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];

      const matchesStock = !inStockOnly || p.stock_quantity > 0;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBrand &&
        matchesApplication &&
        matchesPrice &&
        matchesStock
      );
    });
  }, [
    products,
    searchQuery,
    selectedCategories,
    selectedBrands,
    selectedApplications,
    priceRange,
    inStockOnly,
  ]);

  const addToCart = (productId: string) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('Product added to cart!');
    window.dispatchEvent(new Event('cart:updated'));
    window.dispatchEvent(new Event('storage'));
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedApplications([]);
    setPriceRange([0, 2000000]);
    setInStockOnly(false);
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="space-y-8 w-full max-w-4xl px-4">
          <div className="h-12 w-1/3 bg-white/5 animate-pulse rounded" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-8 items-center">
              <div className="w-1/3 aspect-square bg-white/5 animate-pulse rounded-lg" />
              <div className="flex-1 space-y-4">
                <div className="h-8 w-1/2 bg-white/5 animate-pulse rounded" />
                <div className="h-4 w-full bg-white/5 animate-pulse rounded" />
                <div className="h-4 w-2/3 bg-white/5 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Morphs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(49,209,122,0.12),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(73,201,255,0.1),transparent_45%)] opacity-80" />
        <div className="absolute top-[10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        {/* Hero Section with Product Carousel */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-white/5">
          <div className="mx-auto max-w-[var(--section-max-width)]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-1 text-center"
            ></motion.div>

            {/* Product Carousel */}
            {!loading && products.length > 0 && (
              <ProductCarousel
                products={products}
                autoPlay={true}
                autoPlayInterval={5000}
              />
            )}
          </div>
        </section>

        <div className="mx-auto max-w-[var(--section-max-width)] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 py-12">
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-80 space-y-8">
              <div className="sticky top-24 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-white/40 flex items-center gap-2">
                    <Filter className="h-3 w-3" /> Filters
                  </h2>
                  {(selectedCategories.length > 0 ||
                    selectedBrands.length > 0 ||
                    selectedApplications.length > 0 ||
                    searchQuery ||
                    inStockOnly) && (
                    <button
                      onClick={clearFilters}
                      className="text-[10px] uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <Accordion
                  type="multiple"
                  defaultValue={[
                    'categories',
                    'brands',
                    'applications',
                    'price',
                  ]}
                >
                  {/* Categories */}
                  <AccordionItem value="categories" className="border-white/5">
                    <AccordionTrigger className="text-sm font-bold uppercase tracking-widest py-4">
                      Categories
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-2">
                      {Object.entries(CATEGORY_GROUPS).map(([group, cats]) => (
                        <div key={group} className="space-y-3">
                          <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">
                            {group}
                          </p>
                          <div className="space-y-2">
                            {cats.map((cat) => (
                              <div
                                key={cat}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`cat-${cat}`}
                                  checked={selectedCategories.includes(cat)}
                                  onCheckedChange={(checked) => {
                                    setSelectedCategories((prev) =>
                                      checked
                                        ? [...prev, cat]
                                        : prev.filter((c) => c !== cat)
                                    );
                                  }}
                                />
                                <label
                                  htmlFor={`cat-${cat}`}
                                  className="text-sm text-white/60 cursor-pointer hover:text-white transition-colors"
                                >
                                  {CATEGORY_LABELS[cat] || cat}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Brands */}
                  <AccordionItem value="brands" className="border-white/5">
                    <AccordionTrigger className="text-sm font-bold uppercase tracking-widest py-4">
                      Brands
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                      <div className="grid grid-cols-1 gap-2">
                        {Object.values(BRANDS)
                          .flat()
                          .map((brand) => (
                            <div
                              key={brand}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`brand-${brand}`}
                                checked={selectedBrands.includes(brand)}
                                onCheckedChange={(checked) => {
                                  setSelectedBrands((prev) =>
                                    checked
                                      ? [...prev, brand]
                                      : prev.filter((b) => b !== brand)
                                  );
                                }}
                              />
                              <label
                                htmlFor={`brand-${brand}`}
                                className="text-sm text-white/60 cursor-pointer hover:text-white transition-colors"
                              >
                                {brand}
                              </label>
                            </div>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Applications */}
                  <AccordionItem
                    value="applications"
                    className="border-white/5"
                  >
                    <AccordionTrigger className="text-sm font-bold uppercase tracking-widest py-4">
                      Application
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 space-y-2">
                      {APPLICATIONS.map((app) => (
                        <div key={app} className="flex items-center space-x-2">
                          <Checkbox
                            id={`app-${app}`}
                            checked={selectedApplications.includes(app)}
                            onCheckedChange={(checked) => {
                              setSelectedApplications((prev) =>
                                checked
                                  ? [...prev, app]
                                  : prev.filter((a) => a !== app)
                              );
                            }}
                          />
                          <label
                            htmlFor={`app-${app}`}
                            className="text-sm text-white/60 cursor-pointer hover:text-white transition-colors"
                          >
                            {app}
                          </label>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  {/* Price Range */}
                  <AccordionItem value="price" className="border-white/5">
                    <AccordionTrigger className="text-sm font-bold uppercase tracking-widest py-4">
                      Price Range (KES)
                    </AccordionTrigger>
                    <AccordionContent className="pt-6 px-2">
                      <Slider
                        defaultValue={[0, 2000000]}
                        max={2000000}
                        step={5000}
                        value={priceRange}
                        onValueChange={(val) =>
                          setPriceRange(val as [number, number])
                        }
                        className="mb-6"
                      />
                      <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
                        <span>{priceRange[0].toLocaleString()}</span>
                        <span>{priceRange[1].toLocaleString()}</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex items-center space-x-2 pt-4">
                  <Checkbox
                    id="stock"
                    checked={inStockOnly}
                    onCheckedChange={(checked) => setInStockOnly(!!checked)}
                  />
                  <label
                    htmlFor="stock"
                    className="text-sm font-bold uppercase tracking-widest text-white/60 cursor-pointer"
                  >
                    In Stock Only
                  </label>
                </div>
              </div>
            </aside>

            {/* Product List */}
            <main className="flex-1">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-white/30">
                  {filteredProducts.length} Results
                </p>
                <div className="flex gap-4">
                  {/* Sort dropdown could go here */}
                </div>
              </div>

              <div className="space-y-0">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <motion.article
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{
                        duration: 0.6,
                        delay: Math.min(index * 0.05, 0.3),
                      }}
                      className="group relative py-16 border-b border-white/5 last:border-0"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">
                        {/* Product Image Section */}
                        <div className="relative aspect-square md:aspect-[4/5] overflow-hidden bg-white/[0.02] rounded-2xl group-hover:bg-white/[0.04] transition-colors duration-500">
                          <img
                            src={
                              product.images?.[0] ||
                              'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800'
                            }
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />

                          {/* Dynamic Badges */}
                          <div className="absolute top-6 left-6 flex flex-col gap-2">
                            <Badge
                              variant="secondary"
                              className="bg-black/60 backdrop-blur-md border-white/10 text-[10px] uppercase tracking-widest px-3"
                            >
                              {CATEGORY_LABELS[product.category] ||
                                product.category}
                            </Badge>
                            {product.brand && (
                              <Badge className="bg-primary/20 text-primary border-primary/20 text-[10px] uppercase tracking-widest px-3">
                                {product.brand}
                              </Badge>
                            )}
                          </div>

                          {product.stock_quantity === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                              <span className="rounded-full border border-red-500/30 bg-red-500/10 px-6 py-2 text-xs font-bold uppercase tracking-widest text-red-300">
                                Direct Order Only
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Info Section */}
                        <div className="flex flex-col h-full">
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between items-start gap-4">
                                <h3 className="text-3xl md:text-4xl font-semibold text-white/90 group-hover:text-primary transition-colors duration-300">
                                  {product.name}
                                </h3>
                                <div className="text-2xl font-bold text-white/95 whitespace-nowrap">
                                  KES {product.price.toLocaleString()}
                                </div>
                              </div>
                              <p className="mt-4 text-white/50 text-lg leading-relaxed max-w-2xl">
                                {product.description ||
                                  'Premium solar component engineered for high-efficiency energy systems.'}
                              </p>
                            </div>

                            {/* Quick Specs */}
                            {(() => {
                              const specs = Array.isArray(
                                product.specifications
                              )
                                ? product.specifications
                                : typeof product.specifications === 'object' &&
                                    product.specifications !== null
                                  ? Object.entries(product.specifications).map(
                                      ([k, v]) => `${k}: ${v}`
                                    )
                                  : [];

                              if (specs.length === 0) return null;

                              return (
                                <div className="grid grid-cols-2 gap-x-8 gap-y-4 pt-4">
                                  {specs.slice(0, 4).map((spec, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-3"
                                    >
                                      <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                                      <span className="text-xs uppercase tracking-wider text-white/40 font-medium">
                                        {spec}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}

                            {/* Technical Highlights if available */}
                            {product.technical_specs && (
                              <div className="flex flex-wrap gap-3 pt-4">
                                {Object.entries(product.technical_specs).map(
                                  ([key, value]) => (
                                    <div
                                      key={key}
                                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
                                    >
                                      <span className="text-[10px] block text-white/30 uppercase tracking-widest font-bold mb-0.5">
                                        {key}
                                      </span>
                                      <span className="text-xs text-white/70 font-mono">
                                        {String(value)}
                                      </span>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="mt-auto pt-12 flex flex-wrap gap-4">
                            <Button
                              onClick={() => addToCart(product.id)}
                              disabled={product.stock_quantity === 0}
                              size="lg"
                              className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs cursor-pointer disabled:cursor-not-allowed disabled:bg-primary/50 disabled:text-primary-foreground/70 transition-colors"
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))
                ) : (
                  <div className="py-40 text-center">
                    <Info className="h-12 w-12 text-white/10 mx-auto mb-6" />
                    <h3 className="text-xl font-medium text-white/60 mb-2">
                      No products found
                    </h3>
                    <p className="text-white/30">
                      Try adjusting your filters to find what you&apos;re
                      looking for.
                    </p>
                    <Button
                      variant="link"
                      onClick={clearFilters}
                      className="mt-4 text-primary"
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
