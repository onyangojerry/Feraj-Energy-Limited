import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Users,
  ArrowLeft,
  Save,
  X,
  MapPin,
  Building,
  Clock,
} from 'lucide-react';
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
  status: 'open' | 'closed' | 'draft';
  created_at: string;
  updated_at: string;
  application_count?: number;
}

interface JobApplication {
  id: string;
  job_id: string;
  applicant_name: string;
  email: string;
  phone?: string;
  cover_letter?: string;
  resume_url?: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'accepted' | 'rejected';
  created_at: string;
}

const typeLabels = {
  'full-time': 'Full Time',
  'part-time': 'Part Time',
  'contract': 'Contract',
  'internship': 'Internship',
};

const statusConfig = {
  open: { color: 'text-green-400', bg: 'bg-green-400/10', label: 'Open' },
  closed: { color: 'text-red-400', bg: 'bg-red-400/10', label: 'Closed' },
  draft: { color: 'text-gray-400', bg: 'bg-gray-400/10', label: 'Draft' },
};

export function JobPostings() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [viewingApplications, setViewingApplications] = useState<JobPosting | null>(null);
  const [viewingApplication, setViewingApplication] = useState<JobApplication | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time' as const,
    description: '',
    requirements: '',
    responsibilities: '',
    salary_range: '',
    status: 'draft' as const,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*, job_applications(count)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const jobsWithCount = data?.map(job => ({
        ...job,
        application_count: job.job_applications?.[0]?.count || 0,
      })) || [];
      
      setJobs(jobsWithCount);
    } catch (error: any) {
      toast.error('Failed to fetch job postings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch applications');
      console.error(error);
    }
  };

  const handleCreateNew = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      type: 'full-time',
      description: '',
      requirements: '',
      responsibilities: '',
      salary_range: '',
      status: 'draft',
    });
    setIsCreating(true);
    setEditingJob(null);
  };

  const handleEdit = (job: JobPosting) => {
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      requirements: job.requirements || '',
      responsibilities: job.responsibilities || '',
      salary_range: job.salary_range || '',
      status: job.status,
    });
    setEditingJob(job);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.department || !formData.location || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingJob) {
        const { error } = await supabase
          .from('job_postings')
          .update({
            title: formData.title,
            department: formData.department,
            location: formData.location,
            type: formData.type,
            description: formData.description,
            requirements: formData.requirements || null,
            responsibilities: formData.responsibilities || null,
            salary_range: formData.salary_range || null,
            status: formData.status,
          })
          .eq('id', editingJob.id);

        if (error) throw error;
        toast.success('Job posting updated successfully');
      } else {
        const { error } = await supabase
          .from('job_postings')
          .insert([
            {
              title: formData.title,
              department: formData.department,
              location: formData.location,
              type: formData.type,
              description: formData.description,
              requirements: formData.requirements || null,
              responsibilities: formData.responsibilities || null,
              salary_range: formData.salary_range || null,
              status: formData.status,
            },
          ]);

        if (error) throw error;
        toast.success('Job posting created successfully');
      }

      handleCancel();
      fetchJobs();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save job posting');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job posting? This will also delete all applications.')) return;

    try {
      const { error } = await supabase
        .from('job_postings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Job posting deleted');
      fetchJobs();
    } catch (error: any) {
      toast.error('Failed to delete job posting');
      console.error(error);
    }
  };

  const toggleStatus = async (job: JobPosting) => {
    const newStatus = job.status === 'open' ? 'closed' : 'open';
    
    try {
      const { error } = await supabase
        .from('job_postings')
        .update({ status: newStatus })
        .eq('id', job.id);

      if (error) throw error;
      toast.success(`Job ${newStatus === 'open' ? 'opened' : 'closed'} successfully`);
      fetchJobs();
    } catch (error: any) {
      toast.error('Failed to update job status');
      console.error(error);
    }
  };

  const handleViewApplications = (job: JobPosting) => {
    setViewingApplications(job);
    fetchApplications(job.id);
  };

  const updateApplicationStatus = async (appId: string, newStatus: JobApplication['status']) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', appId);

      if (error) throw error;
      
      setApplications(prev =>
        prev.map(app => app.id === appId ? { ...app, status: newStatus } : app)
      );
      
      toast.success(`Application marked as ${newStatus}`);
    } catch (error: any) {
      toast.error('Failed to update application status');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditingJob(null);
    setIsCreating(false);
    setFormData({
      title: '',
      department: '',
      location: '',
      type: 'full-time',
      description: '',
      requirements: '',
      responsibilities: '',
      salary_range: '',
      status: 'draft',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm text-white/72">
          Loading job postings...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white/92">Job Postings</h1>
          <p className="text-white/50 mt-1">Manage job openings and view applications</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          New Job Posting
        </button>
      </div>

      {/* Job Listings */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {jobs.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No job postings yet. Create your first one!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {jobs.map((job) => {
              const config = statusConfig[job.status];
              const StatusIcon = job.status === 'open' ? CheckCircle : XCircle;
              return (
                <div key={job.id} className="p-6 hover:bg-white/[0.03] transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-white/90 text-lg">{job.title}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-400/10 text-blue-400">
                          {typeLabels[job.type]}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-white/50">
                        <span className="flex items-center gap-1">
                          <Building className="h-3.5 w-3.5" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                        {job.application_count !== undefined && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {job.application_count} application{job.application_count !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewApplications(job)}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition"
                        title="View Applications"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(job)}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleStatus(job)}
                        className={`p-2 rounded-lg hover:bg-white/10 transition ${
                          job.status === 'open' 
                            ? 'text-red-400 hover:text-red-300' 
                            : 'text-green-400 hover:text-green-300'
                        }`}
                        title={job.status === 'open' ? 'Close Job' : 'Open Job'}
                      >
                        {job.status === 'open' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(isCreating || editingJob) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c12] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white/92">
                {editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
              </h2>
              <button onClick={handleCancel} className="p-2 rounded-lg hover:bg-white/10 transition">
                <X className="h-5 w-5 text-white/50" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Job Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35"
                    placeholder="e.g., Solar Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Department *</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35"
                    placeholder="e.g., Engineering"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35"
                    placeholder="e.g., Nairobi, Kenya"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Job Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Description * (Markdown)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={8}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 font-mono text-sm"
                  placeholder="Enter job description in Markdown format..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Requirements (Markdown)</label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 font-mono text-sm"
                    placeholder="Enter job requirements..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Responsibilities (Markdown)</label>
                  <textarea
                    value={formData.responsibilities}
                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 font-mono text-sm"
                    placeholder="Enter job responsibilities..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Salary Range</label>
                <input
                  type="text"
                  value={formData.salary_range}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35"
                  placeholder="e.g., KES 80,000 - 120,000"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-white/70">Status:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35"
                >
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Preview */}
              {formData.description && (
                <div>
                  <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">Preview</p>
                  <div className="prose prose-invert prose-sm max-w-none rounded-lg border border-white/10 bg-white/[0.02] p-4 overflow-y-auto max-h-64">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.description}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
              >
                <Save className="h-4 w-4" />
                {editingJob ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Applications Modal */}
      {viewingApplications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c12] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white/92">
                  Applications: {viewingApplications.title}
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  {applications.length} application{applications.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => {
                  setViewingApplications(null);
                  setApplications([]);
                }}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <X className="h-5 w-5 text-white/50" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {applications.length === 0 ? (
                <div className="text-center py-12 text-white/50">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No applications yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="p-4 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-white/90">{app.applicant_name}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-white/50">
                            <span>{app.email}</span>
                            {app.phone && <span>{app.phone}</span>}
                          </div>
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              app.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' :
                              app.status === 'reviewed' ? 'bg-blue-400/10 text-blue-400' :
                              app.status === 'interviewed' ? 'bg-purple-400/10 text-purple-400' :
                              app.status === 'accepted' ? 'bg-green-400/10 text-green-400' :
                              'bg-red-400/10 text-red-400'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingApplication(app)}
                            className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <select
                            value={app.status}
                            onChange={(e) => updateApplicationStatus(app.id, e.target.value as any)}
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 focus:outline-none focus:ring-2 focus:ring-primary/35"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="interviewed">Interviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Single Application Detail Modal */}
      {viewingApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c12] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white/92">Application Details</h2>
              <button
                onClick={() => setViewingApplication(null)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <X className="h-5 w-5 text-white/50" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white/90">{viewingApplication.applicant_name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                  <span>{viewingApplication.email}</span>
                  {viewingApplication.phone && <span>{viewingApplication.phone}</span>}
                </div>
              </div>

              {viewingApplication.cover_letter && (
                <div>
                  <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">Cover Letter</p>
                  <div className="prose prose-invert prose-sm max-w-none rounded-lg border border-white/10 bg-white/[0.02] p-4">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {viewingApplication.cover_letter}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {viewingApplication.resume_url && (
                <div>
                  <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">Resume</p>
                  <a
                    href={viewingApplication.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition"
                  >
                    <FileText className="h-4 w-4" />
                    View Resume
                  </a>
                </div>
              )}

              <div>
                <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">Status</p>
                <select
                  value={viewingApplication.status}
                  onChange={(e) => {
                    updateApplicationStatus(viewingApplication.id, e.target.value as any);
                    setViewingApplication(prev => prev ? { ...prev, status: e.target.value as any } : null);
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/70 focus:outline-none focus:ring-2 focus:ring-primary/35"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-white/30">
                Applied on {new Date(viewingApplication.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
