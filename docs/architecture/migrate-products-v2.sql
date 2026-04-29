-- Migration: Add advanced filtering columns to products table
-- Date: 2026-04-28

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS sub_category TEXT,
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS application TEXT[],
ADD COLUMN IF NOT EXISTS technical_specs JSONB;

-- Update existing records if needed (optional)
-- UPDATE public.products SET brand = 'Generic' WHERE brand IS NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_sub_category ON public.products(sub_category);
