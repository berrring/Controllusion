import { useContext, useEffect, useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
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
  const [avatarSubmitting, setAvatarSubmitting] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [notifications, setNotifications] = useState({
    newCustomers: true,
    weeklySummary: true,
    marketing: false,
  });

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

  function resetProfileForm() {
    setProfileValues({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      title: user?.title || '',
      themePreference: user?.themePreference || 'light',
      avatarUrl: user?.avatarUrl || null,
    });
    setProfileErrors({});
    setProfileError('');
    showToast({
      title: 'Changes discarded',
      description: 'Profile fields were reset to the last saved version.',
      type: 'info',
    });
  }

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
    if (avatarSubmitting || profileSubmitting) {
      return;
    }
    avatarInputRef.current?.click();
  }

  async function persistAvatar(nextAvatarUrl) {
    const nextValues = {
      ...profileValues,
      avatarUrl: nextAvatarUrl,
    };

    setProfileValues(nextValues);
    setProfileError('');
    setAvatarSubmitting(true);

    try {
      await saveProfile(nextValues);
      showToast({
        title: nextAvatarUrl ? 'Avatar updated' : 'Avatar removed',
        description: nextAvatarUrl ? 'Your new avatar was saved immediately.' : 'Your avatar was removed.',
      });
    } catch (error) {
      setProfileError(error.response?.data?.message || 'Unable to update avatar right now.');
      setProfileValues((current) => ({
        ...current,
        avatarUrl: user?.avatarUrl || null,
      }));
    } finally {
      setAvatarSubmitting(false);
    }
  }

  function removeAvatar() {
    if (!profileValues.avatarUrl && !user?.avatarUrl) {
      return;
    }

    void persistAvatar(null);
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

    const reader = new FileReader();
    reader.onload = () => {
      const nextAvatarUrl = typeof reader.result === 'string' ? reader.result : null;
      if (!nextAvatarUrl) {
        setProfileError('Unable to read the selected image.');
        return;
      }
      void persistAvatar(nextAvatarUrl);
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
      <PageHeader description="Manage your account details and preferences." title="Profile Settings" />

      <form className="space-y-6" onSubmit={submitProfile}>
        <Card className="rounded-[18px]">
          <h2 className="text-[24px] font-black text-[#1f2a44]">Public Profile</h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-[180px_1fr]">
            <div className="flex flex-col items-start gap-4">
              <button
                className="group relative overflow-hidden rounded-full focus:outline-none focus:ring-4 focus:ring-[#dfe6ff]"
                disabled={avatarSubmitting || profileSubmitting}
                onClick={openAvatarPicker}
                type="button"
              >
                <Avatar
                  name={profileValues.fullName || user?.fullName}
                  size="xl"
                  src={profileValues.avatarUrl || user?.avatarUrl}
                />
                <span className="absolute inset-0 flex items-center justify-center bg-slate-950/0 text-xs font-semibold text-white transition group-hover:bg-slate-950/28">
                  Edit
                </span>
              </button>
              <input accept="image/*" className="hidden" onChange={handleAvatarChange} ref={avatarInputRef} type="file" />
              <div className="flex w-full max-w-[260px] flex-col gap-2 sm:flex-row">
                <Button
                  className="min-w-[120px] justify-center"
                  disabled={avatarSubmitting || profileSubmitting}
                  isLoading={avatarSubmitting}
                  onClick={openAvatarPicker}
                  type="button"
                  variant="secondary"
                >
                  <ImagePlus className="h-4 w-4" />
                  Change
                </Button>
                <Button
                  className="min-w-[120px] justify-center"
                  disabled={avatarSubmitting || profileSubmitting || (!profileValues.avatarUrl && !user?.avatarUrl)}
                  onClick={removeAvatar}
                  type="button"
                  variant="ghost"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </div>
              <p className="text-xs leading-5 text-[#7b86a0]">Click the avatar or use Change. It saves immediately after image selection.</p>
            </div>

            <div className="space-y-5">
              <FormField error={profileErrors.fullName} htmlFor="fullName" label="Full Name">
                <Input id="fullName" name="fullName" onChange={handleProfileChange} value={profileValues.fullName} />
              </FormField>

              <FormField htmlFor="title" label="Bio">
                <Input
                  as="textarea"
                  id="title"
                  name="title"
                  onChange={handleProfileChange}
                  rows={4}
                  value={profileValues.title}
                />
              </FormField>
            </div>
          </div>
        </Card>

        <Card className="rounded-[18px]">
          <h2 className="text-[24px] font-black text-[#1f2a44]">Account Settings</h2>

          <div className="mt-6 space-y-6">
            <FormField error={profileErrors.email} htmlFor="email" label="Email Address">
              <Input id="email" name="email" onChange={handleProfileChange} type="email" value={profileValues.email} />
            </FormField>

            <div className="grid gap-5 md:grid-cols-2">
              <FormField htmlFor="phone" label="Phone">
                <Input id="phone" name="phone" onChange={handleProfileChange} value={profileValues.phone} />
              </FormField>
              <FormField htmlFor="themePreference" label="Theme Preference">
                <Input disabled id="themePreference" value={profileValues.themePreference || 'light'} />
              </FormField>
            </div>

            <div className="border-t border-[var(--border)] pt-6">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.1em] text-[#8d97ad]">Notifications</p>
              <div className="space-y-3">
                {[
                  { key: 'newCustomers', label: 'Email me when a new customer signs up' },
                  { key: 'weeklySummary', label: 'Weekly summary reports' },
                  { key: 'marketing', label: 'Marketing and promotional emails' },
                ].map((item) => (
                  <label className="flex items-center gap-3 text-sm text-[#56627b]" key={item.key}>
                    <input
                      checked={notifications[item.key]}
                      className="h-4 w-4 rounded border-[var(--border)] accent-[#4c42e8]"
                      onChange={() =>
                        setNotifications((current) => ({
                          ...current,
                          [item.key]: !current[item.key],
                        }))
                      }
                      type="checkbox"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {profileError ? <div className="rounded-[16px] bg-[#fff1ee] px-4 py-3 text-sm text-[#ec6a60]">{profileError}</div> : null}

        <div className="flex justify-end gap-3">
          <Button onClick={resetProfileForm} type="button" variant="ghost">
            Cancel
          </Button>
          <Button isLoading={profileSubmitting} type="submit">
            Save Changes
          </Button>
        </div>
      </form>

      <Card className="rounded-[18px]">
        <h2 className="text-[24px] font-black text-[#1f2a44]">Password</h2>
        <form className="mt-6 space-y-5" onSubmit={submitPassword}>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField error={passwordErrors.currentPassword} htmlFor="currentPassword" label="Current Password">
              <Input id="currentPassword" name="currentPassword" onChange={handlePasswordChange} type="password" value={passwordValues.currentPassword} />
            </FormField>
            <FormField error={passwordErrors.newPassword} htmlFor="newPassword" label="New Password">
              <Input id="newPassword" name="newPassword" onChange={handlePasswordChange} type="password" value={passwordValues.newPassword} />
            </FormField>
          </div>

          <FormField error={passwordErrors.confirmNewPassword} htmlFor="confirmNewPassword" label="Confirm New Password">
            <Input
              id="confirmNewPassword"
              name="confirmNewPassword"
              onChange={handlePasswordChange}
              type="password"
              value={passwordValues.confirmNewPassword}
            />
          </FormField>

          {passwordError ? <div className="rounded-[16px] bg-[#fff1ee] px-4 py-3 text-sm text-[#ec6a60]">{passwordError}</div> : null}

          <div className="flex justify-end">
            <Button isLoading={passwordSubmitting} type="submit" variant="secondary">
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ProfilePage;
