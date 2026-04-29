import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Globe, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LegalDocument {
  id: string;
  type: string;
  title: string;
  content: string;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function PrivacyPolicy() {
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveDocument();
  }, []);

  const fetchActiveDocument = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_documents')
        .select('*')
        .eq('type', 'privacy_policy')
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setDocument(data);
    } catch (error: any) {
      console.error('Error fetching Privacy Policy:', error);
      toast.error('Failed to load Privacy Policy');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen text-white/86">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="rounded-full border border-white/15 bg-white/6 px-4 py-2 text-sm text-white/72">
            Loading Privacy Policy...
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
            <Globe className="h-8 w-8 text-primary" />
            <h1 className="text-5xl md:text-6xl font-bold text-white/92">
              Privacy Policy
            </h1>
          </div>
          {document && (
            <p className="text-white/50 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Last updated:{' '}
              {new Date(document.updated_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {' • '}Version {document.version}
            </p>
          )}
        </div>
      </section>

      <section className="py-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {document ? (
            <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white/92 prose-p:text-white/70 prose-a:text-primary prose-strong:text-white/90 prose-ul:text-white/70 prose-ol:text-white/70">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {document.content}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="text-center py-12">
              <Globe className="h-12 w-12 mx-auto mb-4 text-white/20" />
              <p className="text-white/50">Privacy Policy not available yet.</p>
              <p className="text-sm text-white/30 mt-2">
                Please check back later.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
