import { Building2, Handshake, Globe2, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Partnerships() {
  const partners = [
    {
      name: 'CDG International Group',
      type: 'Strategic Partner',
      description:
        'Make the world more connectible, Make the cities more livable',
      details: {
        website: 'www.cdg.com.cn',
        address: 'No.9 Ziyun Avenue, Nanjing, Jiangsu Province, China',
        postalCode: '210014',
        switchboard: '+86-25-88018888',
        fax: '+86-25-84405744',
        about:
          'Founded in 1960, CDG International Group is a leading full-service engineering consulting and technology provider in China, focusing on transportation and urban-rural infrastructure. With over 6200 employees and a global presence, CDG is committed to creating a more connectible world and promoting livable cities.',
        mission:
          'To create a more connectible world and promote more livable cities. Aims to create exceptional value for customers through excellent technologies and impeccable services.',
        vision:
          'To become a top provider of technologies and services in transportation development and urban construction industries.',
      },
    },
    {
      name: 'Google',
      type: 'Data Analytics',
      description: 'AI-powered energy optimization',
    },
    {
      name: 'Microsoft Azure',
      type: 'Cloud Services',
      description: 'IoT and monitoring platform',
    },
    {
      name: 'LG Electronics',
      type: 'Manufacturing',
      description: 'Solar panel production',
    },
    {
      name: 'Schneider Electric',
      type: 'Distribution',
      description: 'Global supply chain',
    },
    { name: 'ABB', type: 'Automation', description: 'Smart grid technology' },
  ];

  return (
    <div className="min-h-screen text-white/86">
      <section className="relative min-h-[40vh] flex items-center py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(73,201,255,0.12),transparent_38%),radial-gradient(circle_at_75%_80%,rgba(49,209,122,0.1),transparent_42%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <p className="cinematic-eyebrow mb-6">Collaboration • Chapter 07</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white/92 mb-8">
            Strategic Partnerships
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-white/60 leading-relaxed">
            Collaborating with industry leaders to deliver comprehensive solar
            solutions and drive global clean energy adoption
          </p>
        </div>
      </section>

      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24 animate-reveal">
            <h2 className="text-4xl font-bold mb-6 text-white/92">
              Why Partner With Us
            </h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Building the future of energy together through global innovation
              and trusted expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-32">
            <div
              className="text-center animate-reveal"
              style={{ '--reveal-delay': '0s' } as any}
            >
              <div className="h-16 w-16 bg-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-accent/20">
                <Globe2 className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white/90">
                Global Reach
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Operations in 60+ countries across 6 continents
              </p>
            </div>

            <div
              className="text-center animate-reveal"
              style={{ '--reveal-delay': '0.1s' } as any}
            >
              <div className="h-16 w-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-primary/20">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white/90">
                Industry Leader
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                3+ years of solar innovation excellence
              </p>
            </div>

            <div
              className="text-center animate-reveal"
              style={{ '--reveal-delay': '0.2s' } as any}
            >
              <div className="h-16 w-16 bg-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-accent/20">
                <Building2 className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white/90">
                Enterprise Scale
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                50+ installations generating 2.5GW capacity
              </p>
            </div>

            <div
              className="text-center animate-reveal"
              style={{ '--reveal-delay': '0.3s' } as any}
            >
              <div className="h-16 w-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-primary/20">
                <Handshake className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white/90">
                Trusted Partner
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                98% customer satisfaction and retention
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="group border-l-2 border-white/10 pl-8 pb-10 transition-all hover:border-primary animate-reveal"
                style={{ '--reveal-delay': `${idx * 0.05}s` } as any}
              >
                <div className="text-primary text-xs font-bold uppercase tracking-widest mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  {partner.type}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white/90 group-hover:text-white transition-colors">
                  {partner.name}
                </h3>
                <p className="text-white/50 leading-relaxed text-sm">
                  {partner.description}
                </p>

                {/* CDG Details - Conditionally render */}
                {partner.name === 'CDG International Group' &&
                  partner.details && (
                    <div className="mt-6 text-left text-sm text-white/50 leading-relaxed space-y-2">
                      <p>{partner.details.about}</p>
                      <p className="font-semibold text-white/70">
                        Mission: {partner.details.mission}
                      </p>
                      <p className="font-semibold text-white/70">
                        Vision: {partner.details.vision}
                      </p>
                      <p>
                        Website:{' '}
                        <a
                          href={`http://${partner.details.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {partner.details.website}
                        </a>
                      </p>
                      <p>Address: {partner.details.address}</p>
                      <p>
                        Switchboard: {partner.details.switchboard} | Fax:{' '}
                        {partner.details.fax}
                      </p>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-reveal">
          <h2 className="text-4xl font-bold mb-8 text-white/92">
            Become a Partner
          </h2>
          <p className="text-xl text-white/50 mb-10 leading-relaxed">
            Join our network of innovators, manufacturers, and distributors
            shaping the future of renewable energy in East Africa.
          </p>
          <Link
            to="/partnership-request"
            className="inline-block px-10 py-4 bg-primary/10 border border-primary/40 text-primary rounded-lg hover:bg-primary text-white transition-all font-bold uppercase tracking-widest text-sm cursor-pointer"
          >
            Contact Partnership Team
          </Link>
        </div>
      </section>
    </div>
  );
}
