import { useContext, useEffect, useRef, useState } from 'react';
import { ImagePlus, ShieldCheck, Trash2 } from 'lucide-react';
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
  const avatarInputRef = useRef(null);
  const [profileValues, setProfileValues] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    title: user?.title || '',
    themePreference: user?.themePreference || 'light',
    avatarUrl: user?.avatarUrl || null,
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
      avatarUrl: user?.avatarUrl || null,
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

  function openAvatarPicker() {
    avatarInputRef.current?.click();
  }

  function removeAvatar() {
    setProfileValues((current) => ({ ...current, avatarUrl: null }));
    setProfileError('');
    showToast({
      title: 'Avatar removed',
      description: 'Save profile changes to keep the updated avatar state.',
      type: 'info',
    });
  }

  function handleAvatarChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setProfileError('Please choose a valid image file for the avatar.');
      event.target.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileError('Avatar image must be smaller than 2 MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileValues((current) => ({
        ...current,
        avatarUrl: typeof reader.result === 'string' ? reader.result : null,
      }));
      setProfileError('');
      showToast({
        title: 'Avatar ready',
        description: 'Save profile changes to apply the new avatar everywhere.',
      });
    };
    reader.onerror = () => {
      setProfileError('Unable to read this image file. Try another one.');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
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
            <Avatar name={profileValues.fullName || user?.fullName} size="xl" src={profileValues.avatarUrl || user?.avatarUrl} />
            <div>
              <h2 className="text-2xl font-bold text-[var(--text)]">{profileValues.fullName || user?.fullName}</h2>
              <p className="mt-1 text-sm text-muted">{profileValues.email || user?.email}</p>
              <p className="mt-2 text-sm text-muted">
                Start with the basics. Add your avatar, role, and phone number so teammates can recognize your account.
              </p>
            </div>
          </div>

          <input accept="image/*" className="hidden" onChange={handleAvatarChange} ref={avatarInputRef} type="file" />

          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={openAvatarPicker} type="button" variant="secondary">
              <ImagePlus className="h-4 w-4" />
              Change avatar
            </Button>
            <Button onClick={removeAvatar} type="button" variant="ghost">
              <Trash2 className="h-4 w-4" />
              Remove avatar
            </Button>
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
              <p className="mt-1 text-sm text-muted">
                {profileValues.title || user?.title || 'Add your role from the form to complete your profile.'}
              </p>
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
                  <Input
                    id="fullName"
                    name="fullName"
                    onChange={handleProfileChange}
                    placeholder="Jordan Blake"
                    value={profileValues.fullName}
                  />
                </FormField>
                <FormField error={profileErrors.email} htmlFor="email" label="Email">
                  <Input
                    id="email"
                    name="email"
                    onChange={handleProfileChange}
                    placeholder="name@company.com"
                    type="email"
                    value={profileValues.email}
                  />
                </FormField>
                <FormField htmlFor="phone" label="Phone">
                  <Input
                    id="phone"
                    name="phone"
                    onChange={handleProfileChange}
                    placeholder="+1 (555) 000-0000"
                    value={profileValues.phone}
                  />
                </FormField>
                <FormField htmlFor="title" label="Job title">
                  <Input
                    id="title"
                    name="title"
                    onChange={handleProfileChange}
                    placeholder="Account Executive"
                    value={profileValues.title}
                  />
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
