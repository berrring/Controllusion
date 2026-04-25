import { useContext, useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { UIContext } from '../../context/UIContext';
import { addActivityEntry, addNotification } from '../../services/storage';
import Avatar from '../../components/common/Avatar';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FormField from '../../components/forms/FormField';

function Toggle({ checked, onChange }) {
  return (
    <button
      className={`relative h-5 w-9 rounded-full transition ${checked ? 'bg-[#4c42e8]' : 'bg-[#dfe6f2]'}`}
      onClick={onChange}
      type="button"
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${checked ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
  );
}

function splitName(name = '') {
  const [firstName = '', ...rest] = name.split(' ');
  return { firstName, lastName: rest.join(' ') || 'Mercer' };
}

function ProfilePage() {
  const { user, saveProfile } = useAuth();
  const { showToast } = useContext(UIContext);
  const initialName = splitName(user?.fullName || 'Alex Mercer');
  const [values, setValues] = useState({
    firstName: initialName.firstName,
    lastName: initialName.lastName,
    email: user?.email || 'alex.mercer@controllusion.com',
    phone: user?.phone || '+1 (555) 019-2834',
    bio: 'Senior Administrator focused on optimizing CRM workflows and leading cross-functional teams to drive enterprise sales efficiency. Over 8 years of experience in B2B SaaS environments.',
    timezone: 'Pacific Time (PT) - San Francisco',
  });
  const [notifications, setNotifications] = useState({
    weekly: true,
    deals: true,
    marketing: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const name = splitName(user?.fullName || 'Alex Mercer');
    setValues((current) => ({
      ...current,
      firstName: name.firstName,
      lastName: name.lastName,
      email: user?.email || current.email,
      phone: user?.phone || current.phone,
    }));
  }, [user]);

  function updateValue(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function saveChanges() {
    setSaving(true);
    try {
      await saveProfile({
        fullName: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        phone: values.phone,
        title: 'Workspace Administrator',
        themePreference: 'light',
        avatarUrl: user?.avatarUrl || null,
      });
      addActivityEntry({
        title: 'Profile updated',
        description: 'Personal information and profile preferences were saved.',
      });
      addNotification({
        title: 'Profile saved',
        message: 'Your profile settings were updated.',
        path: '/profile',
      });
      showToast({ title: 'Profile changes saved successfully' });
    } catch (error) {
      showToast({
        title: 'Profile update failed',
        description: error.response?.data?.message || 'Unable to save profile right now.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  }

  function requestDeactivate() {
    addNotification({
      title: 'Account deactivation requested',
      message: 'A workspace owner must approve account deactivation.',
      path: '/profile',
    });
    showToast({
      title: 'Deactivation request queued',
      description: 'A workspace owner approval is required before this account changes state.',
      type: 'info',
    });
  }

  return (
    <div className="mx-auto max-w-[820px] space-y-6">
      <div>
        <p className="text-[11px] font-bold text-[#52627b]">Settings › Profile Settings</p>
        <h1 className="mt-10 text-[24px] font-black tracking-[-0.05em] text-[#14213d]">Profile Settings</h1>
        <p className="mt-1 text-[12px] font-medium text-[#52627b]">Manage your personal information, workspace preferences, and communication settings.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[230px_1fr]">
        <div className="space-y-5">
          <Card className="rounded-[9px] p-6 text-center">
            <div className="mx-auto h-20 w-20">
              <Avatar name={`${values.firstName} ${values.lastName}`} size="xl" src={user?.avatarUrl} />
            </div>
            <h2 className="mt-5 text-[14px] font-black text-[#14213d]">{values.firstName} {values.lastName}</h2>
            <p className="mt-1 text-[11px] font-medium text-[#70809a]">{values.email}</p>
            <span className="mt-4 inline-flex rounded-full bg-[#efe8ff] px-3 py-1 text-[10px] font-bold text-[#4c42e8]">
              Administrator
            </span>
          </Card>

          <Card className="rounded-[9px] p-5">
            <h3 className="text-[11px] font-black uppercase tracking-[0.08em] text-[#52627b]">Workspace Details</h3>
            <div className="mt-4 space-y-4 text-[11px]">
              <div>
                <p className="font-bold text-[#70809a]">Current Workspace</p>
                <p className="mt-1 font-black text-[#14213d]">Acme Corporation</p>
              </div>
              <div>
                <p className="font-bold text-[#70809a]">Current Plan</p>
                <p className="mt-1 font-black text-[#14213d]">Enterprise Plus</p>
              </div>
              <div>
                <div className="mb-1 flex justify-between font-bold text-[#70809a]">
                  <span>Storage Used</span>
                  <span>458GB / 100GB</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#e0e7fb]">
                  <div className="h-full w-[78%] rounded-full bg-[#4c42e8]" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="rounded-[9px] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-black text-[#14213d]">Personal Information</h2>
                <p className="mt-1 text-[11px] text-[#70809a]">Update your personal details and public profile.</p>
              </div>
              <Button isLoading={saving} onClick={saveChanges}>Save Changes</Button>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <FormField htmlFor="firstName" label="First Name">
                <Input id="firstName" name="firstName" onChange={updateValue} value={values.firstName} />
              </FormField>
              <FormField htmlFor="lastName" label="Last Name">
                <Input id="lastName" name="lastName" onChange={updateValue} value={values.lastName} />
              </FormField>
              <FormField htmlFor="email" label="Email Address">
                <Input id="email" name="email" onChange={updateValue} value={values.email} />
              </FormField>
              <FormField htmlFor="phone" label="Phone Number">
                <Input id="phone" name="phone" onChange={updateValue} value={values.phone} />
              </FormField>
              <div className="md:col-span-2">
                <FormField htmlFor="bio" label="Professional Bio">
                  <Input as="textarea" id="bio" name="bio" onChange={updateValue} rows={4} value={values.bio} />
                </FormField>
              </div>
              <div className="md:col-span-2">
                <FormField htmlFor="timezone" label="Timezone">
                  <Input id="timezone" name="timezone" onChange={updateValue} value={values.timezone} />
                </FormField>
              </div>
            </div>
          </Card>

          <Card className="rounded-[9px] p-6">
            <h2 className="text-[15px] font-black text-[#14213d]">Email Preferences</h2>
            <p className="mt-1 text-[11px] text-[#70809a]">Manage which notifications you receive to your primary email.</p>
            <div className="mt-7 space-y-7">
              {[
                ['weekly', 'Weekly Digest', 'Receive a weekly summary of your workspace activity and key metrics.'],
                ['deals', 'Deal Status Updates', 'Get notified immediately when a high-value deal changes stages.'],
                ['marketing', 'Marketing Communications', 'Tips, tricks, and product announcements from the Controllusion team.'],
              ].map(([key, title, description]) => (
                <div className="flex items-center justify-between gap-4" key={key}>
                  <div>
                    <p className="text-[12px] font-black text-[#14213d]">{title}</p>
                    <p className="mt-1 text-[11px] text-[#70809a]">{description}</p>
                  </div>
                  <Toggle checked={notifications[key]} onChange={() => setNotifications((current) => ({ ...current, [key]: !current[key] }))} />
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[9px] border-[#ffe2e2] bg-[#fffafa] p-6">
            <h2 className="text-[15px] font-black text-[#e11d48]">Danger Zone</h2>
            <div className="mt-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-[#e11d48]" />
                <div>
                  <p className="text-[12px] font-black text-[#14213d]">Delete Account</p>
                  <p className="text-[11px] text-[#70809a]">Once you delete your account, there is no going back.</p>
                </div>
              </div>
              <Button onClick={requestDeactivate} variant="danger">Deactivate Account</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
