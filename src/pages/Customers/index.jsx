import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, MoreHorizontal, Pencil, Plus, Trash2, UserRound } from 'lucide-react';
import { CUSTOMER_SORT_OPTIONS, PAGE_SIZE, STAGE_OPTIONS, STATUS_OPTIONS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCustomers } from '../../hooks/useCustomers';
import { useDebounce } from '../../hooks/useDebounce';
import { useModal } from '../../hooks/useModal';
import { UIContext } from '../../context/UIContext';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import DataTable from '../../components/common/DataTable';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Pagination from '../../components/ui/Pagination';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';

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

function CustomersPage() {
  const { customers, loading, error, refetch, removeItem } = useCustomers();
  const { showToast } = useContext(UIContext);
  const deleteModal = useModal(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [menuId, setMenuId] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedQuery = useDebounce(query, 250);

  const filteredCustomers = customers
    .filter((customer) => {
      const searchPool = [customer.fullName, customer.company, customer.email].join(' ').toLowerCase();
      const matchesQuery = searchPool.includes(debouncedQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const matchesStage = stageFilter === 'all' || customer.stage === stageFilter;
      return matchesQuery && matchesStatus && matchesStage;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.fullName.localeCompare(b.fullName);
      }
      if (sortBy === 'dealValue') {
        return Number(b.dealValue) - Number(a.dealValue);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, stageFilter, statusFilter, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const paginatedCustomers = filteredCustomers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function toggleRow(id) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function toggleAll(checked) {
    const pageIds = paginatedCustomers.map((customer) => customer.id);
    setSelectedIds((current) =>
      checked ? Array.from(new Set([...current, ...pageIds])) : current.filter((id) => !pageIds.includes(id)),
    );
  }

  function openDeleteDialog(customer) {
    setCustomerToDelete(customer);
    deleteModal.openModal();
  }

  async function handleDelete() {
    if (!customerToDelete) {
      return;
    }

    setDeleting(true);
    try {
      await removeItem(customerToDelete.id);
      showToast({
        title: 'Customer deleted',
        description: `${customerToDelete.fullName} has been removed from the CRM.`,
      });
      setSelectedIds((current) => current.filter((id) => id !== customerToDelete.id));
      deleteModal.closeModal();
      setCustomerToDelete(null);
    } catch (deleteError) {
      showToast({
        title: 'Delete failed',
        description: deleteError.response?.data?.message || 'Unable to delete this customer.',
        type: 'error',
      });
    } finally {
      setDeleting(false);
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

  if (error) {
    return <ErrorState description={error} onRetry={refetch} title="Customers unavailable" />;
  }

  const columns = [
    {
      key: 'customer',
      label: 'Customer',
      render: (customer) => (
        <div className="flex min-w-[220px] items-center gap-3">
          <Avatar name={customer.fullName} size="sm" />
          <div>
            <Link className="font-semibold text-[var(--text)] transition hover:text-brand-600" to={`/customers/${customer.id}`}>
              {customer.fullName}
            </Link>
            <p className="text-sm text-muted">{customer.jobTitle || 'Customer contact'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'company',
      label: 'Company',
      render: (customer) => (
        <div>
          <p className="font-medium text-[var(--text)]">{customer.company}</p>
          <p className="text-sm text-muted">{customer.email}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (customer) => <Badge variant={getStatusVariant(customer.status)}>{customer.status}</Badge>,
    },
    {
      key: 'stage',
      label: 'Stage',
      render: (customer) => <Badge variant={getStageVariant(customer.stage)}>{customer.stage}</Badge>,
    },
    {
      key: 'dealValue',
      label: 'Deal value',
      render: (customer) => <span className="font-semibold text-[var(--text)]">{formatCurrency(customer.dealValue)}</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (customer) => (
        <div className="relative">
          <button
            className="rounded-xl border border-[color:var(--border)] bg-white p-2 text-slate-600 transition hover:bg-slate-50"
            onClick={() => setMenuId((current) => (current === customer.id ? null : customer.id))}
            type="button"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {menuId === customer.id ? (
            <div className="surface-panel absolute right-0 z-10 mt-2 w-44 rounded-2xl p-2 shadow-panel">
              <Link className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" to={`/customers/${customer.id}`}>
                <UserRound className="h-4 w-4" />
                View detail
              </Link>
              <Link className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" to={`/customers/${customer.id}/edit`}>
                <Pencil className="h-4 w-4" />
                Edit record
              </Link>
              <button
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                onClick={() => openDeleteDialog(customer)}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link to="/customers/create">
            <Button>
              <Plus className="h-4 w-4" />
              Add customer
            </Button>
          </Link>
        }
        breadcrumbs={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Customers' }]}
        description="Search, filter, sort, and manage customer records from a clean, table-based CRM view."
        title="Customers"
      />

      <Card>
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.9fr_0.9fr_0.8fr]">
          <SearchBar onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, company, or email..." value={query} />

          <div className="relative">
            <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Select className="pl-11" onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </div>

          <Select onChange={(event) => setStageFilter(event.target.value)} value={stageFilter}>
            <option value="all">All stages</option>
            {STAGE_OPTIONS.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </Select>

          <Select onChange={(event) => setSortBy(event.target.value)} value={sortBy}>
            {CUSTOMER_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[color:var(--border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Showing {paginatedCustomers.length} of {filteredCustomers.length} matching customers.
          </p>
          {selectedIds.length ? (
            <div className="flex items-center gap-3 rounded-xl bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
              <span>{selectedIds.length} selected</span>
              <button className="transition hover:text-brand-900" onClick={() => setSelectedIds([])} type="button">
                Clear selection
              </button>
            </div>
          ) : null}
        </div>
      </Card>

      <div className="space-y-5">
        <DataTable
          columns={columns}
          data={paginatedCustomers}
          emptyDescription="Try a broader search or create a new customer to populate the table."
          emptyTitle="No customers match your filters"
          onToggleAll={toggleAll}
          onToggleRow={toggleRow}
          renderMobileCard={(customer) => (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <input checked={selectedIds.includes(customer.id)} onChange={() => toggleRow(customer.id)} type="checkbox" />
                  <Avatar name={customer.fullName} size="sm" />
                  <div>
                    <Link className="font-semibold text-[var(--text)]" to={`/customers/${customer.id}`}>
                      {customer.fullName}
                    </Link>
                    <p className="text-sm text-muted">{customer.company}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-[var(--text)]">{formatCurrency(customer.dealValue)}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant={getStatusVariant(customer.status)}>{customer.status}</Badge>
                <Badge variant={getStageVariant(customer.stage)}>{customer.stage}</Badge>
                <Badge variant="default">{formatDate(customer.createdAt)}</Badge>
              </div>

              <p className="text-sm text-muted">{customer.email}</p>

              <div className="flex flex-wrap gap-2">
                <Link to={`/customers/${customer.id}`}>
                  <Button size="sm" variant="secondary">
                    View
                  </Button>
                </Link>
                <Link to={`/customers/${customer.id}/edit`}>
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </Link>
                <Button onClick={() => openDeleteDialog(customer)} size="sm" variant="danger">
                  Delete
                </Button>
              </div>
            </div>
          )}
          selectedIds={selectedIds}
        />

        <Pagination currentPage={safePage} onPageChange={setCurrentPage} pageCount={pageCount} />
      </div>

      <ConfirmDialog
        confirmLabel="Delete customer"
        description={
          customerToDelete
            ? `This will permanently remove ${customerToDelete.fullName} from the CRM records.`
            : ''
        }
        isLoading={deleting}
        onClose={() => {
          deleteModal.closeModal();
          setCustomerToDelete(null);
        }}
        onConfirm={handleDelete}
        open={deleteModal.isOpen}
        title="Delete customer"
      />
    </div>
  );
}

export default CustomersPage;
