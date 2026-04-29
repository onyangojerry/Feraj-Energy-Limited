// Supabase Edge Function: send-newsletter
// Deploy with: supabase functions deploy send-newsletter

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { SmtpClient } from 'https://deno.land/x/smtp@0.7.0/mod.ts';

interface NewsletterRecipient {
  id: string;
  email: string;
  user_id: string;
  status: string;
}

interface Newsletter {
  id: string;
  subject: string;
  content: string;
}

serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers':
            'authorization, x-client-info, apikey, content-type',
        },
      });
    }

    const { newsletter_id } = await req.json();

    if (!newsletter_id) {
      throw new Error('newsletter_id is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const { createClient } =
      await import('https://esm.sh/@supabase/supabase-js@2.39.3');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch newsletter
    const { data: newsletter, error: newsletterError } = await supabase
      .from('newsletters')
      .select('*')
      .eq('id', newsletter_id)
      .single();

    if (newsletterError || !newsletter) {
      throw new Error('Newsletter not found');
    }

    // Fetch recipients
    const { data: recipients, error: recipientsError } = await supabase
      .from('newsletter_recipients')
      .select('*')
      .eq('newsletter_id', newsletter_id)
      .eq('status', 'pending');

    if (recipientsError) {
      throw recipientsError;
    }

    if (!recipients || recipients.length === 0) {
      throw new Error('No recipients found');
    }

    // Update newsletter status to 'sending'
    await supabase
      .from('newsletters')
      .update({ status: 'sending' })
      .eq('id', newsletter_id);

    const emailResults = await sendNewsletterEmails(
      newsletter,
      recipients,
      supabase
    );

    // Update newsletter status to 'sent' if all successful
    const allSent = emailResults.every((r: any) => r.success);
    await supabase
      .from('newsletters')
      .update({
        status: allSent ? 'sent' : 'failed',
        sent_at: allSent ? new Date().toISOString() : null,
        recipient_count: recipients.length,
      })
      .eq('id', newsletter_id);

    return new Response(
      JSON.stringify({
        success: true,
        sent: emailResults.filter((r: any) => r.success).length,
        failed: emailResults.filter((r: any) => !r.success).length,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: any) {
    console.error('Error sending newsletter:', error);

    // Update newsletter status to 'failed' on error
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const { createClient } =
        await import('https://esm.sh/@supabase/supabase-js@2.39.3');
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { newsletter_id } = await req.json().catch(() => ({}));
      if (newsletter_id) {
        await supabase
          .from('newsletters')
          .update({ status: 'failed' })
          .eq('id', newsletter_id);
      }
    } catch (e) {
      console.error('Failed to update newsletter status:', e);
    }

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});

async function sendNewsletterEmails(
  newsletter: Newsletter,
  recipients: NewsletterRecipient[],
  supabase: any
): Promise<any[]> {
  const emailService = Deno.env.get('EMAIL_SERVICE') || 'console'; // 'resend', 'smtp', or 'console' for testing

  const results = [];

  for (const recipient of recipients) {
    try {
      // Convert markdown to HTML (simple version)
      const htmlContent = markdownToHtml(newsletter.content);

      const emailSent = await sendEmail({
        to: recipient.email,
        subject: newsletter.subject,
        html: htmlContent,
        service: emailService,
      });

      // Update recipient status
      await supabase
        .from('newsletter_recipients')
        .update({
          status: emailSent ? 'sent' : 'failed',
          sent_at: emailSent ? new Date().toISOString() : null,
        })
        .eq('id', recipient.id);

      results.push({ recipient: recipient.email, success: emailSent });
    } catch (error: any) {
      console.error(`Failed to send to ${recipient.email}:`, error);

      await supabase
        .from('newsletter_recipients')
        .update({
          status: 'failed',
          error_message: error.message,
        })
        .eq('id', recipient.id);

      results.push({
        recipient: recipient.email,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}

async function sendEmail({
  to,
  subject,
  html,
  service,
}: {
  to: string;
  subject: string;
  html: string;
  service: string;
}): Promise<boolean> {
  try {
    if (service === 'console') {
      // Development/testing mode - just log to console
      console.log('--- EMAIL ---');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('HTML:', html);
      console.log('--- END EMAIL ---');
      return true;
    }

    if (service === 'resend') {
      const resendKey = Deno.env.get('RESEND_API_KEY');
      if (!resendKey) throw new Error('RESEND_API_KEY not set');

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: Deno.env.get('FROM_EMAIL') || 'noreply@ferajsolar.com',
          to: [to],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send email via Resend');
      }

      return true;
    }

    // Add more email services (SendGrid, SMTP, etc.) as needed
    throw new Error(`Unsupported email service: ${service}`);
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

function markdownToHtml(markdown: string): string {
  // Simple markdown to HTML conversion
  // For production, use a proper markdown library
  let html = markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\n$/gim, '<br />')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img alt="$1" src="$2" />')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/^(.+)$/gim, '<p>$1</p>');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          h1, h2, h3 { color: #2c3e50; }
          a { color: #3498db; }
          blockquote { border-left: 4px solid #3498db; padding-left: 16px; margin: 16px 0; }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;
}
