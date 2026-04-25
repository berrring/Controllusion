import { useContext, useRef, useState } from 'react';
import { AlertTriangle, Copy, Image, Info, X } from 'lucide-react';
import { UIContext } from '../../context/UIContext';
import {
  addActivityEntry,
  addNotification,
  getWorkspaceSettings,
  saveWorkspaceSettings,
} from '../../services/storage';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import FormField from '../../components/forms/FormField';

function Toggle({ checked, onChange }) {
  return (
    <button className={`relative h-5 w-9 rounded-full transition ${checked ? 'bg-[#4c42e8]' : 'bg-[#dfe6f2]'}`} onClick={onChange} type="button">
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${checked ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
  );
}

function SettingsPage() {
  const { showToast } = useContext(UIContext);
  const logoInputRef = useRef(null);
  const [savedSettings, setSavedSettings] = useState(() => getWorkspaceSettings());
  const [settings, setSettings] = useState(savedSettings);
  const [saving, setSaving] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePhrase, setDeletePhrase] = useState('');
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  function updateSetting(event) {
    const { name, value } = event.target;
    setSettings((current) => ({
      ...current,
      [name]: name === 'workspaceUrl' ? sanitizeSlug(value) : value,
    }));
  }

  function sanitizeSlug(value) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function hasValidEmail(value) {
    return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateSettings() {
    if (!settings.workspaceName.trim()) {
      return 'Workspace name is required.';
    }

    if (!settings.workspaceUrl.trim()) {
      return 'Workspace URL slug is required.';
    }

    if (!/^#[0-9a-fA-F]{6}$/.test(settings.brandColor)) {
      return 'Brand color must be a valid hex value, for example #4c42e8.';
    }

    if (!hasValidEmail(settings.adminEmail) || !hasValidEmail(settings.supportEmail)) {
      return 'Enter valid admin and support email addresses.';
    }

    return null;
  }

  async function saveSettings() {
    const validationError = validateSettings();
    if (validationError) {
      showToast({ title: 'Settings not saved', description: validationError, type: 'error' });
      return;
    }

    setSaving(true);
    await new Promise((resolve) => {
      window.setTimeout(resolve, 220);
    });
    const nextSettings = saveWorkspaceSettings(settings);
    setSavedSettings(nextSettings);
    setSettings(nextSettings);
    addActivityEntry({
      title: 'Workspace settings updated',
      description: 'Workspace preferences and branding were saved.',
    });
    addNotification({
      title: 'Settings saved',
      message: 'Workspace preferences were updated successfully.',
      path: '/settings',
    });
    showToast({ title: 'Settings saved successfully' });
    setSaving(false);
  }

  function discardChanges() {
    setSettings(savedSettings);
    showToast({
      title: 'Changes discarded',
      description: 'Workspace settings were restored to the last saved version.',
      type: 'info',
    });
  }

  function uploadLogo(event) {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast({ title: 'Logo not uploaded', description: 'Choose an SVG, PNG, JPG, or another image file.', type: 'error' });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showToast({ title: 'Logo not uploaded', description: 'Logo file must be under 2MB.', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSettings((current) => ({
        ...current,
        logoName: file.name,
        logoDataUrl: reader.result,
      }));
      showToast({
        title: 'Logo ready to save',
        description: `${file.name} was uploaded locally. Save changes to persist it.`,
        type: 'info',
      });
    };
    reader.readAsDataURL(file);
  }

  async function copyWorkspaceId() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard is unavailable.');
      }
      await navigator.clipboard.writeText(settings.workspaceId);
      showToast({ title: 'Workspace ID copied', description: `${settings.workspaceId} is ready to paste.`, type: 'info' });
    } catch (error) {
      showToast({ title: 'Workspace ID', description: settings.workspaceId, type: 'info' });
    }
  }

  async function confirmDeleteRequest() {
    if (deletePhrase !== settings.workspaceName) {
      showToast({
        title: 'Confirmation required',
        description: `Type "${settings.workspaceName}" to confirm this destructive request.`,
        type: 'error',
      });
      return;
    }

    setDeleteSubmitting(true);
    await new Promise((resolve) => {
      window.setTimeout(resolve, 260);
    });

    const nextSettings = saveWorkspaceSettings({
      ...settings,
      deletionRequestedAt: new Date().toISOString(),
      deletionStatus: 'Pending owner approval',
    });
    setSavedSettings(nextSettings);
    setSettings(nextSettings);
    setDeleteSubmitting(false);
    setDeleteModalOpen(false);
    setDeletePhrase('');
    addActivityEntry({
      title: 'Workspace deletion requested',
      description: `${nextSettings.workspaceName} deletion was requested and requires owner approval.`,
    });
    addNotification({
      title: 'Deletion request pending',
      message: 'Workspace deletion is queued for owner approval. No CRM data was removed.',
      path: '/settings',
    });
    showToast({
      title: 'Deletion request recorded',
      description: 'No workspace data was deleted. Owner approval is required before any destructive action.',
      type: 'info',
    });
  }

  return (
    <div className="mx-auto max-w-[820px] space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[24px] font-black tracking-[-0.05em] text-[#14213d]">Workspace Settings</h1>
          <p className="mt-1 text-[12px] font-medium text-[#52627b]">Manage your organization&apos;s general preferences and branding.</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={discardChanges} variant="secondary">Discard</Button>
          <Button isLoading={saving} onClick={saveSettings}>Save Changes</Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_240px]">
        <div className="space-y-5">
          <Card className="rounded-[9px] p-6">
            <h2 className="text-[15px] font-black text-[#14213d]">Organization Profile</h2>
            <div className="mt-6 space-y-5">
              <FormField htmlFor="workspaceName" label="Workspace Name">
                <Input id="workspaceName" name="workspaceName" onChange={updateSetting} value={settings.workspaceName} />
              </FormField>
              <FormField htmlFor="workspaceUrl" label="Workspace URL">
                <div className="flex">
                  <span className="flex h-9 items-center rounded-l-[7px] border border-r-0 border-[#e8eef8] bg-[#eef4ff] px-3 text-[11px] font-semibold text-[#70809a]">
                    controllusion.com/
                  </span>
                  <Input className="rounded-l-none" id="workspaceUrl" name="workspaceUrl" onChange={updateSetting} value={settings.workspaceUrl} />
                </div>
              </FormField>
              <FormField htmlFor="description" label="Description">
                <Input as="textarea" id="description" name="description" onChange={updateSetting} rows={3} value={settings.description} />
              </FormField>
            </div>
          </Card>

          <Card className="rounded-[9px] p-6">
            <h2 className="text-[15px] font-black text-[#14213d]">Contact Information</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <FormField htmlFor="adminEmail" label="Admin Email">
                <Input id="adminEmail" name="adminEmail" onChange={updateSetting} value={settings.adminEmail} />
              </FormField>
              <FormField htmlFor="supportEmail" label="Support Email">
                <Input id="supportEmail" name="supportEmail" onChange={updateSetting} value={settings.supportEmail} />
              </FormField>
            </div>
          </Card>

          <Card className="rounded-[9px] border-[#ffe2e2] bg-[#fffafa] p-6">
            <h2 className="text-[15px] font-black text-[#e11d48]">Danger Zone</h2>
            <div className="mt-5 flex items-center justify-between rounded-[7px] bg-white p-4">
              <div>
                <p className="text-[12px] font-black text-[#14213d]">Delete Workspace</p>
                <p className="text-[11px] text-[#70809a]">
                  {settings.deletionRequestedAt ? `Request status: ${settings.deletionStatus}.` : 'Once approved, workspace deletion cannot be undone.'}
                </p>
              </div>
              <Button
                onClick={() => setDeleteModalOpen(true)}
                variant="danger"
              >
                {settings.deletionRequestedAt ? 'Review Request' : 'Delete Organization'}
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="rounded-[9px] bg-[#eef4ff] p-5">
            <h2 className="text-[14px] font-black text-[#14213d]">Branding</h2>
            <p className="mt-1 text-[11px] text-[#70809a]">Customize how your workspace looks.</p>
            <button
              className="mt-5 flex h-[108px] w-full flex-col items-center justify-center rounded-[9px] border border-dashed border-[#cbd8ef] bg-[#f8fbff] text-center"
              onClick={() => logoInputRef.current?.click()}
              type="button"
            >
              {settings.logoDataUrl ? (
                <img alt="Workspace logo preview" className="h-10 max-w-[120px] object-contain" src={settings.logoDataUrl} />
              ) : (
                <Image className="h-5 w-5 text-[#4c42e8]" />
              )}
              <span className="mt-2 text-[11px] font-bold text-[#4c42e8]">
                {settings.logoName || 'Click to upload logo'}
              </span>
              <span className="mt-1 text-[9px] text-[#70809a]">SVG, PNG, JPG (max 2MB)</span>
            </button>
            <input accept="image/*" className="hidden" onChange={uploadLogo} ref={logoInputRef} type="file" />
            <div className="mt-5">
              <FormField htmlFor="brandColor" label="Primary Brand Color">
                <div className="flex gap-2">
                  <span className="h-9 w-9 rounded-[7px]" style={{ backgroundColor: settings.brandColor || '#4c42e8' }} />
                  <Input id="brandColor" name="brandColor" onChange={updateSetting} value={settings.brandColor} />
                </div>
              </FormField>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-[12px] font-black text-[#14213d]">Require SSO</p>
                <p className="text-[10px] text-[#70809a]">Enforce Single Sign-On</p>
              </div>
              <Toggle checked={settings.requireSso} onChange={() => setSettings((current) => ({ ...current, requireSso: !current.requireSso }))} />
            </div>
          </Card>

          <Card className="rounded-[9px] bg-[#eef4ff] p-5">
            <h2 className="flex items-center gap-2 text-[14px] font-black text-[#14213d]">
              <Info className="h-4 w-4 text-[#4c42e8]" />
              Workspace ID
            </h2>
            <p className="mt-3 text-[11px] leading-5 text-[#52627b]">You may need this ID when contacting support or setting up API integrations.</p>
            <button
              className="mt-4 flex h-9 w-full items-center justify-between rounded-[7px] bg-white px-3 text-[11px] font-bold text-[#52627b]"
              onClick={copyWorkspaceId}
              type="button"
            >
              {settings.workspaceId}
              <Copy className="h-3.5 w-3.5" />
            </button>
          </Card>
        </div>
      </div>

      {deleteModalOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#101828]/40 px-4">
          <div className="w-full max-w-[440px] rounded-[14px] border border-[#ffe2e2] bg-white p-6 shadow-[0_30px_80px_-36px_rgba(15,23,42,0.45)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff1f2] text-[#e11d48]">
                  <AlertTriangle className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-[16px] font-black text-[#14213d]">Confirm workspace deletion</h2>
                  <p className="mt-2 text-[12px] leading-5 text-[#52627b]">
                    This creates an approval request only. CRM data stays intact until an owner completes the destructive backend deletion.
                  </p>
                </div>
              </div>
              <button className="text-[#70809a]" onClick={() => setDeleteModalOpen(false)} type="button">
                <X className="h-4 w-4" />
              </button>
            </div>
            {settings.deletionRequestedAt ? (
              <div className="mt-5 rounded-[9px] bg-[#fff7ed] p-4 text-[11px] leading-5 text-[#9a3412]">
                A deletion request is already pending for this workspace. Reconfirming updates the request timestamp and notifies the workspace.
              </div>
            ) : null}
            <div className="mt-5">
              <FormField
                hint={`Type ${settings.workspaceName} exactly to continue.`}
                htmlFor="deletePhrase"
                label="Confirmation"
              >
                <Input
                  id="deletePhrase"
                  name="deletePhrase"
                  onChange={(event) => setDeletePhrase(event.target.value)}
                  placeholder={settings.workspaceName}
                  value={deletePhrase}
                />
              </FormField>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button onClick={() => setDeleteModalOpen(false)} variant="secondary">Cancel</Button>
              <Button disabled={deletePhrase !== settings.workspaceName} isLoading={deleteSubmitting} onClick={confirmDeleteRequest} variant="danger">
                Request Deletion
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SettingsPage;
