import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  Mail,
  Plus,
  Edit,
  Send,
  Eye,
  Trash2,
  Users,
  X,
  Save,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Loader2,
  UserCheck,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  status: 'draft' | 'sending' | 'sent' | 'failed';
  recipient_count: number;
  sent_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  email: string;
  full_name: string | null;
}

interface NewsletterRecipient {
  id: string;
  newsletter_id: string;
  user_id: string;
  email: string;
  sent_at: string | null;
  status: 'pending' | 'sent' | 'failed';
}

export function Newsletters() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [previewNewsletter, setPreviewNewsletter] = useState<Newsletter | null>(
    null
  );
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [sending, setSending] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
  });

  useEffect(() => {
    fetchNewsletters();
    fetchUsers();
  }, []);

  const fetchNewsletters = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNewsletters(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch newsletters');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .order('email', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleCreateNew = () => {
    setFormData({ subject: '', content: '' });
    setSelectedUsers([]);
    setIsCreating(true);
    setEditingNewsletter(null);
  };

  const handleEdit = (newsletter: Newsletter) => {
    setFormData({
      subject: newsletter.subject,
      content: newsletter.content,
    });
    setEditingNewsletter(newsletter);
    setIsCreating(false);
    // Fetch recipients for this newsletter
    fetchRecipients(newsletter.id);
  };

  const fetchRecipients = async (newsletterId: string) => {
    try {
      const { data, error } = await supabase
        .from('newsletter_recipients')
        .select('user_id')
        .eq('newsletter_id', newsletterId);

      if (error) throw error;
      setSelectedUsers(data?.map((r) => r.user_id) || []);
    } catch (error: any) {
      console.error('Failed to fetch recipients:', error);
    }
  };

  const handleSaveDraft = async () => {
    if (!formData.subject || !formData.content) {
      toast.error('Subject and content are required');
      return;
    }

    try {
      if (editingNewsletter) {
        const { error } = await supabase
          .from('newsletters')
          .update({
            subject: formData.subject,
            content: formData.content,
          })
          .eq('id', editingNewsletter.id);

        if (error) throw error;
        toast.success('Newsletter updated successfully');
      } else {
        const { data, error } = await supabase
          .from('newsletters')
          .insert([
            {
              subject: formData.subject,
              content: formData.content,
              status: 'draft',
            },
          ])
          .select()
          .single();

        if (error) throw error;
        toast.success('Newsletter saved as draft');

        if (data && selectedUsers.length > 0) {
          await addRecipients(data.id, selectedUsers);
        }
      }

      handleCancel();
      fetchNewsletters();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save newsletter');
      console.error(error);
    }
  };

  const addRecipients = async (newsletterId: string, userIds: string[]) => {
    try {
      const recipients = userIds.map((userId) => {
        const user = users.find((u) => u.id === userId);
        return {
          newsletter_id: newsletterId,
          user_id: userId,
          email: user?.email || '',
        };
      });

      const { error } = await supabase
        .from('newsletter_recipients')
        .insert(recipients);

      if (error) throw error;
    } catch (error: any) {
      console.error('Failed to add recipients:', error);
    }
  };

  const handleSendNewsletter = async (newsletter: Newsletter) => {
    setSending(newsletter.id);
    try {
      // Update status to sending
      await supabase
        .from('newsletters')
        .update({ status: 'sending' })
        .eq('id', newsletter.id);

      // Fetch recipients if not already added
      const { data: existingRecipients } = await supabase
        .from('newsletter_recipients')
        .select('user_id')
        .eq('newsletter_id', newsletter.id);

      if (!existingRecipients || existingRecipients.length === 0) {
        // Add selected users as recipients
        if (selectedUsers.length > 0) {
          await addRecipients(newsletter.id, selectedUsers);
        } else {
          toast.error('No recipients selected');
          setSending(null);
          return;
        }
      }

      // Call the edge function to send emails
      const { error } = await supabase.functions.invoke('send-newsletter', {
        body: { newsletter_id: newsletter.id },
      });

      if (error) throw error;

      toast.success('Newsletter is being sent!');
      fetchNewsletters();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send newsletter');
      // Revert status to draft on failure
      await supabase
        .from('newsletters')
        .update({ status: 'draft' })
        .eq('id', newsletter.id);
    } finally {
      setSending(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this newsletter?')) return;

    try {
      const { error } = await supabase
        .from('newsletters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Newsletter deleted');
      fetchNewsletters();
    } catch (error: any) {
      toast.error('Failed to delete newsletter');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditingNewsletter(null);
    setIsCreating(false);
    setSelectedUsers([]);
    setFormData({ subject: '', content: '' });
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const statusConfig = {
    draft: {
      color: 'text-gray-400',
      bg: 'bg-gray-400/10',
      icon: Edit,
      label: 'Draft',
    },
    sending: {
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      icon: Loader2,
      label: 'Sending',
    },
    sent: {
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      icon: CheckCircle,
      label: 'Sent',
    },
    failed: {
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      icon: XCircle,
      label: 'Failed',
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm text-white/72">
          Loading newsletters...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white/92">Newsletters</h1>
          <p className="text-white/50 mt-1">
            Compose and send newsletters to your users
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          New Newsletter
        </button>
      </div>

      {/* Newsletter List */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {newsletters.length === 0 ? (
          <div className="text-center py-12 text-white/50">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No newsletters yet. Create your first one!</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {newsletters.map((newsletter) => {
              const config = statusConfig[newsletter.status];
              const StatusIcon = config.icon;
              return (
                <div
                  key={newsletter.id}
                  className="p-4 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-white/90">
                          {newsletter.subject}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
                        >
                          <StatusIcon
                            className={`h-3 w-3 ${newsletter.status === 'sending' ? 'animate-spin' : ''}`}
                          />
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {newsletter.recipient_count} recipient
                          {newsletter.recipient_count !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {new Date(newsletter.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewNewsletter(newsletter)}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(newsletter)}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {newsletter.status === 'draft' && (
                        <button
                          onClick={() => handleSendNewsletter(newsletter)}
                          disabled={sending === newsletter.id}
                          className="p-2 rounded-lg hover:bg-green-500/10 text-green-400 hover:text-green-300 transition disabled:opacity-50"
                          title="Send"
                        >
                          {sending === newsletter.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(newsletter.id)}
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
      {(isCreating || editingNewsletter) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c12] shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white/92">
                {editingNewsletter
                  ? 'Edit Newsletter'
                  : 'Create New Newsletter'}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <X className="h-5 w-5 text-white/50" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35"
                  placeholder="Newsletter subject"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Content (Markdown)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={12}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 font-mono text-sm"
                  placeholder="Enter newsletter content in Markdown format..."
                />
              </div>

              {/* Preview */}
              {formData.content && (
                <div>
                  <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-semibold">
                    Preview
                  </p>
                  <div className="prose prose-invert prose-sm max-w-none rounded-lg border border-white/10 bg-white/[0.02] p-4 overflow-y-auto max-h-64">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Select Recipients */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-white/70">
                    Select Recipients ({selectedUsers.length} selected)
                  </p>
                  <button
                    onClick={() => setSelectedUsers(users.map((u) => u.id))}
                    className="text-xs text-primary hover:underline"
                  >
                    Select All
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto rounded-lg border border-white/10 bg-white/[0.02] p-2 space-y-1">
                  {users.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/35"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-white/80">
                          {user.full_name || 'Unnamed User'}
                        </p>
                        <p className="text-xs text-white/50">{user.email}</p>
                      </div>
                      {selectedUsers.includes(user.id) && (
                        <UserCheck className="h-4 w-4 text-primary" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-white/10">
              <p className="text-sm text-white/50">
                {selectedUsers.length} recipient
                {selectedUsers.length !== 1 ? 's' : ''} selected
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDraft}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
                >
                  <Save className="h-4 w-4" />
                  Save Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewNewsletter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c12] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white/92">
                  {previewNewsletter.subject}
                </h2>
                <p className="text-sm text-white/50 mt-1">
                  Created:{' '}
                  {new Date(previewNewsletter.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setPreviewNewsletter(null)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <X className="h-5 w-5 text-white/50" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {previewNewsletter.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
