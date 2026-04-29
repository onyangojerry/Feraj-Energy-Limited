import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Briefcase, MapPin, Building, Clock, ArrowLeft, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  description: string;
  requirements?: string;
  responsibilities?: string;
  salary_range?: string;
  status: string;
  created_at: string;
}

const typeLabels = {
  'full-time': { label: 'Full Time', color: 'bg-green-400/10 text-green-400' },
  'part-time': { label: 'Part Time', color: 'bg-blue-400/10 text-blue-400' },
  'contract': { label: 'Contract', color: 'bg-purple-400/10 text-purple-400' },
  'internship': { label: 'Internship', color: 'bg-yellow-400/10 text-yellow-400' },
};

export function Careers() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    applicant_name: '',
    email: '',
    phone: '',
    cover_letter: '',
    resume_url: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error: any) {
      toast.error('Failed to load job postings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job: JobPosting) => {
    setSelectedJob(job);
    setIsApplying(true);
    setFormData({
      applicant_name: '',
      email: '',
      phone: '',
      cover_letter: '',
      resume_url: '',
    });
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.applicant_name || !formData.email || !formData.cover_letter) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert([
          {
            job_id: selectedJob?.id,
            applicant_name: formData.applicant_name,
            email: formData.email,
            phone: formData.phone || null,
            cover_letter: formData.cover_letter,
            resume_url: formData.resume_url || null,
          },
        ]);

      if (error) throw error;

      toast.success('Application submitted successfully! We will review your application and get back to you.');
      setIsApplying(false);
      setSelectedJob(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit application');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white/86">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm text-white/72">
            Loading careers...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white/86">
      <section className="relative min-h-[30vh] flex items-center py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(73,201,255,0.12),transparent_38%),radial-gradient(circle_at_75%_80%,rgba(49,209,122,0.1),transparent_42%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold text-white/92">
              Careers at Feraj Solar
            </h1>
          </div>
          <p className="text-xl text-white/50 max-w-2xl leading-relaxed">
            Join our team and help us build a sustainable energy future. 
            We're always looking for talented individuals to grow with us.
          </p>
        </div>
      </section>

      <section className="py-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-white/20" />
              <p className="text-white/50">No open positions at the moment.</p>
              <p className="text-sm text-white/30 mt-2">Please check back later for new opportunities.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm text-white/40 uppercase tracking-widest font-semibold">
                {jobs.length} Open Position{jobs.length !== 1 ? 's' : ''}
              </p>
              
              {jobs.map((job) => {
                const typeConfig = typeLabels[job.type];
                return (
                  <div
                    key={job.id}
                    className="border border-white/10 rounded-2xl bg-white/[0.02] p-6 md:p-8 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white/90 mb-2">{job.title}</h2>
                        <div className="flex flex-wrap gap-3 text-sm text-white/50">
                          <span className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
                            {typeConfig.label}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleApply(job)}
                        className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium whitespace-nowrap"
                      >
                        <Send className="h-4 w-4" />
                        Apply Now
                      </button>
                    </div>

                    <div className="prose prose-invert prose-sm max-w-none prose-p:text-white/60 prose-headings:text-white/90">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {job.description}
                      </ReactMarkdown>
                    </div>

                    {job.salary_range && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-sm text-white/50">
                          <strong className="text-white/70">Salary Range:</strong> {job.salary_range}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Application Modal */}
      {isApplying && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c12] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white/92">Apply for {selectedJob.title}</h2>
                <p className="text-sm text-white/50 mt-1">{selectedJob.department} • {selectedJob.location}</p>
              </div>
              <button
                onClick={() => {
                  setIsApplying(false);
                  setSelectedJob(null);
                }}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <X className="h-5 w-5 text-white/50" />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.applicant_name}
                  onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35"
                    placeholder="+254 700 000 000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Cover Letter *</label>
                <textarea
                  value={formData.cover_letter}
                  onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                  rows={6}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 font-mono text-sm"
                  placeholder="Tell us why you're the perfect fit for this role..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Resume URL</label>
                <input
                  type="url"
                  value={formData.resume_url}
                  onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35"
                  placeholder="https://drive.google.com/file/your-resume"
                />
                <p className="text-xs text-white/30 mt-1">Provide a link to your resume (Google Drive, Dropbox, etc.)</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsApplying(false);
                    setSelectedJob(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
