import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  Users,
  Mail,
  Globe2,
  Building2,
  Calendar,
  ChevronDown,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PartnershipRequest {
  id: string;
  company_name: string;
  website: string;
  industry: string;
  country: string;
  contact_person: string;
  email: string;
  phone: string | null;
  business_description: string;
  expertise: string;
  partnership_alignment: string;
  years_in_business: number;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

const statusConfig = {
  pending: {
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    icon: Clock,
    label: 'Pending',
  },
  reviewed: {
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    icon: Eye,
    label: 'Reviewed',
  },
  accepted: {
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    icon: CheckCircle,
    label: 'Accepted',
  },
  rejected: {
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    icon: XCircle,
    label: 'Rejected',
  },
};

export function PartnershipRequests() {
  const [requests, setRequests] = useState<PartnershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] =
    useState<PartnershipRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('partnership_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch partnership requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    id: string,
    newStatus: PartnershipRequest['status']
  ) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from('partnership_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
      );

      if (selectedRequest?.id === id) {
        setSelectedRequest((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      }

      toast.success(`Request marked as ${newStatus}`);
    } catch (error: any) {
      toast.error('Failed to update status');
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  const filteredRequests =
    filterStatus === 'all'
      ? requests
      : requests.filter((req) => req.status === filterStatus);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white/92">
            Partnership Requests
          </h1>
          <p className="text-white/50 mt-1">
            Manage and review partnership applications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['pending', 'reviewed', 'accepted', 'rejected'].map((status) => {
          const count = requests.filter((r) => r.status === status).length;
          const config = statusConfig[status as keyof typeof statusConfig];
          const Icon = config.icon;
          return (
            <button
              key={status}
              onClick={() =>
                setFilterStatus(status === filterStatus ? 'all' : status)
              }
              className={`flex items-center gap-3 rounded-xl border p-4 transition-all duration-300 ${
                filterStatus === status
                  ? 'border-primary/40 bg-primary/10'
                  : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              <div className={`p-2 rounded-lg ${config.bg}`}>
                <Icon className={`h-5 w-5 ${config.color}`} />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-white/92">{count}</p>
                <p className="text-xs text-white/50">{config.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Requests Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm text-white/72">
            Loading requests...
          </div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-20 text-white/50">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>No partnership requests found</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRequests.map((request, idx) => {
                  const config = statusConfig[request.status];
                  const StatusIcon = config.icon;
                  return (
                    <motion.tr
                      key={request.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-white/90">
                              {request.company_name}
                            </p>
                            <p className="text-xs text-white/50">
                              {request.industry}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-white/80">
                            {request.contact_person}
                          </p>
                          <p className="text-xs text-white/50">
                            {request.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Globe2 className="h-4 w-4 text-white/40" />
                          <span className="text-sm text-white/70">
                            {request.country}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-white/40" />
                          <span className="text-sm text-white/70">
                            {formatDate(request.created_at)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0c12] shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-white/10 bg-[#0c0c12]/95 backdrop-blur-xl">
                <h2 className="text-xl font-bold text-white/92">
                  Partnership Details
                </h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 rounded-lg hover:bg-white/10 transition"
                >
                  <XCircle className="h-5 w-5 text-white/50" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Company Info */}
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white/90">
                      {selectedRequest.company_name}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-white/50">
                      <a
                        href={selectedRequest.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {selectedRequest.website}
                      </a>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      statusConfig[selectedRequest.status].bg
                    } ${statusConfig[selectedRequest.status].color}`}
                  >
                    {selectedRequest.status === 'pending' && (
                      <Clock className="h-3 w-3" />
                    )}
                    {selectedRequest.status === 'reviewed' && (
                      <Eye className="h-3 w-3" />
                    )}
                    {selectedRequest.status === 'accepted' && (
                      <CheckCircle className="h-3 w-3" />
                    )}
                    {selectedRequest.status === 'rejected' && (
                      <XCircle className="h-3 w-3" />
                    )}
                    {statusConfig[selectedRequest.status].label}
                  </span>
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <p className="text-xs text-white/40 mb-1">Contact Person</p>
                    <p className="text-sm text-white/80">
                      {selectedRequest.contact_person}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Email</p>
                    <a
                      href={`mailto:${selectedRequest.email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {selectedRequest.email}
                    </a>
                  </div>
                  {selectedRequest.phone && (
                    <div>
                      <p className="text-xs text-white/40 mb-1">Phone</p>
                      <p className="text-sm text-white/80">
                        {selectedRequest.phone}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-white/40 mb-1">
                      Years in Business
                    </p>
                    <p className="text-sm text-white/80">
                      {selectedRequest.years_in_business} years
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Country</p>
                    <p className="text-sm text-white/80">
                      {selectedRequest.country}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Industry</p>
                    <p className="text-sm text-white/80">
                      {selectedRequest.industry}
                    </p>
                  </div>
                </div>

                {/* Business Description */}
                <div>
                  <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">
                    Business Description
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {selectedRequest.business_description}
                  </p>
                </div>

                {/* Expertise */}
                <div>
                  <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">
                    Areas of Expertise
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {selectedRequest.expertise}
                  </p>
                </div>

                {/* Partnership Alignment */}
                <div>
                  <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">
                    Partnership Alignment
                  </p>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {selectedRequest.partnership_alignment}
                  </p>
                </div>

                {/* Status Update */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-white/40 mb-3 uppercase tracking-wider font-semibold">
                    Update Status
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {(
                      ['pending', 'reviewed', 'accepted', 'rejected'] as const
                    ).map((status) => {
                      const config = statusConfig[status];
                      const Icon = config.icon;
                      const isActive = selectedRequest.status === status;
                      const isUpdating = updating === selectedRequest.id;
                      return (
                        <button
                          key={status}
                          onClick={() =>
                            updateStatus(selectedRequest.id, status)
                          }
                          disabled={isActive || isUpdating}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            isActive
                              ? `${config.bg} ${config.color} cursor-default`
                              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-50'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {config.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submitted Date */}
                <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-white/40">
                  <Calendar className="h-3.5 w-3.5" />
                  Submitted on{' '}
                  {new Date(selectedRequest.created_at).toLocaleString()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
