import { useContext, useEffect, useMemo, useState } from 'react';
import { Globe, Mail, MapPin, Pencil, Phone, Trash2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as customerService from '../../services/customerService';
import { UIContext } from '../../context/UIContext';
import { addActivityEntry, addNotification } from '../../services/storage';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import Avatar from '../../components/common/Avatar';
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/formatters';

function getHealthScore(customer) {
  const stageScores = {
    Lead: 54,
    Qualified: 74,
    Proposal: 83,
    Negotiation: 91,
    Won: 98,
    Lost: 26,
  };

  let score = stageScores[customer.stage] || 62;
  if (customer.status === 'VIP') {
    score += 6;
  }
  if (customer.status === 'Inactive') {
    score -= 18;
  }

  return Math.max(12, Math.min(score, 99));
}

function getDomain(customer) {
  if (customer.email?.includes('@')) {
    return customer.email.split('@')[1];
  }
  return `${customer.company || 'controllusion'}.com`.toLowerCase().replace(/\s+/g, '-');
}

function CustomerDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useContext(UIContext);
  const [customer, setCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function loadCustomer() {
    setLoading(true);
    setError('');
    try {
      const data = await customerService.getCustomerById(id);
      setCustomer(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load this customer.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCustomer();
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await customerService.deleteCustomer(id);
      addActivityEntry({
        title: 'Customer deleted',
        description: `${customer.fullName} was removed from the CRM from the detail page.`,
      });
      addNotification({
        title: 'Customer deleted',
        message: `${customer.fullName} was removed successfully.`,
        path: '/customers',
      });
      showToast({
        title: 'Customer deleted',
        description: `${customer.fullName} has been removed.`,
      });
      navigate('/customers');
    } catch (err) {
      showToast({
        title: 'Delete failed',
        description: err.response?.data?.message || 'Unable to delete customer.',
        type: 'error',
      });
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  const primaryContacts = useMemo(() => {
    if (!customer) {
      return [];
    }

    return [
      {
        id: 'primary',
        name: customer.fullName,
        title: customer.jobTitle || 'Primary Contact',
        email: customer.email,
        phone: customer.phone,
      },
      ...(customer.noteEntries?.length
        ? [
            {
              id: 'owner',
              name: customer.noteEntries[0].author,
              title: 'Account Partner',
              email: `team@${getDomain(customer)}`,
              phone: customer.phone,
            },
          ]
        : []),
    ];
  }, [customer]);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton rows={4} />
        <LoadingSkeleton rows={8} />
      </div>
    );
  }

  if (error || !customer) {
    return <ErrorState description={error || 'Customer record not found.'} onRetry={loadCustomer} title="Customer unavailable" />;
  }

  const healthScore = getHealthScore(customer);
  const domain = getDomain(customer);
  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'activity', label: 'Activity' },
    { key: 'orders', label: 'Orders' },
    { key: 'notes', label: 'Notes' },
  ];

  return (
    <div className="space-y-6">
      <Card className="rounded-[18px]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#f5f7ff] text-[#5b50e9]">
              <Avatar name={customer.company} size="md" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[34px] font-black tracking-tight text-[#1f2a44]">{customer.company}</h1>
                {customer.status === 'VIP' ? <Badge variant="warning">Premium</Badge> : null}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#7b86a0]">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {customer.location || 'Remote'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="h-4 w-4" />
                  {domain}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={() => setDeleteOpen(true)} variant="secondary">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Link to={`/customers/${customer.id}/edit`}>
              <Button>
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 rounded-[12px] bg-[#eef2ff] p-1">
          {tabs.map((tab) => (
            <button
              className={`rounded-[10px] px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.key ? 'bg-white text-[#1f2a44] shadow-[0_10px_20px_-16px_rgba(31,42,68,0.25)]' : 'text-[#6f7b94]'
              }`}
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {activeTab === 'overview' ? (
        <div className="grid gap-5 xl:grid-cols-[1.25fr_0.55fr]">
          <div className="space-y-5">
            <Card className="rounded-[18px]">
              <h2 className="flex items-center gap-2 text-[24px] font-black text-[#1f2a44]">Primary Contacts</h2>
              <div className="mt-5 space-y-4">
                {primaryContacts.map((contact) => (
                  <div className="flex flex-col gap-3 rounded-[16px] bg-[#f6f8ff] p-4 md:flex-row md:items-center md:justify-between" key={contact.id}>
                    <div className="flex items-center gap-3">
                      <Avatar name={contact.name} size="sm" />
                      <div>
                        <p className="font-semibold text-[#1f2a44]">{contact.name}</p>
                        <p className="text-sm text-[#7b86a0]">{contact.title}</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-[#56627b]">
                      <p className="inline-flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#7f88a1]" />
                        {contact.email}
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[#7f88a1]" />
                        {contact.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[18px]">
              <h2 className="text-[24px] font-black text-[#1f2a44]">Company Blueprint</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8d97ad]">Industry</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a44]">{customer.industry || 'Technology Services'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8d97ad]">Annual Revenue</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a44]">{formatCurrency(customer.dealValue)} - $500K</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8d97ad]">Employee Count</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a44]">
                    {customer.status === 'VIP' ? '1,200+' : customer.status === 'Active' ? '201-1000' : '1-200'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8d97ad]">Tax ID / EIN</p>
                  <p className="mt-2 text-lg font-semibold text-[#1f2a44]">{customer.id.slice ? customer.id.slice(0, 8) : String(customer.id).slice(0, 8)}-2026</p>
                </div>
              </div>
              <div className="mt-6 rounded-[16px] bg-[#f6f8ff] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8d97ad]">Headquarters Address</p>
                <p className="mt-2 text-sm leading-7 text-[#56627b]">
                  {customer.location || 'Remote'}
                  <br />
                  {customer.company} Enterprise Hub
                </p>
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="rounded-[18px] bg-[linear-gradient(135deg,#4c42e8_0%,#6756f5_100%)] text-white">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">ACCOUNT HEALTH</p>
              <div className="mt-3 flex items-end gap-2">
                <p className="text-5xl font-black">{healthScore}</p>
                <p className="pb-1 text-white/70">/ 100</p>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-white/80">
                <div className="flex items-center justify-between gap-3">
                  <span>Renewal Date</span>
                  <span className="font-medium text-white">{formatDate(customer.updatedAt)}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Support Tier</span>
                  <span className="font-medium text-white">
                    {customer.status === 'VIP' ? 'Enterprise Dedicated' : customer.status === 'Active' ? 'Priority' : 'Standard'}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="rounded-[18px]">
              <h3 className="text-[24px] font-black text-[#1f2a44]">Financial Overview</h3>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between gap-3 text-sm text-[#7b86a0]">
                  <span>Lifetime Value</span>
                  <span className="text-xl font-black text-[#1f2a44]">{formatCurrency(customer.dealValue)}</span>
                </div>
                <div className="h-2 rounded-full bg-[#eef2ff]">
                  <div className="h-full rounded-full bg-[#4c42e8]" style={{ width: `${Math.min(100, healthScore)}%` }} />
                </div>
                <div className="space-y-3 pt-3 text-sm text-[#56627b]">
                  <div className="flex items-center justify-between gap-3">
                    <span>Active Subscriptions</span>
                    <span className="font-semibold text-[#1f2a44]">{customer.stage === 'Won' ? 4 : customer.stage === 'Negotiation' ? 2 : 1}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Open Invoices</span>
                    <span className="font-semibold text-[#1f2a44]">{formatCurrency(customer.dealValue * 0.4)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : null}

      {activeTab === 'activity' ? (
        <Card className="rounded-[18px]">
          <div className="space-y-4">
            {(customer.timeline || []).map((item) => (
              <div className="flex items-start gap-4 border-b border-[var(--border)] pb-4 last:border-b-0 last:pb-0" key={item.id}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef2ff] text-sm font-bold text-[#5b50e9]">
                  {item.type.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <p className="font-semibold text-[#1f2a44]">{item.title}</p>
                    <span className="text-sm text-[#7b86a0]">{formatRelativeTime(item.date)}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-[#6d7890]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {activeTab === 'orders' ? (
        <Card className="rounded-[18px]">
          <div className="grid gap-4 md:grid-cols-2">
            {(customer.deals || []).map((deal) => (
              <div className="rounded-[16px] border border-[var(--border)] bg-[#fbfcff] p-5" key={deal.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold text-[#1f2a44]">{deal.title}</p>
                    <p className="mt-2 text-sm text-[#7b86a0]">Expected close {formatDate(deal.closeDate)}</p>
                  </div>
                  <Badge variant="brand">{deal.stage}</Badge>
                </div>
                <p className="mt-6 text-3xl font-black text-[#1f2a44]">{formatCurrency(deal.amount)}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {activeTab === 'notes' ? (
        <Card className="rounded-[18px]">
          {(customer.noteEntries || []).length ? (
            <div className="space-y-4">
              {customer.noteEntries.map((note) => (
                <div className="rounded-[16px] bg-[#f6f8ff] p-5" key={note.id}>
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <p className="font-semibold text-[#1f2a44]">{note.author}</p>
                    <span className="text-sm text-[#7b86a0]">{formatDate(note.date)}</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[#5d6880]">{note.body}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#7b86a0]">No note entries have been logged for this customer yet.</p>
          )}
        </Card>
      ) : null}

      <ConfirmDialog
        confirmLabel="Delete customer"
        description="This action cannot be undone. The customer record and its current detail view will be removed."
        isLoading={deleting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        open={deleteOpen}
        title="Delete this customer?"
      />
    </div>
  );
}

export default CustomerDetailPage;
