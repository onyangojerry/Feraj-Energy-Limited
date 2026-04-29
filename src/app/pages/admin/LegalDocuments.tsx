import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  FileText,
  Plus,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  ArrowLeft,
  Save,
  X,
  Globe,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LegalDocument {
  id: string;
  type: 'terms_of_service' | 'privacy_policy';
  title: string;
  content: string;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const typeLabels = {
  terms_of_service: 'Terms of Service',
  privacy_policy: 'Privacy Policy',
};

const typeIcons = {
  terms_of_service: FileText,
  privacy_policy: Globe,
};

export function LegalDocuments() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<LegalDocument | null>(null);
  const [formData, setFormData] = useState({
    type: 'terms_of_service' as 'terms_of_service' | 'privacy_policy',
    title: '',
    content: '',
    is_active: false,
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .order('type', { ascending: true })
        .order('version', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch legal documents');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = (type: 'terms_of_service' | 'privacy_policy') => {
    const latestVersion = documents
      .filter((d) => d.type === type)
      .reduce((max, d) => Math.max(max, d.version), 0);

    setFormData({
      type,
      title: typeLabels[type],
      content: '',
      is_active: false,
    });
    setIsCreating(true);
    setEditingDoc(null);
  };

  const handleEdit = (doc: LegalDocument) => {
    setFormData({
      type: doc.type,
      title: doc.title,
      content: doc.content,
      is_active: doc.is_active,
    });
    setEditingDoc(doc);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    try {
      if (editingDoc) {
        // Update existing document
        const { error } = await supabase
          .from('legal_documents')
          .update({
            title: formData.title,
            content: formData.content,
            is_active: formData.is_active,
          })
          .eq('id', editingDoc.id);

        if (error) throw error;
        toast.success('Document updated successfully');
      } else {
        // Create new version
        const latestVersion = documents
          .filter((d) => d.type === formData.type)
          .reduce((max, d) => Math.max(max, d.version), 0);

        const { error } = await supabase.from('legal_documents').insert([
          {
            type: formData.type,
            title: formData.title,
            content: formData.content,
            version: latestVersion + 1,
            is_active: formData.is_active,
          },
        ]);

        if (error) throw error;
        toast.success('New version created successfully');
      }

      setEditingDoc(null);
      setIsCreating(false);
      setFormData({
        type: 'terms_of_service',
        title: '',
        content: '',
        is_active: false,
      });
      fetchDocuments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save document');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditingDoc(null);
    setIsCreating(false);
    setFormData({
      type: 'terms_of_service',
      title: '',
      content: '',
      is_active: false,
    });
  };

  const getDocsByType = (type: string) => {
    return documents.filter((d) => d.type === type);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm text-white/72">
          Loading legal documents...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white/92">Legal Documents</h1>
        <p className="text-white/50 mt-1">
          Manage Terms of Service and Privacy Policy
        </p>
      </div>

      {/* Document Types */}
      {(['terms_of_service', 'privacy_policy'] as const).map((type) => {
        const Icon = typeIcons[type];
        const docs = getDocsByType(type);
        const activeDoc = docs.find((d) => d.is_active);

        return (
          <div
            key={type}
            className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white/90">
                    {typeLabels[type]}
                  </h2>
                  <p className="text-sm text-white/50">
                    {docs.length} version{docs.length !== 1 ? 's' : ''}
                    {activeDoc && ` • Active: v${activeDoc.version}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleCreateNew(type)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition text-sm font-medium"
              >
                <Plus className="h-4 w-4" />
                New Version
              </button>
            </div>

            {/* Document List */}
            <div className="divide-y divide-white/5">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 hover:bg-white/[0.03] transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white/90">
                          Version {doc.version}
                        </span>
                        {doc.is_active && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/50">{doc.title}</p>
                      <p className="text-xs text-white/30 mt-1">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(doc.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(doc)}
                      className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {docs.length === 0 && (
                <div className="p-8 text-center text-white/30">
                  No versions yet. Create the first version.
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Edit/Create Modal */}
      {(editingDoc || isCreating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c12] shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white/92">
                {editingDoc
                  ? `Edit Version ${editingDoc.version}`
                  : 'Create New Version'}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <X className="h-5 w-5 text-white/50" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Document Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as
                          | 'terms_of_service'
                          | 'privacy_policy',
                      })
                    }
                    disabled={!!editingDoc}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 disabled:opacity-50"
                  >
                    <option value="terms_of_service">Terms of Service</option>
                    <option value="privacy_policy">Privacy Policy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35"
                    placeholder="Document title"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Content (Markdown)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={16}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white/86 focus:outline-none focus:ring-2 focus:ring-primary/35 font-mono text-sm"
                  placeholder="Enter document content in Markdown format..."
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/35"
                />
                <label htmlFor="is_active" className="text-sm text-white/70">
                  Set as active version (will deactivate other versions of this
                  type)
                </label>
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
            </div>

            {/* Modal Footer */}
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
                {editingDoc ? 'Update' : 'Create Version'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c12] shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white/92">
                  {previewDoc.title}
                </h2>
                <p className="text-sm text-white/50">
                  Version {previewDoc.version}
                  {previewDoc.is_active && (
                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 rounded-lg hover:bg-white/10 transition"
              >
                <X className="h-5 w-5 text-white/50" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {previewDoc.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
