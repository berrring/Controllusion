import { useContext, useEffect, useMemo, useState } from 'react';
import { Building2, CalendarClock, Globe, Mail, MapPin, Pencil, Phone, Plus, Trash2 } from 'lucide-react';
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
  const stageScores = { Lead: 54, Qualified: 74, Proposal: 83, Negotiation: 91, Won: 98, Lost: 26 };
  let score = stageScores[customer.stage] || 72;
  if (customer.status === 'VIP') score += 5;
  if (customer.status === 'Inactive') score -= 18;
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
  const [activeTab, setActiveTab] = useState('Overview');
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
        description: `${customer.fullName} was removed from the CRM.`,
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

  const contacts = useMemo(() => {
    if (!customer) return [];
    return [
      { name: customer.fullName, title: customer.jobTitle || 'VP of Operations', email: customer.email, phone: customer.phone },
      { name: 'Marcus Chen', title: 'Chief Technology Officer', email: `marcus@${getDomain(customer)}`, phone: customer.phone },
      { name: 'Elena Rodriguez', title: 'Procurement Director', email: `elena@${getDomain(customer)}`, phone: customer.phone },
    ];
  }, [customer]);

  if (loading) {
    return <LoadingSkeleton rows={4} />;
  }

  if (error || !customer) {
    return <ErrorState description={error || 'Customer record not found.'} onRetry={loadCustomer} />;
  }

  const healthScore = getHealthScore(customer);
  const domain = getDomain(customer);
  const tabs = ['Overview', 'Activity', 'Orders', 'Notes'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 border-b border-[#edf2fb] pb-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-[8px] bg-[#111827] text-white">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[28px] font-black tracking-[-0.05em] text-[#14213d]">{customer.company}</h1>
              <Badge variant="brand">ENTERPRISE</Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-[12px] font-medium text-[#52627b]">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {customer.location || 'San Francisco, CA'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5" />
                {domain}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link to={`/customers/${customer.id}/edit`}>
            <Button variant="secondary">
              <Pencil className="h-3.5 w-3.5" />
              Edit Profile
            </Button>
          </Link>
          <Button onClick={() => showToast({ title: 'Activity logged successfully', type: 'info' })}>
            Log Activity
          </Button>
          <Button onClick={() => setDeleteOpen(true)} variant="danger">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex gap-7 border-b border-[#edf2fb]">
        {tabs.map((tab) => (
          <button
            className={`pb-3 text-[12px] font-bold ${activeTab === tab ? 'border-b-2 border-[#4c42e8] text-[#4c42e8]' : 'text-[#52627b]'}`}
            key={tab}
            onClick={() => setActiveTab(tab)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Overview' ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_260px]">
          <div className="space-y-5">
            <Card className="rounded-[9px] p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[15px] font-black text-[#14213d]">Company Blueprint</h2>
                <Link className="text-[11px] font-bold text-[#4c42e8]" to={`/customers/${customer.id}/edit`}>
                  View Full Details
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ['ANNUAL REVENUE', formatCurrency(customer.dealValue * 120 || 14200000), '+12% YoY'],
                  ['EMPLOYEES', '1,250', 'Across 4 offices'],
                  ['INDUSTRY', customer.industry || 'Advanced Manufacturing', ''],
                ].map(([label, value, sub]) => (
                  <div className="rounded-[7px] bg-[#f5f7ff] p-4" key={label}>
                    <p className="text-[9px] font-black uppercase tracking-[0.09em] text-[#70809a]">{label}</p>
                    <p className="mt-3 text-[18px] font-black tracking-[-0.04em] text-[#14213d]">{value}</p>
                    {sub ? <p className="mt-1 text-[10px] font-semibold text-[#52627b]">{sub}</p> : null}
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.09em] text-[#70809a]">Identified Tech Stack</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Salesforce CRM', 'AWS Cloud', 'Snowflake', 'Marketo', '+4 more'].map((item) => (
                  <span className="rounded-[5px] bg-[#eef2ff] px-2.5 py-1 text-[10px] font-bold text-[#52627b]" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </Card>

            <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
              <Card className="rounded-[9px] p-6">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-[15px] font-black text-[#14213d]">Primary Contacts</h2>
                  <button className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4c42e8]" type="button">
                    <Plus className="h-3 w-3" />
                    Add
                  </button>
                </div>
                <div className="space-y-5">
                  {contacts.map((contact) => (
                    <div className="flex items-center gap-3" key={contact.email}>
                      <Avatar name={contact.name} size="sm" />
                      <div className="min-w-0">
                        <p className="text-[12px] font-black text-[#14213d]">{contact.name}</p>
                        <p className="text-[10px] font-medium text-[#70809a]">{contact.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="rounded-[9px] p-6">
                <h2 className="text-[15px] font-black text-[#14213d]">Current Contract</h2>
                <div className="mt-5 rounded-[8px] bg-[#f5f7ff] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.09em] text-[#70809a]">Active Plan</p>
                    <Badge variant="brand">Active</Badge>
                  </div>
                  <p className="mt-2 text-[13px] font-black text-[#14213d]">Enterprise Platform Suite</p>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.09em] text-[#70809a]">Monthly Recurring</p>
                      <p className="mt-1 text-[18px] font-black text-[#14213d]">{formatCurrency(customer.dealValue || 45000)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.09em] text-[#70809a]">Renewal Date</p>
                      <p className="mt-1 text-[12px] font-bold text-[#14213d]">{formatDate(customer.updatedAt)}</p>
                    </div>
                  </div>
                </div>
                <Link className="mt-5 inline-flex text-[11px] font-bold text-[#4c42e8]" to={`/customers/${customer.id}/edit`}>
                  View Agreement
                </Link>
              </Card>
            </div>
          </div>

          <div className="space-y-5">
            <Card className="rounded-[9px] p-6 text-center">
              <h2 className="text-left text-[15px] font-black text-[#14213d]">Account Health</h2>
              <div className="mx-auto mt-8 flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-[#4c42e8] border-r-[#dbe5ff] text-[24px] font-black text-[#14213d]">
                {healthScore}
              </div>
              <Badge className="mt-5" variant="warning">Healthy</Badge>
              <p className="mt-4 text-[10px] leading-5 text-[#70809a]">High engagement over last 30 days. Renewal risk is low.</p>
            </Card>

            <Card className="rounded-[9px] p-5">
              <h2 className="text-[15px] font-black text-[#14213d]">Recent Activity</h2>
              <div className="mt-5 space-y-4">
                {[
                  ['Discovery Call', 'Today, 10:30 AM'],
                  ['Proposal Sent', 'Yesterday, 4:15 PM'],
                  ['Contract Renewed', formatRelativeTime(customer.updatedAt)],
                ].map(([title, date]) => (
                  <div className="flex gap-3" key={title}>
                    <CalendarClock className="mt-0.5 h-4 w-4 text-[#4c42e8]" />
                    <div>
                      <p className="text-[11px] font-bold text-[#14213d]">{title}</p>
                      <p className="text-[10px] text-[#70809a]">{date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="rounded-[9px] p-8">
          <h2 className="text-[18px] font-black text-[#14213d]">{activeTab}</h2>
          <p className="mt-2 text-sm text-[#52627b]">Detailed {activeTab.toLowerCase()} history is synced from this account record.</p>
          <div className="mt-6 grid gap-3">
            {contacts.slice(0, 2).map((contact) => (
              <div className="rounded-[8px] bg-[#f7f9ff] p-4" key={contact.email}>
                <p className="text-sm font-bold text-[#14213d]">{contact.name}</p>
                <p className="mt-1 text-xs text-[#70809a]">
                  <Mail className="mr-1 inline h-3 w-3" />
                  {contact.email}
                  <Phone className="ml-4 mr-1 inline h-3 w-3" />
                  {contact.phone}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <ConfirmDialog
        confirmLabel="Delete"
        description="This action cannot be undone. Are you sure you want to delete this account? All associated deals and history will be permanently removed."
        isLoading={deleting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        open={deleteOpen}
        title="Delete Customer?"
      />
    </div>
  );
}

export default CustomerDetailPage;
