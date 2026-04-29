import { Link } from 'react-router-dom';
import { useRef } from 'react';
import {
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Award,
  Leaf,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ChapterItem {
  icon: typeof Zap;
  title: string;
  text: string;
}

interface GalleryItem {
  src: string;
  label: string;
}

function ChaptersVertical({ chapters }: { chapters: ChapterItem[] }) {
  const containerRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0.08, 0.2, 0.8, 0.92],
    [0, 1, 1, 0]
  );
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={containerRef} className="relative py-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(49,209,122,0.08),transparent_50%),radial-gradient(circle_at_80%_50%,rgba(73,201,255,0.06),transparent_50%)]" />

      <motion.div
        style={{ opacity, y }}
        className="mx-auto max-w-[var(--section-max-width)] px-6 relative"
      >
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-semibold leading-tight text-white/92 lg:text-6xl lg:leading-[1.1]">
            Built different.
            <br />
            <span className="text-primary">Built to last.</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base text-white/52">
            Every component, every decision, every detail is engineered for one
            purpose — delivering reliable, clean energy that performs for
            decades.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-[19px] top-8 bottom-8 w-px bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 lg:left-[139px]" />

          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="relative grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 py-6"
            >
              <div className="flex items-start gap-6 lg:justify-end">
                <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-background border border-white/12 flex items-center justify-center shadow-[0_0_20px_rgba(49,209,122,0.2)]">
                  <chapter.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-white/92 pt-1">
                  {chapter.title}
                </h3>
              </div>
              <p className="text-lg text-white/62 leading-relaxed pt-2">
                {chapter.text}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-6 py-2.5 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary/20 hover:border-primary/60"
          >
            Explore Our Solutions <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

function GallerySection({ items }: { items: GalleryItem[] }) {
  const containerRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0.1, 0.25, 0.75, 0.9],
    [0, 1, 1, 0]
  );
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={containerRef} className="relative py-20">
      <motion.div
        style={{ opacity, y }}
        className="mx-auto max-w-[var(--section-max-width)] px-6"
      >
        <h2 className="text-center text-3xl font-semibold text-white/92 lg:text-4xl">
          Our solutions in action
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12">
          {items.map((item, index) => (
            <motion.figure
              key={item.label}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 ${
                index === 0
                  ? 'md:col-span-7 md:row-span-2 h-[340px] md:h-[520px]'
                  : 'md:col-span-5 h-[250px]'
              }`}
            >
              <img
                src={item.src}
                alt={item.label}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,12,0.08)_0%,rgba(8,8,12,0.72)_88%)]" />
              <figcaption className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-xs uppercase tracking-[0.13em] text-white/50">
                  Scene
                </p>
                <p className="mt-1 text-lg font-semibold text-white/90">
                  {item.label}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export function Home() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroProgress, scrollY } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });

  const heroImageScale = useTransform(heroProgress, [0, 1], [1.08, 1]);
  const heroImageY = useTransform(heroProgress, [0, 1], ['-5%', '8%']);
  const heroTitleY = useTransform(heroProgress, [0, 1], [0, -120]);
  const heroTitleOpacity = useTransform(heroProgress, [0, 0.6, 1], [1, 0.8, 0]);

  const chapters: ChapterItem[] = [
    {
      icon: Zap,
      title: 'Maximum Efficiency',
      text: 'Our panels deliver up to 24% efficiency with advanced PERC and bifacial technology, ensuring optimal generation in varied conditions.',
    },
    {
      icon: Shield,
      title: '30-Year Warranty',
      text: 'Industry-leading warranty coverage protects your investment with stable performance expectations over long production life cycles.',
    },
    {
      icon: TrendingUp,
      title: 'Smart Monitoring',
      text: 'Real-time production visibility and optimization-ready telemetry support better energy decisions from anywhere.',
    },
    {
      icon: Users,
      title: 'Expert Support',
      text: 'From consultation to installation and aftercare, certified teams keep delivery dependable and customer-centered.',
    },
    {
      icon: Award,
      title: 'Award Winning',
      text: 'Proven field performance and innovation milestones reflect a deep commitment to quality and measurable impact.',
    },
    {
      icon: Leaf,
      title: 'Carbon Neutral Impact',
      text: 'Every deployment helps offset emissions while advancing practical climate action at household and enterprise scales.',
    },
  ];

  const gallery: GalleryItem[] = [
    {
      src: 'https://images.unsplash.com/photo-1594373237925-5c674eda43b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGVuZXJneSUyMHJlbmV3YWJsZXxlbnwxfHx8fDE3Njg5NTcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      label: 'Field Installations',
    },
    {
      src: 'https://images.unsplash.com/photo-1723177548474-b58ada59986b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBvd2VyJTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc2ODkwODA2Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      label: 'Rooftop Systems',
    },
    {
      src: 'https://images.unsplash.com/photo-1487875961445-47a00398c267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY4OTI2MzYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      label: 'Grid Intelligence',
    },
  ];

   return (
    <div className="min-h-screen text-white/86">
      <section ref={heroRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.img
            src="https://images.unsplash.com/photo-1545209575-704d1434f9cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGVuZXJneXxlbnwxfHx8fDE3Njg4ODkxNzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Solar panels"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ scale: heroImageScale, y: heroImageY }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,12,0.2)_0%,rgba(8,8,12,0.58)_42%,rgba(8,8,12,0.9)_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(73,201,255,0.24),transparent_36%),radial-gradient(circle_at_85%_70%,rgba(49,209,122,0.2),transparent_42%)]" />

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
            style={{ y: heroTitleY, opacity: heroTitleOpacity }}
          >
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] text-white/92 sm:text-6xl lg:text-7xl">
              Energy Independence.
              <br />
              <span className="text-primary">Delivered.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/68">
              Stop renting energy. Start owning your power with systems built to
              perform for 30+ years.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-md border border-primary/35 bg-primary/90 px-8 py-3 font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary"
              >
                Shop Products <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/energy-stats"
                className="inline-flex items-center rounded-md border border-white/15 bg-white/6 px-8 py-3 font-semibold text-white/88 transition-all duration-300 hover:bg-white/12"
              >
                View Energy Stats
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="cinematic-section pt-12 pb-4">
        <div className="mx-auto max-w-[var(--section-max-width)] px-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/8" />
            </div>

            <div className="relative grid grid-cols-2 md:grid-cols-4">
              {[
                {
                  title: 'Proven Legacy',
                  value: '3+',
                  suffix: 'Years',
                  desc: 'Delivering solar excellence since 1999',
                },
                {
                  title: 'Trusted Nationwide',
                  value: '50',
                  suffix: '+',
                  desc: 'Complete projects across the world with a 4.9+/5 rating',
                },
                {
                  title: 'Customer First',
                  value: '98',
                  suffix: '%',
                  desc: 'Satisfaction rate across all reviews',
                },
                {
                  title: 'Clean Capacity',
                  value: '2.5',
                  suffix: 'GW',
                  desc: 'Renewable energy generated to date',
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="group relative flex flex-col items-center py-10"
                >
                  {index > 0 && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-white/8 md:hidden" />
                  )}
                  <p className="text-xs uppercase tracking-[0.16em] text-white/40 font-medium">
                    {stat.title}
                  </p>
                  <p className="mt-4 text-5xl md:text-6xl font-semibold text-primary">
                    {stat.value}
                    <span className="text-3xl md:text-4xl text-primary/70 ml-1">
                      {stat.suffix}
                    </span>
                  </p>
                  <p className="mt-3 text-sm text-white/48">{stat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ChaptersVertical chapters={chapters} />

      <GallerySection items={gallery} />

      <section className="py-16 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(49,209,122,0.12),transparent_60%)]" />

        <motion.div
          className="relative mx-auto max-w-[var(--section-max-width)] px-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-white/92">
            Take control of your <span className="text-primary">energy</span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-base text-white/52">
            Join thousands who've made the switch. Get a custom quote for your
            home or business today.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary/90"
            >
              Get a Quote <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/energy-stats"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-8 py-3 font-semibold text-white/70 transition-all duration-300 hover:bg-white/8"
            >
              See Our Impact
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
