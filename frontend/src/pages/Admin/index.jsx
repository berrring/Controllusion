import { useContext, useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import * as adminService from '../../services/adminService';
import { ROLE_OPTIONS } from '../../utils/constants';
import { UIContext } from '../../context/UIContext';
import { addActivityEntry, addNotification } from '../../services/storage';
import { validateInviteUser } from '../../utils/validation';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import FormField from '../../components/forms/FormField';
import { formatDate } from '../../utils/formatters';

function AdminPage() {
  const { showToast } = useContext(UIContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('User');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteValues, setInviteValues] = useState({
    fullName: '',
    email: '',
    role: 'User',
    title: '',
  });
  const [submittingInvite, setSubmittingInvite] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteFieldErrors, setInviteFieldErrors] = useState({});

  async function loadUsers() {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  function openRoleModal(user) {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setRoleModalOpen(true);
  }

  async function saveRole() {
    if (!selectedUser) {
      return;
    }

    try {
      const updatedUser = await adminService.updateUser(selectedUser.id, { role: selectedRole });
      setUsers((current) => current.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      addActivityEntry({
        title: 'User role changed',
        description: `${updatedUser.fullName} is now assigned to the ${updatedUser.role} role.`,
      });
      addNotification({
        title: 'Role updated',
        message: `${updatedUser.fullName} is now assigned to ${updatedUser.role}.`,
        path: '/admin',
      });
      showToast({
        title: 'Role updated',
        description: `${updatedUser.fullName} is now assigned to ${updatedUser.role}.`,
      });
      setRoleModalOpen(false);
    } catch (roleError) {
      showToast({
        title: 'Role update failed',
        description: roleError.response?.data?.message || 'Unable to update this role.',
        type: 'error',
      });
    }
  }

  async function toggleUserState(user) {
    try {
      const updatedUser = await adminService.updateUser(user.id, { isActive: !user.isActive });
      setUsers((current) => current.map((item) => (item.id === updatedUser.id ? updatedUser : item)));
      addActivityEntry({
        title: updatedUser.isActive ? 'User enabled' : 'User disabled',
        description: `${updatedUser.fullName} access was updated from the admin panel.`,
      });
      addNotification({
        title: updatedUser.isActive ? 'User enabled' : 'User disabled',
        message: `${updatedUser.fullName} access was updated successfully.`,
        path: '/admin',
      });
      showToast({
        title: updatedUser.isActive ? 'User enabled' : 'User disabled',
        description: `${updatedUser.fullName} access was updated.`,
      });
    } catch (toggleError) {
      showToast({
        title: 'Update failed',
        description: toggleError.response?.data?.message || 'Unable to update this user.',
        type: 'error',
      });
    }
  }

  async function handleInvite(event) {
    event.preventDefault();
    const validationErrors = validateInviteUser(inviteValues);

    if (Object.keys(validationErrors).length) {
      setInviteFieldErrors(validationErrors);
      return;
    }

    setSubmittingInvite(true);
    setInviteError('');

    try {
      const invitedUser = await adminService.inviteUser(inviteValues);
      setUsers((current) => [invitedUser, ...current]);
      addActivityEntry({
        title: 'User invited',
        description: `${invitedUser.fullName} was invited to the CRM workspace.`,
      });
      addNotification({
        title: 'User invited',
        message: `${invitedUser.fullName} was added to the team.`,
        path: '/admin',
      });
      showToast({
        title: 'User invited',
        description: `${invitedUser.fullName} was added successfully.`,
      });
      setInviteValues({ fullName: '', email: '', role: 'User', title: '' });
      setInviteFieldErrors({});
      setInviteOpen(false);
    } catch (inviteErr) {
      setInviteError(inviteErr.response?.data?.message || 'Unable to invite user.');
    } finally {
      setSubmittingInvite(false);
    }
  }

  if (loading) {
    return <LoadingSkeleton rows={8} />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={loadUsers} title="Admin panel unavailable" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Button
            onClick={() => {
              setInviteError('');
              setInviteFieldErrors({});
              setInviteOpen(true);
            }}
          >
            <UserPlus className="h-4 w-4" />
            Invite user
          </Button>
        }
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Admin' }]}
        description="Manage user access, roles, and account status for the Controllusion CRM."
        title="Admin panel"
      />

      <Card>
        {users.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  {['User', 'Role', 'Status', 'Created', 'Actions'].map((label) => (
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-slate-500" key={label}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-[var(--text)]">{user.fullName}</p>
                      <p className="text-sm text-muted">{user.email}</p>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={user.role === 'Admin' ? 'violet' : 'brand'}>{user.role}</Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant={user.isActive ? 'success' : 'danger'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button onClick={() => openRoleModal(user)} size="sm" variant="secondary">
                          Change role
                        </Button>
                        <Button onClick={() => toggleUserState(user)} size="sm" variant="ghost">
                          {user.isActive ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            actionLabel="Invite first user"
            description="No team accounts have been added yet. Invite a teammate to start using the CRM."
            onAction={() => setInviteOpen(true)}
            title="No users found"
          />
        )}
      </Card>

      <Modal
        description={selectedUser ? `Update access level for ${selectedUser.fullName}.` : ''}
        onClose={() => setRoleModalOpen(false)}
        open={roleModalOpen}
        title="Edit role"
      >
        <div className="space-y-5">
          <FormField htmlFor="role" label="Role">
            <Select id="role" onChange={(event) => setSelectedRole(event.target.value)} value={selectedRole}>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
          </FormField>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button onClick={() => setRoleModalOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={saveRole}>Save role</Button>
          </div>
        </div>
      </Modal>

      <Modal
        description="Add a user to the CRM and assign an initial role."
        maxWidth="max-w-2xl"
        onClose={() => setInviteOpen(false)}
        open={inviteOpen}
        title="Invite user"
      >
        <form className="space-y-5" onSubmit={handleInvite}>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField error={inviteFieldErrors.fullName} htmlFor="inviteFullName" label="Full name">
              <Input
                id="inviteFullName"
                name="fullName"
                onChange={(event) => {
                  setInviteValues((current) => ({ ...current, fullName: event.target.value }));
                  setInviteFieldErrors((current) => ({ ...current, fullName: '' }));
                }}
                value={inviteValues.fullName}
              />
            </FormField>
            <FormField error={inviteFieldErrors.email} htmlFor="inviteEmail" label="Email">
              <Input
                id="inviteEmail"
                name="email"
                onChange={(event) => {
                  setInviteValues((current) => ({ ...current, email: event.target.value }));
                  setInviteFieldErrors((current) => ({ ...current, email: '' }));
                }}
                type="email"
                value={inviteValues.email}
              />
            </FormField>
            <FormField error={inviteFieldErrors.role} htmlFor="inviteRole" label="Role">
              <Select
                id="inviteRole"
                name="role"
                onChange={(event) => {
                  setInviteValues((current) => ({ ...current, role: event.target.value }));
                  setInviteFieldErrors((current) => ({ ...current, role: '' }));
                }}
                value={inviteValues.role}
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField htmlFor="inviteTitle" label="Title">
              <Input
                id="inviteTitle"
                name="title"
                onChange={(event) => setInviteValues((current) => ({ ...current, title: event.target.value }))}
                value={inviteValues.title}
              />
            </FormField>
          </div>

          {inviteError ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{inviteError}</div> : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button onClick={() => setInviteOpen(false)} type="button" variant="secondary">
              Cancel
            </Button>
            <Button isLoading={submittingInvite} type="submit">
              Send invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AdminPage;
