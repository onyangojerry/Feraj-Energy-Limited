import React, { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import {
  Mail,
  Phone,
  Linkedin,
  Building2,
  Target,
  Award,
  ArrowRight,
  Globe2,
} from 'lucide-react';

interface PartnershipFormData {
  companyName: string;
  website: string;
  industry: string;
  country: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessDescription: string;
  expertise: string;
  partnershipAlignment: string;
  yearsInBusiness: number;
}

export function PartnershipRequest() {
  const [formData, setFormData] = useState<PartnershipFormData>({
    companyName: '',
    website: '',
    industry: '',
    country: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessDescription: '',
    expertise: '',
    partnershipAlignment: '',
    yearsInBusiness: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'yearsInBusiness' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.companyName ||
      !formData.website ||
      !formData.email ||
      !formData.contactPerson ||
      !formData.industry ||
      !formData.country ||
      !formData.businessDescription ||
      !formData.expertise ||
      !formData.partnershipAlignment ||
      formData.yearsInBusiness <= 0
    ) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('partnership_requests').insert([
        {
          company_name: formData.companyName,
          website: formData.website,
          industry: formData.industry,
          country: formData.country,
          contact_person: formData.contactPerson,
          email: formData.email,
          phone: formData.phone || null,
          business_description: formData.businessDescription,
          expertise: formData.expertise,
          partnership_alignment: formData.partnershipAlignment,
          years_in_business: formData.yearsInBusiness,
        },
      ]);

      if (error) throw error;

      toast.success(
        'Thank you for your partnership interest! We will review your submission and get back to you shortly.'
      );
      setFormData({
        companyName: '',
        website: '',
        industry: '',
        country: '',
        contactPerson: '',
        email: '',
        phone: '',
        businessDescription: '',
        expertise: '',
        partnershipAlignment: '',
        yearsInBusiness: 0,
      });
    } catch (error: any) {
      console.error('Error submitting partnership request:', error);
      toast.error(
        error.message ||
          'Failed to submit your request. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white/86">
      <section className="relative min-h-[30vh] flex items-center py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(73,201,255,0.12),transparent_38%),radial-gradient(circle_at_75%_80%,rgba(49,209,122,0.1),transparent_42%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <p className="cinematic-eyebrow mb-6">Partnership • Connect</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white/92 mb-8">
            Partner With Us
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-white/60 leading-relaxed">
            Join us in building a sustainable energy future. We are looking for
            strategic partners who share our vision and commitment to innovation
            and excellence.
          </p>
        </div>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-start">
            {/* Contact Info Sidebar */}
            <aside className="lg:sticky lg:top-24 space-y-12">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-white/92">
                  Get in Touch
                </h2>
                <p className="text-white/60 leading-relaxed mb-8">
                  Interested in collaborating with Feraj Solar? Fill out the
                  form below, and our partnership team will review your request.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Building2 className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-white/70">
                        Company Name
                      </p>
                      <p className="text-white/50 text-sm">Feraj Solar</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Target className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-white/70">
                        Industry
                      </p>
                      <p className="text-white/50 text-sm">
                        Solar Energy & Renewable Technologies
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Globe2 className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-white/70">
                        Country
                      </p>
                      <p className="text-white/50 text-sm">Kenya</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-white/70">
                        Email
                      </p>
                      <p className="text-white/50 text-sm">
                        partnerships@ferajsolar.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-white/70">
                        Phone
                      </p>
                      <p className="text-white/50 text-sm"> +254720944707</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-12">
                <h3 className="text-xl font-bold mb-6 text-white/92">
                  Follow Us
                </h3>
                <div className="flex space-x-6">
                  <a
                    href="#"
                    className="text-white/50 hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                  <a
                    href="#"
                    className="text-white/50 hover:text-primary transition-colors"
                  >
                    <Mail className="h-6 w-6" />
                  </a>
                  <a
                    href="#"
                    className="text-white/50 hover:text-primary transition-colors"
                  >
                    <Award className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </aside>

            {/* Partnership Request Form */}
            <main className="cinematic-panel p-8 lg:p-12">
              <h2 className="text-3xl font-bold mb-8 text-white/92">
                Submit Your Partnership Proposal
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <fieldset className="border border-white/10 rounded-lg p-6">
                  <legend className="text-primary font-semibold uppercase tracking-wider text-xs px-2 mb-4">
                    Company Details
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="companyName"
                        className="block text-sm font-medium text-white/70 mb-2"
                      >
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 focus:border-primary/30"
                        placeholder="e.g., Solar Solutions Inc."
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="website"
                        className="block text-sm font-medium text-white/70 mb-2"
                      >
                        Website *
                      </label>
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 focus:border-primary/30"
                        placeholder="https://www.example.com"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="industry"
                        className="block text-sm font-medium text-white/70 mb-2"
                      >
                        Industry *
                      </label>
                      <input
                        type="text"
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 focus:border-primary/30"
                        placeholder="e.g., Renewable Energy, Manufacturing"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-white/70 mb-2"
                      >
                        Country *
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 focus:border-primary/30"
                        placeholder="e.g., Kenya"
                        required
                      />
                    </div>
                  </div>
                </fieldset>

                <fieldset className="border border-white/10 rounded-lg p-6">
                  <legend className="text-primary font-semibold uppercase tracking-wider text-xs px-2 mb-4">
                    Contact Information
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="contactPerson"
                        className="block text-sm font-medium text-white/70 mb-2"
                      >
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        id="contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 focus:border-primary/30"
                        placeholder="e.g., Jane Doe"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white/70 mb-2"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 focus:border-primary/30"
                        placeholder="e.g., jane.doe@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-white/70 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 focus:border-primary/30"
                        placeholder="e.g., +254 700 123456"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="yearsInBusiness"
                        className="block text-sm font-medium text-white/70 mb-2"
                      >
                        Years in Business *
                      </label>
                      <input
                        type="number"
                        id="yearsInBusiness"
                        name="yearsInBusiness"
                        value={formData.yearsInBusiness}
                        onChange={handleChange}
                        min="1"
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 focus:border-primary/30"
                        placeholder="e.g., 10"
                        required
                      />
                    </div>
                  </div>
                </fieldset>

                <fieldset className="border border-white/10 rounded-lg p-6">
                  <legend className="text-primary font-semibold uppercase tracking-wider text-xs px-2 mb-4">
                    Your Business & Expertise
                  </legend>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="businessDescription"
                        className="block text-sm font-medium text-white/70 mb-2"
                      >
                        Describe your business briefly *
                      </label>
                      <textarea
                        id="businessDescription"
                        name="businessDescription"
                        value={formData.businessDescription}
                        onChange={handleChange}
                        rows={4}
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 focus:border-primary/30"
                        placeholder="Tell us about your company's focus and scale..."
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="expertise"
                        className="block text-sm font-medium text-white/70 mb-2"
                      >
                        Areas of Expertise *
                      </label>
                      <textarea
                        id="expertise"
                        name="expertise"
                        value={formData.expertise}
                        onChange={handleChange}
                        rows={3}
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 focus:border-primary/30"
                        placeholder="List your key strengths, e.g., solar panel manufacturing, installation services, R&D in battery technology..."
                        required
                      />
                    </div>
                  </div>
                </fieldset>

                <fieldset className="border border-white/10 rounded-lg p-6">
                  <legend className="text-primary font-semibold uppercase tracking-wider text-xs px-2 mb-4">
                    Why You're a Great Partner
                  </legend>
                  <div>
                    <label
                      htmlFor="partnershipAlignment"
                      className="block text-sm font-medium text-white/70 mb-2"
                    >
                      How do you align with Feraj Solar's mission and values? *
                    </label>
                    <textarea
                      id="partnershipAlignment"
                      name="partnershipAlignment"
                      value={formData.partnershipAlignment}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 focus:border-primary/30"
                      placeholder="Explain why your company would be a valuable partner, e.g., shared commitment to sustainability, complementary technologies, market access..."
                      required
                    />
                  </div>
                </fieldset>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center gap-2 rounded-md bg-primary px-6 py-3 text-lg font-bold text-primary-foreground transition-all duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Submitting...'
                    : 'Submit Partnership Proposal'}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
