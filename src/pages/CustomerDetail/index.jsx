import { useContext, useEffect, useState } from 'react';
import { ArrowLeft, Building2, Mail, MapPin, Pencil, Phone, Trash2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as customerService from '../../services/customerService';
import { UIContext } from '../../context/UIContext';
import PageHeader from '../../components/common/PageHeader';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Tabs from '../../components/common/Tabs';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import { formatCurrency, formatDate, formatRelativeTime } from '../../utils/formatters';

function getStatusVariant(status) {
  switch (status) {
    case 'VIP':
      return 'violet';
    case 'Active':
      return 'success';
    case 'Inactive':
      return 'danger';
    default:
      return 'brand';
  }
}

function getStageVariant(stage) {
  switch (stage) {
    case 'Won':
      return 'success';
    case 'Lost':
      return 'danger';
    case 'Negotiation':
      return 'warning';
    default:
      return 'default';
  }
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

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <>
            <Button onClick={() => navigate('/customers')} variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Link to={`/customers/${customer.id}/edit`}>
              <Button variant="ghost">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button onClick={() => setDeleteOpen(true)} variant="danger">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </>
        }
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Customers', to: '/customers' },
          { label: customer.fullName },
        ]}
        description="Review account context, company details, activity, deals, and notes."
        title={customer.fullName}
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={customer.fullName} size="xl" />
              <div>
                <h2 className="text-2xl font-bold text-[var(--text)]">{customer.fullName}</h2>
                <p className="mt-1 text-sm text-muted">
                  {customer.jobTitle || 'Customer contact'} at {customer.company}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant={getStatusVariant(customer.status)}>{customer.status}</Badge>
                  <Badge variant={getStageVariant(customer.stage)}>{customer.stage}</Badge>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-brand-50 px-4 py-3 text-right">
              <p className="text-sm text-brand-700">Open deal value</p>
              <p className="mt-2 text-2xl font-bold text-brand-900">{formatCurrency(customer.dealValue)}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-[var(--text)]">Contact info</p>
              <div className="mt-4 space-y-3 text-sm text-muted">
                <p className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-brand-600" />
                  {customer.email}
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-brand-600" />
                  {customer.phone}
                </p>
                <p className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-brand-600" />
                  {customer.location || 'Remote'}
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm font-semibold text-[var(--text)]">Company info</p>
              <div className="mt-4 space-y-3 text-sm text-muted">
                <p className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-brand-600" />
                  {customer.company}
                </p>
                <p>Industry: {customer.industry || 'General'}</p>
                <p>Created: {formatDate(customer.createdAt)}</p>
                <p>Last contact: {formatRelativeTime(customer.lastContactedAt)}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-[var(--text)]">Customer summary</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{customer.notes || 'No notes available yet for this record.'}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-sm text-muted">Primary stage</p>
              <p className="mt-2 text-xl font-bold text-[var(--text)]">{customer.stage}</p>
            </div>
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <p className="text-sm text-muted">Record health</p>
              <p className="mt-2 text-xl font-bold text-[var(--text)]">{customer.status}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <Tabs
          activeTab={activeTab}
          items={[
            { label: 'Overview', value: 'overview' },
            { label: 'Activity', value: 'activity' },
            { label: 'Deals', value: 'deals' },
            { label: 'Notes', value: 'notes' },
          ]}
          onChange={setActiveTab}
        />

        <div className="mt-6">
          {activeTab === 'overview' ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-[var(--text)]">Overview</p>
                <dl className="mt-4 space-y-3 text-sm text-muted">
                  <div className="flex items-center justify-between gap-4">
                    <dt>Contact</dt>
                    <dd className="font-medium text-[var(--text)]">{customer.fullName}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Company</dt>
                    <dd className="font-medium text-[var(--text)]">{customer.company}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Stage</dt>
                    <dd className="font-medium text-[var(--text)]">{customer.stage}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Deal value</dt>
                    <dd className="font-medium text-[var(--text)]">{formatCurrency(customer.dealValue)}</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-[var(--text)]">Next best action</p>
                <p className="mt-4 text-sm leading-7 text-muted">
                  Use the timeline and notes to prepare the next outreach with clear context. Update the stage after any
                  meaningful touchpoint to keep pipeline reporting accurate.
                </p>
              </div>
            </div>
          ) : null}

          {activeTab === 'activity' ? (
            <div className="space-y-4">
              {(customer.timeline || []).map((item) => (
                <div className="relative rounded-3xl border border-slate-200 p-5" key={item.id}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-600">{item.type}</p>
                      <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">{item.title}</h3>
                      <p className="mt-2 text-sm text-muted">{item.description}</p>
                    </div>
                    <Badge variant="default">{formatRelativeTime(item.date)}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === 'deals' ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {(customer.deals || []).map((deal) => (
                <div className="rounded-3xl border border-slate-200 p-5" key={deal.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-[var(--text)]">{deal.title}</p>
                      <p className="mt-2 text-sm text-muted">Expected close {formatDate(deal.closeDate)}</p>
                    </div>
                    <Badge variant={getStageVariant(deal.stage)}>{deal.stage}</Badge>
                  </div>
                  <p className="mt-5 text-3xl font-bold text-[var(--text)]">{formatCurrency(deal.amount)}</p>
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === 'notes' ? (
            <div className="space-y-4">
              {(customer.noteEntries || []).length ? (
                customer.noteEntries.map((note) => (
                  <div className="rounded-3xl bg-slate-50 p-5" key={note.id}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-semibold text-[var(--text)]">{note.author}</p>
                      <span className="text-sm text-muted">{formatDate(note.date)}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-muted">{note.body}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">No note entries have been logged for this customer yet.</p>
              )}
            </div>
          ) : null}
        </div>
      </Card>

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
