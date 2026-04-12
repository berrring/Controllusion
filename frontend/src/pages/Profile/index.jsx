import { useContext, useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { UIContext } from '../../context/UIContext';
import { addActivityEntry, addNotification } from '../../services/storage';
import { validatePasswordChange, validateProfile } from '../../utils/validation';
import PageHeader from '../../components/common/PageHeader';
import Avatar from '../../components/common/Avatar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FormField from '../../components/forms/FormField';

function ProfilePage() {
  const { user, saveProfile, updatePassword } = useAuth();
  const { showToast } = useContext(UIContext);
  const [profileValues, setProfileValues] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    title: user?.title || '',
    themePreference: user?.themePreference || 'light',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [passwordValues, setPasswordValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setProfileValues({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      title: user?.title || '',
      themePreference: user?.themePreference || 'light',
    });
  }, [user]);

  function handleProfileChange(event) {
    const { name, value } = event.target;
    setProfileValues((current) => ({ ...current, [name]: value }));
    setProfileErrors((current) => ({ ...current, [name]: '' }));
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;
    setPasswordValues((current) => ({ ...current, [name]: value }));
    setPasswordErrors((current) => ({ ...current, [name]: '' }));
  }

  async function submitProfile(event) {
    event.preventDefault();
    const validationErrors = validateProfile(profileValues);

    if (Object.keys(validationErrors).length) {
      setProfileErrors(validationErrors);
      return;
    }

    setProfileSubmitting(true);
    setProfileError('');
    try {
      const updatedUser = await saveProfile(profileValues);
      addActivityEntry({
        title: 'Profile updated',
        description: 'Account details were saved successfully.',
      });
      addNotification({
        title: 'Profile saved',
        message: `${updatedUser.fullName} profile information was updated successfully.`,
        path: '/profile',
      });
      showToast({
        title: 'Profile updated',
        description: 'Your account settings have been saved.',
      });
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Unable to save profile changes.');
    } finally {
      setProfileSubmitting(false);
    }
  }

  async function submitPassword(event) {
    event.preventDefault();
    const validationErrors = validatePasswordChange(passwordValues);

    if (Object.keys(validationErrors).length) {
      setPasswordErrors(validationErrors);
      return;
    }

    setPasswordSubmitting(true);
    setPasswordError('');

    try {
      await updatePassword(passwordValues);
      addActivityEntry({
        title: 'Password updated',
        description: 'The account password was changed from the profile page.',
      });
      addNotification({
        title: 'Password changed',
        message: 'Your password was updated successfully.',
        path: '/profile',
      });
      showToast({
        title: 'Password changed',
        description: 'Your credentials were updated successfully.',
      });
      setPasswordValues({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Unable to update password.');
    } finally {
      setPasswordSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Profile' }]}
        description="Manage your personal information, password, and role visibility."
        title="Profile"
      />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <div className="flex items-center gap-4">
            <Avatar name={user?.fullName} size="xl" />
            <div>
              <h2 className="text-2xl font-bold text-[var(--text)]">{user?.fullName}</h2>
              <p className="mt-1 text-sm text-muted">{user?.email}</p>
            </div>
          </div>

          <div className="mt-8 space-y-4 rounded-3xl bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-brand-600" />
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">Role</p>
                <p className="text-sm text-muted">{user?.role}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">Title</p>
              <p className="mt-1 text-sm text-muted">{user?.title || 'Team member'}</p>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-[var(--text)]">Personal information</h2>
            <p className="mt-2 text-sm text-muted">Update the profile details shown across the CRM interface.</p>

            <form className="mt-6 space-y-5" onSubmit={submitProfile}>
              <div className="grid gap-5 md:grid-cols-2">
                <FormField error={profileErrors.fullName} htmlFor="fullName" label="Full name">
                  <Input id="fullName" name="fullName" onChange={handleProfileChange} value={profileValues.fullName} />
                </FormField>
                <FormField error={profileErrors.email} htmlFor="email" label="Email">
                  <Input id="email" name="email" onChange={handleProfileChange} type="email" value={profileValues.email} />
                </FormField>
                <FormField htmlFor="phone" label="Phone">
                  <Input id="phone" name="phone" onChange={handleProfileChange} value={profileValues.phone} />
                </FormField>
                <FormField htmlFor="title" label="Job title">
                  <Input id="title" name="title" onChange={handleProfileChange} value={profileValues.title} />
                </FormField>
              </div>

              {profileError ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{profileError}</div> : null}

              <Button isLoading={profileSubmitting} type="submit">
                Save changes
              </Button>
            </form>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-[var(--text)]">Change password</h2>
            <p className="mt-2 text-sm text-muted">Keep your account secure with a fresh password.</p>

            <form className="mt-6 space-y-5" onSubmit={submitPassword}>
              <FormField error={passwordErrors.currentPassword} htmlFor="currentPassword" label="Current password">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  onChange={handlePasswordChange}
                  type="password"
                  value={passwordValues.currentPassword}
                />
              </FormField>

              <div className="grid gap-5 md:grid-cols-2">
                <FormField error={passwordErrors.newPassword} htmlFor="newPassword" label="New password">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    onChange={handlePasswordChange}
                    type="password"
                    value={passwordValues.newPassword}
                  />
                </FormField>
                <FormField error={passwordErrors.confirmNewPassword} htmlFor="confirmNewPassword" label="Confirm new password">
                  <Input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    onChange={handlePasswordChange}
                    type="password"
                    value={passwordValues.confirmNewPassword}
                  />
                </FormField>
              </div>

              {passwordError ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{passwordError}</div> : null}

              <Button isLoading={passwordSubmitting} type="submit" variant="secondary">
                Update password
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
