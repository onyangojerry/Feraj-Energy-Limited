import { useState, useEffect } from 'react';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
} from '@/services/products.service';
import {
  ProductForm,
  type ProductFormData,
} from '../../components/admin/ProductForm';
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Search,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { createAuditLog } from '@/services/audit.service';

export function AdminProducts() {
  const { user, profile, permissions } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all');

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, categoryFilter, statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description?.toLowerCase() || '').includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((product) =>
        statusFilter === 'active' ? product.is_active : !product.is_active
      );
    }

    setFilteredProducts(filtered);
  };

  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      // Transform specifications from Record to array of strings
      const specifications = Object.entries(data.specifications).map(
        ([key, value]) => `${key}: ${value}`
      );

      const newProduct = await createProduct({
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        stock_quantity: data.stock_quantity,
        specifications,
        images: data.images,
      });
      setProducts((prev) => [newProduct, ...prev]);
      setShowForm(false);
      toast.success('Product created successfully');

      if (user?.id) {
        await createAuditLog({
          actor_user_id: user.id,
          action: 'product.create',
          metadata: { product_id: newProduct.id, name: newProduct.name },
        });
      }
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
      throw error;
    }
  };

  const handleUpdateProduct = async (data: ProductFormData) => {
    if (!editingProduct) return;

    try {
      // Transform specifications from Record to array of strings
      const specifications = Object.entries(data.specifications).map(
        ([key, value]) => `${key}: ${value}`
      );

      const updated = await updateProduct(editingProduct.id, {
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
        stock_quantity: data.stock_quantity,
        specifications,
        images: data.images,
        is_active: data.is_active,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? updated : p))
      );
      setShowForm(false);
      setEditingProduct(null);
      toast.success('Product updated successfully');

      if (user?.id) {
        await createAuditLog({
          actor_user_id: user.id,
          action: 'product.update',
          metadata: { product_id: updated.id, name: updated.name },
        });
      }
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      throw error;
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingId) return;

    try {
      await deleteProduct(deletingId);
      setProducts((prev) => prev.filter((p) => p.id !== deletingId));
      setShowDeleteModal(false);
      setDeletingId(null);
      toast.success('Product deleted successfully');

      if (user?.id) {
        await createAuditLog({
          actor_user_id: user.id,
          action: 'product.delete',
          metadata: { product_id: deletingId },
        });
      }
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const openDeleteModal = (productId: string) => {
    setDeletingId(productId);
    setShowDeleteModal(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'panels':
        return 'border border-cyan-300/25 bg-cyan-300/10 text-cyan-200';
      case 'inverters':
        return 'border border-violet-300/25 bg-violet-300/10 text-violet-200';
      case 'batteries':
        return 'border border-amber-300/25 bg-amber-300/10 text-amber-200';
      case 'accessories':
        return 'border border-primary/25 bg-primary/10 text-primary';
      default:
        return 'border border-white/15 bg-white/8 text-white/82';
    }
  };

  const canManageProducts =
    profile?.role === 'admin' ||
    profile?.role === 'co_admin' ||
    (profile?.role === 'employee' && permissions?.can_manage_products);

  if (!canManageProducts) {
    return (
      <div className="cinematic-panel p-6">
        <h1 className="mb-2 text-2xl font-semibold text-white/92">
          Product Management
        </h1>
        <p className="text-white/60">
          You do not have permission to manage products. Contact an admin to
          request access.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(13,16,23,0.96),rgba(8,10,15,0.86))] p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(49,209,122,0.12),transparent_30%),radial-gradient(circle_at_90%_0%,rgba(73,201,255,0.1),transparent_28%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="cinematic-eyebrow">Catalog Control</p>
            <h1 className="mt-2 text-3xl font-semibold text-white/92">
              Product Management
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Add, edit, and manage your products
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary px-4 py-2 text-white transition hover:bg-primary/90"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="cinematic-panel p-4">
          <div className="text-sm text-white/55">Total Products</div>
          <div className="text-2xl font-semibold text-white/92">
            {products.length}
          </div>
        </div>
        <div className="cinematic-panel p-4">
          <div className="text-sm text-white/55">Active</div>
          <div className="text-2xl font-semibold text-primary">
            {products.filter((p) => p.is_active).length}
          </div>
        </div>
        <div className="cinematic-panel p-4">
          <div className="text-sm text-white/55">Out of Stock</div>
          <div className="text-2xl font-semibold text-red-300">
            {products.filter((p) => p.stock_quantity === 0).length}
          </div>
        </div>
        <div className="cinematic-panel p-4">
          <div className="text-sm text-white/55">Low Stock (&lt;10)</div>
          <div className="text-2xl font-semibold text-amber-300">
            {
              products.filter(
                (p) => p.stock_quantity > 0 && p.stock_quantity < 10
              ).length
            }
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="cinematic-panel p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white/86 placeholder:text-white/38 focus:border-primary/40 focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/82 focus:border-primary/40 focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">All Categories</option>
            <option value="panels">Solar Panels</option>
            <option value="inverters">Inverters</option>
            <option value="batteries">Batteries</option>
            <option value="accessories">Accessories</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/82 focus:border-primary/40 focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="cinematic-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/8">
            <thead className="bg-white/4">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/45">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/45">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/45">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/45">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/45">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-white/45">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/8">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0">
                        <img
                          src={
                            product.images?.[0] ||
                            'https://via.placeholder.com/100'
                          }
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://via.placeholder.com/100?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white/90">
                          {product.name}
                        </div>
                        <div className="max-w-xs truncate text-sm text-white/50">
                          {product.description?.substring(0, 50) ||
                            'No description'}
                          ...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(
                        product.category
                      )}`}
                    >
                      {product.category.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-white/84">
                    KES {product.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        product.stock_quantity === 0
                          ? 'text-red-300'
                          : product.stock_quantity < 10
                            ? 'text-amber-300'
                            : 'text-primary'
                      }`}
                    >
                      {product.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        product.is_active
                          ? 'border border-primary/20 bg-white/6 text-primary'
                          : 'border border-white/8 bg-white/5 text-white/45'
                      }`}
                    >
                      {product.is_active ? (
                        <>
                          <Eye className="h-3 w-3" />
                          Active
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditForm(product)}
                      className="mr-4 text-primary hover:text-primary/90"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(product.id)}
                      className="text-red-300 hover:text-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto mb-3 h-12 w-12 text-white/25" />
            <p className="text-white/55">No products found</p>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
          onCancel={closeForm}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(12,14,20,0.98),rgba(8,10,15,0.96))] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
            <h3 className="mb-4 text-lg font-semibold text-white/92">
              Delete Product
            </h3>
            <p className="mb-6 text-white/60">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingId(null);
                }}
                className="flex-1 rounded-md border border-white/10 bg-white/6 px-4 py-2 text-white/80"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
