# SQL Commands to Run in Supabase Dashboard

Run these commands in your Supabase Dashboard → SQL Editor to set up the partnership requests feature.

## 1. Create Partnership Requests Table

```sql
-- Create partnership_requests table
CREATE TABLE IF NOT EXISTS public.partnership_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  website TEXT NOT NULL,
  industry TEXT NOT NULL,
  country TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_description TEXT NOT NULL,
  expertise TEXT NOT NULL,
  partnership_alignment TEXT NOT NULL,
  years_in_business INTEGER NOT NULL CHECK (years_in_business > 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2. Enable Row Level Security (RLS) for Partnership Requests

```sql
-- Enable Row Level Security
ALTER TABLE public.partnership_requests ENABLE ROW LEVEL SECURITY;
```

## 3. Create RLS Policies for Partnership Requests

```sql
-- Allow public form submissions (anonymous users can submit partnership requests)
CREATE POLICY "Allow public insert" ON public.partnership_requests
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users (admins/staff) to view requests
CREATE POLICY "Allow authenticated select" ON public.partnership_requests
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to update requests (for status changes)
CREATE POLICY "Allow authenticated update" ON public.partnership_requests
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);
```

## 4. Auto-Update Timestamp Function for Partnership Requests

```sql
-- Function to auto-update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before updates
CREATE TRIGGER update_partnership_requests_updated_at
  BEFORE UPDATE ON public.partnership_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 5. Optional: Create Index for Performance

```sql
-- Add index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_partnership_requests_status 
  ON public.partnership_requests(status);

-- Add index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_partnership_requests_created_at 
  ON public.partnership_requests(created_at DESC);
```

---

## Legal Documents (Terms of Service & Privacy Policy)

## 6. Create Legal Documents Table

```sql
-- Create legal_documents table for Terms of Service and Privacy Policy
CREATE TABLE IF NOT EXISTS public.legal_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('terms_of_service', 'privacy_policy')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(type, version)
);

-- Enable RLS
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

-- Allow public to read active legal documents
CREATE POLICY "Allow public read active" ON public.legal_documents
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Allow authenticated users (admins) to manage all legal documents
CREATE POLICY "Allow authenticated full access" ON public.legal_documents
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Auto-update timestamp trigger
CREATE TRIGGER update_legal_documents_updated_at
  BEFORE UPDATE ON public.legal_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to set new version as active and deactivate others
CREATE OR REPLACE FUNCTION set_active_legal_document()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE public.legal_documents 
    SET is_active = false 
    WHERE type = NEW.type AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_single_active_legal_document
  AFTER INSERT OR UPDATE ON public.legal_documents
  FOR EACH ROW
  EXECUTE FUNCTION set_active_legal_document();
```

## 7. Insert Default Legal Documents

```sql
-- Insert default Terms of Service
INSERT INTO public.legal_documents (type, title, content, version, is_active)
VALUES (
  'terms_of_service',
  'Terms of Service',
  '# Terms of Service

Welcome to Feraj Solar Limited. These Terms of Service govern your use of our website and services.

## 1. Acceptance of Terms
By accessing or using our services, you agree to be bound by these Terms.

## 2. Services
Feraj Solar Limited provides solar energy solutions, products, and services as described on our website.

## 3. User Obligations
You agree to use our services only for lawful purposes and in accordance with these Terms.

## 4. Intellectual Property
All content on this website is the property of Feraj Solar Limited and is protected by intellectual property laws.

## 5. Limitation of Liability
Feraj Solar Limited shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.

## 6. Contact Us
For questions about these Terms, please contact us at legal@ferajsolar.com.',
  1,
  true
);

-- Insert default Privacy Policy
INSERT INTO public.legal_documents (type, title, content, version, is_active)
VALUES (
  'privacy_policy',
  'Privacy Policy',
  '# Privacy Policy

At Feraj Solar Limited, we are committed to protecting your privacy and personal information.

## 1. Information We Collect
We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us.

## 2. How We Use Your Information
We use your information to:
- Provide and improve our services
- Process transactions
- Send you updates and marketing communications
- Respond to your inquiries

## 3. Information Sharing
We do not sell or share your personal information with third parties except as described in this Privacy Policy.

## 4. Data Security
We implement appropriate security measures to protect your personal information.

## 5. Your Rights
You have the right to access, update, or delete your personal information. Contact us at privacy@ferajsolar.com.

## 6. Updates to This Policy
We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.',
  1,
  true
);
```

---

## 8. Optional: Sample Query to Verify Tables

```sql
-- Check partnership_requests table
SELECT * FROM public.partnership_requests LIMIT 5;

-- Check legal_documents table
SELECT type, title, version, is_active, created_at 
FROM public.legal_documents 
ORDER BY type, version DESC;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename IN ('partnership_requests', 'legal_documents');
```

---

## Summary of What This Does

| Component | Purpose |
|-----------|---------|
| `partnership_requests` table | Stores all partnership form submissions |
| RLS Enabled (partnership_requests) | Secures the table with access policies |
| Public Insert Policy | Allows anonymous users to submit the form |
| Authenticated Select Policy | Allows admins/staff to view submissions |
| Authenticated Update Policy | Allows admins to change request status |
| `updated_at` trigger | Automatically updates timestamp on changes |
| Indexes | Improves query performance for filtering |
| `legal_documents` table | Stores Terms of Service and Privacy Policy |
| RLS Enabled (legal_documents) | Public can read active, admins can manage |
| Auto-active trigger | Ensures only one active version per document type |
| Default documents | Inserts initial Terms and Privacy Policy |

## Admin Access

After running this SQL, admins can:
- **Partnership Requests**: View at `/admin/partnership-requests`
- **Legal Documents**: Manage at `/admin/legal-documents`
- Update request status (pending → reviewed → accepted/rejected)
- See full details in a modal view

## Form Submission

The public form at `/partnership-request` will:
- Allow anonymous users to submit partnership requests
- Store data in the `partnership_requests` table
- Show success message on successful submission

## Legal Pages

Normal users can view:
- Terms of Service at `/terms-of-service`
- Privacy Policy at `/privacy-policy`

---

## Newsletter System

## 9. Create Newsletters Table

```sql
-- Create newsletters table for admin to compose and send newsletters
CREATE TABLE IF NOT EXISTS public.newsletters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sending', 'sent', 'failed')),
  recipient_count INTEGER DEFAULT 0,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (admins) to manage newsletters
CREATE POLICY "Allow authenticated full access" ON public.newsletters
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Auto-update timestamp trigger
CREATE TRIGGER update_newsletters_updated_at
  BEFORE UPDATE ON public.newsletters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 10. Create Newsletter Recipients Table

```sql
-- Track which users received which newsletter
CREATE TABLE IF NOT EXISTS public.newsletter_recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  newsletter_id UUID REFERENCES public.newsletters(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(newsletter_id, user_id)
);

-- Enable RLS
ALTER TABLE public.newsletter_recipients ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage recipients
CREATE POLICY "Allow authenticated full access" ON public.newsletter_recipients
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_recipients_newsletter_id 
  ON public.newsletter_recipients(newsletter_id);
```

## 11. Insert Sample Newsletter (Optional)

```sql
-- Insert a sample draft newsletter
INSERT INTO public.newsletters (subject, content, status, created_by)
VALUES (
  'Welcome to Feraj Solar Newsletter',
  '# Welcome to Our Newsletter

Dear Valued Customer,

Thank you for choosing Feraj Solar. We are excited to share the latest updates with you.

## Latest Products
Check out our new solar panel series with improved efficiency.

## Upcoming Events
Join us for our annual solar energy workshop next month.

Best regards,
The Feraj Solar Team',
  'draft',
  NULL
);
```

---

## 12. Optional: Sample Query to Verify Tables

```sql
-- Check newsletters table
SELECT * FROM public.newsletters ORDER BY created_at DESC LIMIT 5;

-- Check newsletter_recipients table
SELECT * FROM public.newsletter_recipients LIMIT 5;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename IN ('newsletters', 'newsletter_recipients');
```

---

## Job Postings & Applications System

## 13. Create Job Postings Table

```sql
-- Create job_postings table for admin to post open positions
CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('full-time', 'part-time', 'contract', 'internship')),
  description TEXT NOT NULL,
  requirements TEXT,
  responsibilities TEXT,
  salary_range TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'draft')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

-- Allow public to view open jobs
CREATE POLICY "Allow public read open jobs" ON public.job_postings
  FOR SELECT TO anon, authenticated
  USING (status = 'open');

-- Allow authenticated users (admins) to manage all job postings
CREATE POLICY "Allow authenticated full access" ON public.job_postings
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Auto-update timestamp trigger
CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 14. Create Job Applications Table

```sql
-- Create job_applications table for users to apply to jobs
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cover_letter TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'interviewed', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Allow public to submit applications (insert only)
CREATE POLICY "Allow public insert applications" ON public.job_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Allow authenticated users (admins) to view and manage applications
CREATE POLICY "Allow authenticated full access" ON public.job_applications
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Auto-update timestamp trigger
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id 
  ON public.job_applications(job_id);
```

## 15. Insert Sample Job Posting (Optional)

```sql
-- Insert a sample job posting
INSERT INTO public.job_postings (title, department, location, type, description, requirements, responsibilities, status)
VALUES (
  'Solar Installation Engineer',
  'Engineering',
  'Nairobi, Kenya',
  'full-time',
  'We are seeking an experienced Solar Installation Engineer to join our growing team. You will be responsible for designing and installing solar systems for residential and commercial clients.',
  '• Bachelor\'s degree in Electrical Engineering or related field
• 3+ years of experience in solar installations
• Strong knowledge of electrical systems
• Valid driver\'s license',
  '• Design and install solar PV systems
• Conduct site assessments
• Ensure compliance with safety standards
• Maintain documentation and reports',
  'open'
);
```

---

## 16. Optional: Sample Query to Verify Tables

```sql
-- Check job_postings table
SELECT * FROM public.job_postings ORDER BY created_at DESC;

-- Check job_applications table
SELECT * FROM public.job_applications LIMIT 5;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename IN ('job_postings', 'job_applications');
```

