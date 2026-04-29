import { supabase } from '@/lib/supabase';

const PRODUCT_COLUMNS =
  'id,name,description,category,price,stock_quantity,specifications,images,is_active,created_at,updated_at';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  sub_category?: string | null;
  brand?: string | null;
  application?: string[] | null;
  price: number;
  stock_quantity: number;
  specifications: any | null;
  technical_specs?: Record<string, any> | null;
  images: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  category: 'panels' | 'inverters' | 'batteries' | 'accessories';
  sub_category?: string;
  brand?: string;
  application?: string[];
  price: number;
  stock_quantity?: number;
  specifications?: string[];
  technical_specs?: Record<string, any>;
  images?: string[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  is_active?: boolean;
}

/**
 * Fetch all active products
 */
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Product[];
}

/**
 * Fetch all products (including inactive) - Admin only
 */
export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Product[];
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) throw error;
  return data as Product;
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(category: string) {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('category', category)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Product[];
}

/**
 * Create a new product - Admin only
 */
export async function createProduct(product: CreateProductDto) {
  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        ...product,
        stock_quantity: product.stock_quantity ?? 0,
        specifications: product.specifications ?? null,
        images: product.images ?? null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

/**
 * Update a product - Admin only
 */
export async function updateProduct(id: string, updates: UpdateProductDto) {
  const { data, error } = await supabase
    .from('products')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

/**
 * Delete a product (soft delete by setting is_active to false) - Admin only
 */
export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

/**
 * Hard delete a product - Admin only (use with caution)
 */
export async function hardDeleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) throw error;
}

/**
 * Search products by name or description
 */
export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Product[];
}

/**
 * Update product stock quantity
 */
export async function updateProductStock(id: string, quantity: number) {
  const { data, error } = await supabase
    .from('products')
    .update({
      stock_quantity: quantity,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}
