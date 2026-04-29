import {
  Target,
  Eye,
  Award,
  Users,
  Globe,
  Lightbulb,
  Zap,
  Leaf,
} from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="space-y-6 animate-reveal-up-soft">
            <h1 className="text-6xl md:text-7xl font-bold text-white/92">
              About Feraj Solar
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl text-white/64 leading-relaxed">
              Dedicated to delivering reliable, affordable & sustainable power
              solutions across East Africa through innovative solar technology
              and expert installation.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Mission */}
            <div
              className="animate-reveal"
              style={{ '--reveal-delay': '0.1s' } as any}
            >
              <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center mb-8">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-6 text-white/92">
                Our Mission
              </h2>
              <p className="text-xl text-white/60 leading-relaxed">
                To deliver innovative and accessible solar energy solutions that
                empower homes, businesses, and communities across East Africa,
                while promoting environmental sustainability and energy
                independence.
              </p>
            </div>

            {/* Vision */}
            <div
              className="animate-reveal"
              style={{ '--reveal-delay': '0.2s' } as any}
            >
              <div className="h-14 w-14 bg-accent/10 rounded-full flex items-center justify-center mb-8">
                <Eye className="h-7 w-7 text-accent" />
              </div>
              <h2 className="text-3xl font-bold mb-6 text-white/92">
                Our Vision
              </h2>
              <p className="text-xl text-white/60 leading-relaxed">
                The leading provider of sustainable energy solutions across East
                Africa, transforming lives and industries through reliable,
                clean, and affordable solar power.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-32 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <div className="space-y-12 animate-reveal">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white/92">
                  What We Do
                </h2>
                <p className="text-xl text-white/60 leading-relaxed">
                  Feraj Solar Limited is a comprehensive solar energy solutions
                  provider serving East Africa. We operate as solar importers,
                  contractors, and vendors—delivering complete end-to-end solar
                  installations.
                </p>
              </div>

              <div className="space-y-10">
                <div className="flex gap-6 items-start">
                  <div className="mt-1 h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white/92 mb-3">
                      Solar Installation
                    </h3>
                    <p className="text-white/60 leading-relaxed">
                      Professional installation of solar systems for homes,
                      businesses, and manufacturing industries
                    </p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="mt-1 h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-accent/10">
                    <Leaf className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white/92 mb-3">
                      Energy Independence
                    </h3>
                    <p className="text-white/60 leading-relaxed">
                      Empowering communities through off-grid solar solutions
                      for long-term savings and independence
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="border-l border-white/10 pl-12 py-4 animate-reveal"
              style={{ '--reveal-delay': '0.2s' } as any}
            >
              <h3 className="text-2xl font-bold mb-10 text-white/92">
                Why Choose Feraj?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
                <div>
                  <h4 className="text-primary mb-3 font-semibold uppercase tracking-wider text-sm">
                    Quality First
                  </h4>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Industry-leading components and expert installation ensure
                    maximum efficiency
                  </p>
                </div>
                <div>
                  <h4 className="text-accent mb-3 font-semibold uppercase tracking-wider text-sm">
                    Innovation Driven
                  </h4>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Latest solar technology adapted for East African climate and
                    conditions
                  </p>
                </div>
                <div>
                  <h4 className="text-primary mb-3 font-semibold uppercase tracking-wider text-sm">
                    Customer Focused
                  </h4>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Dedicated support from consultation through installation and
                    beyond
                  </p>
                </div>
                <div>
                  <h4 className="text-accent mb-3 font-semibold uppercase tracking-wider text-sm">
                    Sustainable Impact
                  </h4>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Every installation contributes to environmental conservation
                    and energy independence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 animate-reveal">
              <h2 className="text-4xl md:text-5xl font-bold text-white/92">
                Our Story
              </h2>
              <div className="space-y-6 text-lg text-white/60 leading-relaxed">
                <p>
                  Feraj Solar Limited was founded with a vision to transform
                  energy access across East Africa. We recognized that reliable,
                  affordable solar power could empower communities and
                  industries while protecting our environment.
                </p>
                <p>
                  What started as a commitment to quality and innovation has
                  grown into a trusted solar solutions provider across the
                  region. We believe in the power of solar energy to create
                  lasting change—not just in energy access, but in the lives and
                  livelihoods of every community we serve.
                </p>
              </div>
            </div>
            <div
              className="relative animate-reveal"
              style={{ '--reveal-delay': '0.2s' } as any}
            >
              <div className="absolute -inset-4 bg-primary/5 rounded-2xl blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1758518732175-5d608ba3abdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY4ODkzMjA5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Team"
                className="relative rounded-2xl w-full h-[480px] object-cover border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-reveal">
            <h2 className="text-4xl md:text-5xl font-bold text-white/92 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Principles that guide every decision we make in our journey toward
              a greener future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                icon: Lightbulb,
                title: 'Innovation',
                description:
                  'Cutting-edge technology adapted for East African conditions and community needs',
                accent: 'text-primary',
                delay: '0s',
              },
              {
                icon: Leaf,
                title: 'Sustainability',
                description:
                  'Environmental responsibility in every product, installation, and partnership',
                accent: 'text-accent',
                delay: '0.1s',
              },
              {
                icon: Award,
                title: 'Quality',
                description:
                  'Uncompromising standards in materials, installation, and customer service',
                accent: 'text-primary',
                delay: '0.2s',
              },
              {
                icon: Users,
                title: 'Community Focus',
                description:
                  'Empowering lives through accessible energy and long-term value',
                accent: 'text-accent',
                delay: '0.3s',
              },
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <div
                  key={idx}
                  className="animate-reveal text-center"
                  style={{ '--reveal-delay': value.delay } as any}
                >
                  <div
                    className={`h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-white/5 border border-white/10`}
                  >
                    <Icon className={`h-8 w-8 ${value.accent}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white/92">
                    {value.title}
                  </h3>
                  <p className="text-white/50 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-24 text-white/92 animate-reveal">
            Milestones
          </h2>

          <div className="space-y-16 max-w-4xl mx-auto">
            {[
              {
                year: '2024',
                title: 'East Africa Leadership',
                description:
                  'Expanded operations across Kenya, Uganda, and Tanzania with regional distribution hubs',
                delay: '0s',
              },
              {
                year: '2023',
                title: 'Innovation in Energy Storage',
                description:
                  'Launched advanced battery storage solutions with real-time monitoring and off-grid optimization',
                delay: '0.1s',
              },
              {
                year: '2021',
                title: 'Contractor Network Growth',
                description:
                  'Established certified installer network across East Africa ensuring quality installations',
                delay: '0.2s',
              },
              {
                year: '2019',
                title: 'Market Leadership',
                description:
                  'Became trusted solar provider across East African region with thousands of installations',
                delay: '0.3s',
              },
              {
                year: '2016',
                title: 'Company Establishment',
                description:
                  'Founded with vision to transform East Africa through accessible solar energy',
                delay: '0.4s',
              },
            ].map((milestone, idx) => (
              <div
                key={idx}
                className="group flex gap-12 items-start animate-reveal"
                style={{ '--reveal-delay': milestone.delay } as any}
              >
                <div className="flex-shrink-0 w-24 pt-2">
                  <div className="text-3xl font-bold text-primary/40 group-hover:text-primary transition-colors">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1 border-l-2 border-white/10 pl-12 pb-2">
                  <h3 className="text-2xl font-bold mb-3 text-white/92 group-hover:text-primary transition-colors">
                    {milestone.title}
                  </h3>
                  <p className="text-lg text-white/50 leading-relaxed">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white/92 animate-reveal-up-soft">
            Join the Clean Energy Revolution
          </h2>
          <p
            className="text-xl text-white/64 mb-8 leading-relaxed animate-reveal-up-soft"
            style={{ animationDelay: '0.1s' }}
          >
            Whether you&apos;re a homeowner, business owner, or industrial
            facility, Feraj Solar is here to help you transition to clean,
            sustainable energy.
          </p>
          <a
            href="/products"
            className="inline-block px-8 py-4 border border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-semibold transition-colors animate-reveal-up-soft"
            style={{ animationDelay: '0.2s' }}
          >
            Explore Our Solutions
          </a>
        </div>
      </section>
    </div>
  );
}
