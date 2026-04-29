import {
  Leaf,
  DollarSign,
  Home,
  Factory,
  TrendingDown,
  Shield,
} from 'lucide-react';

export function WhyGreen() {
  return (
    <div className="min-h-screen text-white/86">
      <section className="relative min-h-[40vh] flex items-center py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(49,209,122,0.15),transparent_40%),radial-gradient(circle_at_85%_75%,rgba(73,201,255,0.1),transparent_45%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <p className="cinematic-eyebrow mb-6">Sustainability • Chapter 06</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white/92 mb-8">
            Why Green Energy?
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-white/60 leading-relaxed">
            Understanding the environmental, economic, and social benefits of
            renewable energy for a sustainable future
          </p>
        </div>
      </section>

      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            <div className="animate-reveal">
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20">
                <Leaf className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white/92">
                Environmental Impact
              </h3>
              <ul className="space-y-4 text-white/50 leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-primary">•</span> Zero greenhouse gas
                  emissions
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span> Reduces air and water
                  pollution
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span> Conserves natural
                  resources
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span> Protects global
                  ecosystems
                </li>
              </ul>
            </div>

            <div
              className="animate-reveal"
              style={{ '--reveal-delay': '0.1s' } as any}
            >
              <div className="h-14 w-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-8 border border-accent/20">
                <DollarSign className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white/92">
                Economic Benefits
              </h3>
              <ul className="space-y-4 text-white/50 leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-accent">•</span> Lower electricity bills
                  long-term
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span> Hedge against rising
                  energy costs
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span> Increases property
                  value 3-4%
                </li>
                <li className="flex gap-3">
                  <span className="text-accent">•</span> Tax incentives and
                  rebates
                </li>
              </ul>
            </div>

            <div
              className="animate-reveal"
              style={{ '--reveal-delay': '0.2s' } as any}
            >
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-primary/20">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-6 text-white/92">
                Energy Independence
              </h3>
              <ul className="space-y-4 text-white/50 leading-relaxed">
                <li className="flex gap-3">
                  <span className="text-primary">•</span> Reduces fossil fuel
                  dependence
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span> Protects from grid
                  outages
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span> National energy
                  security
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">•</span> Self-sufficient power
                  generation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-reveal">
            <h2 className="text-4xl md:text-5xl font-bold text-white/92 mb-6">
              The Climate Crisis
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              The numbers driving the urgent global shift to renewables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div
              className="text-center animate-reveal"
              style={{ '--reveal-delay': '0s' } as any}
            >
              <div className="text-5xl font-bold text-red-500/80 mb-4">
                +1.1°C
              </div>
              <p className="text-sm uppercase tracking-widest text-white/40 font-semibold">
                Temperature Rise
              </p>
            </div>
            <div
              className="text-center animate-reveal"
              style={{ '--reveal-delay': '0.1s' } as any}
            >
              <div className="text-5xl font-bold text-orange-500/80 mb-4">
                37Gt
              </div>
              <p className="text-sm uppercase tracking-widest text-white/40 font-semibold">
                Annual CO₂ Emissions
              </p>
            </div>
            <div
              className="text-center animate-reveal"
              style={{ '--reveal-delay': '0.2s' } as any}
            >
              <div className="text-5xl font-bold text-accent/80 mb-4">
                419ppm
              </div>
              <p className="text-sm uppercase tracking-widest text-white/40 font-semibold">
                Atmospheric CO₂
              </p>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.02] rounded-3xl p-10 lg:p-16 animate-reveal">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h3 className="text-2xl font-bold mb-8 text-white/92 border-l-4 border-primary pl-6">
                  Household Impact
                </h3>
                <ul className="space-y-5 text-lg text-white/60 leading-relaxed">
                  <li className="flex gap-4">
                    <span className="text-primary font-bold">01</span>
                    Offsets 3-4 tons of CO₂ annually
                  </li>
                  <li className="flex gap-4">
                    <span className="text-primary font-bold">02</span>
                    Equivalent to planting 100 trees/year
                  </li>
                  <li className="flex gap-4">
                    <span className="text-primary font-bold">03</span>
                    Saves 200,000+ liters of water
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-8 text-white/92 border-l-4 border-accent pl-6">
                  Global Trajectory
                </h3>
                <ul className="space-y-5 text-lg text-white/60 leading-relaxed">
                  <li className="flex gap-4">
                    <span className="text-accent font-bold">01</span>
                    Solar capacity grew 22% in 2023
                  </li>
                  <li className="flex gap-4">
                    <span className="text-accent font-bold">02</span>
                    Costs dropped 90% since 2010
                  </li>
                  <li className="flex gap-4">
                    <span className="text-accent font-bold">03</span>
                    On track to 30% global energy by 2030
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="animate-reveal">
              <h2 className="text-4xl md:text-5xl font-bold mb-10 text-white/92">
                Applications
              </h2>
              <div className="space-y-10">
                <div className="flex gap-6 items-start group">
                  <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary transition-colors">
                    <Home className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-white/90">
                      Residential
                    </h4>
                    <p className="text-white/50 leading-relaxed">
                      Rooftop systems for homes, apartments, and communities
                      providing clean power
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 items-start group">
                  <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl bg-accent/10 group-hover:bg-accent transition-colors">
                    <Factory className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-white/90">
                      Commercial & Industrial
                    </h4>
                    <p className="text-white/50 leading-relaxed">
                      Large-scale installations reducing operational costs and
                      carbon footprint
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 items-start group">
                  <div className="h-12 w-12 shrink-0 flex items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary transition-colors">
                    <TrendingDown className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-white/90">
                      Utility-Scale
                    </h4>
                    <p className="text-white/50 leading-relaxed">
                      Solar farms generating megawatts of clean energy for the
                      grid
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="relative animate-reveal"
              style={{ '--reveal-delay': '0.2s' } as any}
            >
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1594373237925-5c674eda43b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGVuZXJneSUyMHJlbmV3YWJsZXxlbnwxfHx8fDE3Njg5NTcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Green energy"
                className="relative rounded-3xl border border-white/10 w-full aspect-square object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
