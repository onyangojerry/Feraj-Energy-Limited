import { useState, useEffect } from 'react';
import {
  getAllUsers,
  updateUserRole,
  type Profile,
} from '@/services/users.service';
import {
  getUserPermissions,
  upsertUserPermissions,
  type UserPermissions,
} from '@/services/permissions.service';
import { createAuditLog } from '@/services/audit.service';
import { Loader2, Search, Shield, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Note: This page is only accessible to admins and co-admins. Employees and customers will see an access denied message.
export function AdminUsers() {
  const { user: currentUser, profile: currentProfile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<
    'all' | 'customer' | 'employee' | 'co_admin' | 'admin'
  >('all');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedPermissions, setSelectedPermissions] =
    useState<UserPermissions | null>(null);
  const [selectedRole, setSelectedRole] = useState<Profile['role'] | null>(
    null
  );
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.full_name?.toLowerCase().includes(query)
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const isAdmin = currentProfile?.role === 'admin';
  const isCoAdmin = currentProfile?.role === 'co_admin';

  const canManageUsers = !!(isAdmin || isCoAdmin);

  const loadPermissionsForUser = async (userId: string) => {
    try {
      setLoadingPermissions(true);
      const perms = await getUserPermissions(userId);
      setSelectedPermissions(perms);
    } catch {
      // If no permissions row exists, default to null and let upsert create
      setSelectedPermissions(null);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const applyUserChanges = async () => {
    if (!selectedUser || !selectedRole) return;

    // Prevent user from demoting themselves
    if (selectedUser.id === currentUser?.id && selectedRole !== 'admin') {
      toast.error('You cannot change your own admin role');
      return;
    }

    try {
      setUpdating(true);

      if (selectedRole !== selectedUser.role) {
        await updateUserRole(selectedUser.id, selectedRole);

        if (currentUser?.id) {
          await createAuditLog({
            actor_user_id: currentUser.id,
            target_user_id: selectedUser.id,
            action: 'role.change',
            metadata: { role: selectedRole },
          });
        }
      }

      if (selectedPermissions) {
        const updated = await upsertUserPermissions(selectedUser.id, {
          can_manage_products: selectedPermissions.can_manage_products,
          can_manage_tickets: selectedPermissions.can_manage_tickets,
          can_promote_to_co_admin: selectedPermissions.can_promote_to_co_admin,
        });
        setSelectedPermissions(updated);

        if (currentUser?.id) {
          await createAuditLog({
            actor_user_id: currentUser.id,
            target_user_id: selectedUser.id,
            action: 'permissions.update',
            metadata: {
              can_manage_products: updated.can_manage_products,
              can_manage_tickets: updated.can_manage_tickets,
              can_promote_to_co_admin: updated.can_promote_to_co_admin,
            },
          });
        }
      }

      // Refresh from source of truth so UI reflects what Supabase persisted.
      await fetchUsers();

      toast.success('User updated');
      setShowRoleModal(false);
      setSelectedUser(null);
      setSelectedRole(null);
      setSelectedPermissions(null);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error?.message || 'Failed to update user');
    } finally {
      setUpdating(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'co_admin':
        return <Shield className="h-4 w-4" />;
      case 'employee':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'co_admin':
        return 'bg-indigo-100 text-indigo-800';
      case 'employee':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-secondary text-primary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!canManageUsers) {
    return (
      <div className="cinematic-panel p-6">
        <h1 className="mb-2 text-2xl font-semibold text-white/92">
          User Management
        </h1>
        <p className="text-white/60">
          You do not have permission to manage users. Contact an admin to
          request access.
        </p>
      </div>
    );
  }

  const roleOrder: Array<Profile['role']> = [
    'admin',
    'co_admin',
    'employee',
    'customer',
  ];
  const groupedUsers = roleOrder.map((role) => ({
    role,
    users: filteredUsers.filter((u) => u.role === role),
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(145deg,rgba(13,16,23,0.96),rgba(8,10,15,0.86))] p-6 sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(73,201,255,0.12),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(49,209,122,0.12),transparent_28%)]" />
        <div className="relative">
          <p className="cinematic-eyebrow">People Ops</p>
          <h1 className="mt-2 text-3xl font-semibold text-white/92">
            User Management
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Manage user roles and permissions
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="cinematic-panel p-4">
          <div className="text-sm text-white/55">Total Users</div>
          <div className="text-2xl font-semibold text-white/92">
            {users.length}
          </div>
        </div>
        <div className="cinematic-panel p-4">
          <div className="text-sm text-white/55">Admins</div>
          <div className="text-2xl font-semibold text-violet-300">
            {users.filter((u) => u.role === 'admin').length}
          </div>
        </div>
        <div className="cinematic-panel p-4">
          <div className="text-sm text-white/55">Co-admins</div>
          <div className="text-2xl font-semibold text-indigo-300">
            {users.filter((u) => u.role === 'co_admin').length}
          </div>
        </div>
        <div className="cinematic-panel p-4">
          <div className="text-sm text-white/55">Employees</div>
          <div className="text-2xl font-semibold text-sky-300">
            {users.filter((u) => u.role === 'employee').length}
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
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white/86 placeholder:text-white/38 focus:border-primary/40 focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/82 focus:border-primary/40 focus:ring-2 focus:ring-primary/40"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="co_admin">Co-admins</option>
            <option value="employee">Employees</option>
            <option value="customer">Customers</option>
          </select>
        </div>
      </div>

      {/* Users Table Groups */}
      {groupedUsers.map((group) => (
        <div key={group.role} className="cinematic-panel overflow-hidden">
          <div className="border-b border-white/8 px-6 py-4 bg-white/4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/72">
              {group.role.replace('_', ' ')}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/8">
              <thead className="bg-white/4">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/45">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/45">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-white/45">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-white/45">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {group.users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8 ring-1 ring-white/10">
                            <span className="text-primary font-semibold">
                              {user.full_name?.charAt(0) ||
                                user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white/90">
                            {user.full_name || 'No name'}
                          </div>
                          <div className="text-sm text-white/55">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {getRoleIcon(user.role)}
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-white/55">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setSelectedRole(user.role);
                          setShowRoleModal(true);
                          loadPermissionsForUser(user.id);
                        }}
                        className="text-primary hover:text-primary/90 disabled:text-white/25"
                        disabled={
                          user.id === currentUser?.id ||
                          (isCoAdmin &&
                            (user.role === 'admin' || user.role === 'co_admin'))
                        }
                      >
                        {user.id === currentUser?.id ? '(You)' : 'Manage'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {group.users.length === 0 && (
            <div className="py-8 text-center">
              <AlertCircle className="mx-auto mb-2 h-10 w-10 text-white/25" />
              <p className="text-sm text-white/55">No users in this group</p>
            </div>
          )}
        </div>
      ))}

      {filteredUsers.length === 0 && (
        <div className="py-12 text-center">
          <AlertCircle className="mx-auto mb-3 h-12 w-12 text-white/25" />
          <p className="text-white/55">No users found</p>
        </div>
      )}

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(12,14,20,0.98),rgba(8,10,15,0.96))] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
            <h3 className="mb-4 text-lg font-semibold text-white/92">
              Manage User
            </h3>

            <div className="mb-4">
              <p className="mb-2 text-sm text-white/50">User:</p>
              <p className="font-medium text-white/90">
                {selectedUser.full_name || selectedUser.email}
              </p>
              <p className="text-sm text-white/55">{selectedUser.email}</p>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-sm text-white/50">Role:</p>
              <div className="space-y-2">
                {(isAdmin
                  ? (['customer', 'employee', 'co_admin', 'admin'] as const)
                  : (['customer', 'employee'] as const)
                ).map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    disabled={updating}
                    className={`w-full flex items-center gap-3 rounded-lg border-2 px-4 py-3 transition ${
                      selectedRole === role
                        ? 'border-primary bg-white/8'
                        : 'border-white/10 hover:border-primary/40 hover:bg-white/5'
                    } ${updating ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {getRoleIcon(role)}
                    <span className="font-medium text-white/86">
                      {role.replace('_', ' ')}
                    </span>
                    {selectedRole === role && (
                      <span className="ml-auto text-sm text-primary">
                        (Selected)
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-sm text-white/50">Privileges:</p>
              {loadingPermissions && (
                <p className="mb-2 text-xs text-white/45">
                  Loading permissions...
                </p>
              )}
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedPermissions?.can_manage_products ?? false}
                    onChange={(e) =>
                      setSelectedPermissions((prev) => ({
                        user_id: selectedUser.id,
                        can_manage_products: e.target.checked,
                        can_manage_tickets: prev?.can_manage_tickets ?? false,
                        can_promote_to_co_admin:
                          prev?.can_promote_to_co_admin ?? false,
                        created_at:
                          prev?.created_at ?? new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                      }))
                    }
                    disabled={loadingPermissions || updating}
                  />
                  <span className="text-sm text-white/78">Handle products</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedPermissions?.can_manage_tickets ?? false}
                    onChange={(e) =>
                      setSelectedPermissions((prev) => ({
                        user_id: selectedUser.id,
                        can_manage_products: prev?.can_manage_products ?? false,
                        can_manage_tickets: e.target.checked,
                        can_promote_to_co_admin:
                          prev?.can_promote_to_co_admin ?? false,
                        created_at:
                          prev?.created_at ?? new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                      }))
                    }
                    disabled={loadingPermissions || updating}
                  />
                  <span className="text-sm text-white/78">Handle tickets</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedRole === 'co_admin'}
                    onChange={(e) =>
                      setSelectedRole(
                        e.target.checked
                          ? 'co_admin'
                          : selectedRole === 'co_admin'
                            ? 'employee'
                            : selectedRole
                      )
                    }
                    disabled={!isAdmin || updating}
                  />
                  <span className="text-sm text-white/78">Make co-admin</span>
                </label>
                {!isAdmin && (
                  <p className="text-xs text-white/48">
                    Only admins can promote a user to co-admin.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                  setSelectedRole(null);
                  setSelectedPermissions(null);
                }}
                disabled={updating}
                className="flex-1 rounded-md border border-white/10 bg-white/6 px-4 py-2 text-white/80 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={applyUserChanges}
                disabled={updating || loadingPermissions}
                className="flex-1 rounded-md bg-primary px-4 py-2 text-white transition hover:bg-primary/90 disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
