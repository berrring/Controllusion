import { useContext, useEffect, useState } from 'react';
import { Filter, MoreVertical, UserPlus, Users } from 'lucide-react';
import * as adminService from '../../services/adminService';
import { UIContext } from '../../context/UIContext';
import { addActivityEntry, addNotification } from '../../services/storage';
import EmptyState from '../../components/common/EmptyState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/common/Avatar';
import { formatRelativeTime } from '../../utils/formatters';

function AdminPage() {
  const { showToast } = useContext(UIContext);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadUsers() {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getUsers();
      setUsersList(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  async function inviteUser() {
    try {
      const invitedUser = await adminService.inviteUser({
        fullName: `New User ${usersList.length + 1}`,
        email: `invite${usersList.length + 1}@controllusion.com`,
        role: 'User',
        title: 'Team Member',
      });
      setUsersList((current) => [invitedUser, ...current]);
      addActivityEntry({
        title: 'User invited',
        description: `${invitedUser.fullName} was invited to the workspace.`,
      });
      addNotification({
        title: 'Invite sent',
        message: `${invitedUser.fullName} can now join the workspace.`,
        path: '/admin',
      });
      showToast({ title: 'New user invited successfully' });
    } catch (inviteError) {
      showToast({
        title: 'Invite failed',
        description: inviteError.response?.data?.message || 'Unable to invite user.',
        type: 'error',
      });
    }
  }

  if (loading) {
    return <LoadingSkeleton rows={4} />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={loadUsers} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.08em] text-[#4c42e8]">Administration</p>
          <h1 className="mt-2 text-[26px] font-black tracking-[-0.05em] text-[#14213d]">Manage Team</h1>
          <p className="mt-1 text-[12px] font-medium text-[#52627b]">Oversee access levels, roles, and current statuses for your organization.</p>
        </div>
        <Button onClick={inviteUser}>
          <UserPlus className="h-3.5 w-3.5" />
          Add New User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          ['Total Users', usersList.length || 142, Users],
          ['Active Sessions', Math.max(1, usersList.filter((user) => user.isActive).length) * 12 + 2, UserPlus],
          ['Pending Invites', 14, Filter],
        ].map(([label, value, Icon]) => (
          <Card className="rounded-[9px] p-5" key={label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.08em] text-[#52627b]">{label}</p>
                <p className="mt-4 text-[34px] font-black tracking-[-0.06em] text-[#14213d]">{value}</p>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#eef2ff] text-[#4c42e8]">
                <Icon className="h-4 w-4" />
              </span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="rounded-[9px] p-0">
        <div className="flex items-center justify-between p-5">
          <h2 className="text-[15px] font-black text-[#14213d]">Directory</h2>
          <button className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#f3f7ff] px-3 py-2 text-[11px] font-bold text-[#52627b]" type="button">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
        </div>

        {usersList.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#fbfcff] text-left text-[10px] font-black uppercase tracking-[0.1em] text-[#52627b]">
                  {['User', 'Role', 'Status', 'Last Login', 'Actions'].map((label) => (
                    <th className="px-5 py-3" key={label}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usersList.slice(0, 6).map((user) => (
                  <tr className="border-t border-[#edf2fb]" key={user.id}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.fullName} size="sm" src={user.avatarUrl} />
                        <div>
                          <p className="text-[12px] font-black text-[#14213d]">{user.fullName}</p>
                          <p className="text-[10px] font-medium text-[#70809a]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={user.role === 'Admin' ? 'warning' : user.role === 'Viewer' ? 'default' : 'violet'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${user.isActive ? 'text-[#14213d]' : 'text-[#ec6a60]'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.isActive ? 'bg-[#4c42e8]' : 'bg-[#ec6a60]'}`} />
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[12px] font-medium text-[#52627b]">{formatRelativeTime(user.updatedAt || user.createdAt)}</td>
                    <td className="px-5 py-4">
                      <button className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[#52627b] hover:bg-[#eef2ff]" type="button">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState actionLabel="Invite first user" onAction={inviteUser} title="No users found yet" />
        )}
      </Card>
    </div>
  );
}

export default AdminPage;
