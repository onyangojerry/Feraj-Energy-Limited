import { useState } from 'react';
import { directors } from '@/app/data/teamData';
import { ChevronDown, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Team() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  return (
    <div className="min-h-screen text-white/86">
      <section className="relative min-h-[40vh] flex items-center py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(49,209,122,0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(73,201,255,0.12),transparent_45%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <p className="cinematic-eyebrow mb-4">Leadership • Chapter 05</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white/92 mb-6">
            Leadership Team
          </h1>
          <p className="text-xl max-w-3xl text-white/60 leading-relaxed">
            Meet the visionary leaders driving innovation and sustainability at
            Feraj Solar Limited
          </p>
        </div>
      </section>

      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-20">
            <h2 className="text-4xl font-bold mb-6 text-white/92">
              Directors & Executive Team
            </h2>
            <p className="text-xl text-white/50 max-w-2xl">
              Decades of combined experience in renewable energy, technology,
              and business leadership
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {directors.map((member) => (
              <div key={member.id} className="group animate-reveal">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                    style={{ objectPosition: 'center 20%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {member.name}
                    </h3>
                    <div className="text-primary font-semibold text-sm uppercase tracking-wider">
                      {member.position}
                    </div>
                  </div>
                </div>

                <div className="mt-6 px-2">
                  <p className="text-white/60 mb-6 leading-relaxed line-clamp-3 text-sm">
                    {member.bio}
                  </p>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenIds((prev) => ({
                          ...prev,
                          [member.id]: !prev[member.id],
                        }))
                      }
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors"
                      aria-expanded={!!openIds[member.id]}
                    >
                      {openIds[member.id] ? 'Less' : 'More'}
                      <ChevronDown
                        className={`h-3 w-3 transition-transform ${
                          openIds[member.id] ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <div className="flex gap-4">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          className="text-white/40 hover:text-primary transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      <a
                        href={`mailto:${member.name.toLowerCase().replace(/ /g, '.')}@ferajsolar.com`}
                        className="text-white/40 hover:text-accent transition-colors"
                        aria-label="Email"
                      >
                        <Mail className="h-5 w-5" />
                      </a>
                    </div>
                  </div>

                  <div
                    className={`mt-6 overflow-hidden transition-all duration-500 ease-in-out ${
                      openIds[member.id]
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-sm text-white/50 leading-relaxed italic">
                        &quot;{member.bio}&quot;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white/92">
                Join Our Team
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mb-10 leading-relaxed">
                We&apos;re always looking for talented individuals passionate
                about clean energy and sustainability. Join us in shaping the
                future of power in East Africa.
              </p>
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary/10 border border-primary/40 text-white rounded-lg hover:bg-primary transition-all font-bold uppercase tracking-widest text-sm cursor-pointer"
              >
                View Open Positions
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="border-l-2 border-primary/20 pl-6 py-2">
                <div className="text-4xl font-bold text-primary mb-2">
                  5+
                </div>
                <div className="text-xs uppercase tracking-widest text-white/40 font-semibold">
                  Team Members
                </div>
              </div>
              <div className="border-l-2 border-accent/20 pl-6 py-2">
                <div className="text-4xl font-bold text-accent mb-2">45+</div>
                <div className="text-xs uppercase tracking-widest text-white/40 font-semibold">
                  Nationalities
                </div>
              </div>
              <div className="border-l-2 border-primary/20 pl-6 py-2">
                <div className="text-4xl font-bold text-primary mb-2">
                  4.9/5
                </div>
                <div className="text-xs uppercase tracking-widest text-white/40 font-semibold">
                  Satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
