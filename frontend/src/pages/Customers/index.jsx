import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Download, Filter, Plus, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CUSTOMER_SORT_OPTIONS, PAGE_SIZE, STAGE_OPTIONS, STATUS_OPTIONS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useCustomers } from '../../hooks/useCustomers';
import { useDebounce } from '../../hooks/useDebounce';
import PageHeader from '../../components/common/PageHeader';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/ui/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

function getStatusVariant(status) {
  switch (status) {
    case 'VIP':
      return 'brand';
    case 'Active':
      return 'warning';
    case 'Inactive':
      return 'danger';
    default:
      return 'violet';
  }
}

function exportCustomers(customers) {
  if (!customers.length) {
    return;
  }

  const header = ['Name', 'Company', 'Status', 'Stage', 'Last Contacted', 'Revenue'];
  const rows = customers.map((customer) => [
    customer.fullName,
    customer.company,
    customer.status,
    customer.stage,
    formatDate(customer.lastContactedAt || customer.updatedAt),
    customer.dealValue,
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'controllusion-customers.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function CustomersPage() {
  const navigate = useNavigate();
  const { customers, loading, error, refetch } = useCustomers();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 250);

  const filteredCustomers = useMemo(
    () =>
      customers
        .filter((customer) => {
          const searchPool = [customer.fullName, customer.company, customer.email].join(' ').toLowerCase();
          const matchesQuery = searchPool.includes(debouncedQuery.toLowerCase());
          const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
          const matchesStage = stageFilter === 'all' || customer.stage === stageFilter;
          return matchesQuery && matchesStatus && matchesStage;
        })
        .sort((left, right) => {
          if (sortBy === 'name') {
            return left.fullName.localeCompare(right.fullName);
          }
          if (sortBy === 'dealValue') {
            return Number(right.dealValue) - Number(left.dealValue);
          }
          return new Date(right.createdAt) - new Date(left.createdAt);
        }),
    [customers, debouncedQuery, sortBy, stageFilter, statusFilter],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, stageFilter, statusFilter, sortBy]);

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

  const pageCount = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const paginatedCustomers = filteredCustomers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader
        mobileHidden
        actions={
          <>
            <Button onClick={() => setFiltersOpen((value) => !value)} variant="secondary">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button onClick={() => exportCustomers(filteredCustomers)} variant="subtle">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Link to="/customers/create">
              <Button>
                <Plus className="h-4 w-4" />
                Add Customer
              </Button>
            </Link>
          </>
        }
        description="Manage your enterprise client roster and engagement."
        title="Customers"
      />

      <Card className="rounded-[18px]">
        <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-[380px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a4afc4]" />
            <input
              className="h-[42px] w-full rounded-[10px] bg-[#f1f4ff] pl-10 pr-4 text-sm text-[#1f2a44] outline-none placeholder:text-[#a4afc4]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search customers..."
              type="text"
              value={query}
            />
          </div>
          <p className="text-sm font-medium text-[#7b86a0]">
            Showing {(safePage - 1) * PAGE_SIZE + 1}-{Math.min(safePage * PAGE_SIZE, filteredCustomers.length || 0)} of{' '}
            {filteredCustomers.length} results
          </p>
        </div>

        {filtersOpen ? (
          <div className="mt-5 grid gap-3 border-b border-[var(--border)] pb-5 md:grid-cols-3">
            <Select onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>

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
        ) : null}

        {paginatedCustomers.length ? (
          <>
            <div className="hidden lg:block">
              <table className="mt-4 w-full">
                <thead>
                  <tr className="text-left text-[11px] font-bold uppercase tracking-[0.12em] text-[#8d97ad]">
                    {['Customer Name', 'Company', 'Status', 'Last Contacted', 'Revenue (YTD)', ''].map((label) => (
                      <th className="px-3 py-3" key={label}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.map((customer) => (
                    <tr className="border-t border-[var(--border)]" key={customer.id}>
                      <td className="px-3 py-4">
                        <Link className="flex items-center gap-3" to={`/customers/${customer.id}`}>
                          <Avatar name={customer.fullName} size="sm" />
                          <div>
                            <p className="font-semibold text-[#1f2a44]">{customer.fullName}</p>
                            <p className="text-sm text-[#7b86a0]">{customer.email}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-3 py-4 text-sm font-medium text-[#48546d]">{customer.company}</td>
                      <td className="px-3 py-4">
                        <Badge variant={getStatusVariant(customer.status)}>{customer.status}</Badge>
                      </td>
                      <td className="px-3 py-4 text-sm text-[#6d7890]">
                        {formatDate(customer.lastContactedAt || customer.updatedAt)}
                      </td>
                      <td className="px-3 py-4 text-sm font-semibold text-[#1f2a44]">{formatCurrency(customer.dealValue)}</td>
                      <td className="px-3 py-4 text-right">
                        <Link
                          className="inline-flex items-center gap-1 text-sm font-medium text-[#4c42e8] transition hover:text-[#3e35d2]"
                          to={`/customers/${customer.id}`}
                        >
                          Open
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 grid gap-3 lg:hidden">
              {paginatedCustomers.map((customer) => (
                <Link
                  className="rounded-[16px] border border-[var(--border)] bg-white p-4"
                  key={customer.id}
                  to={`/customers/${customer.id}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={customer.fullName} size="sm" />
                      <div>
                        <p className="font-semibold text-[#1f2a44]">{customer.company}</p>
                        <p className="text-sm text-[#7b86a0]">{customer.fullName}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(customer.status)}>{customer.status}</Badge>
                  </div>
                </Link>
              ))}
            </div>

            <Pagination currentPage={safePage} onPageChange={setCurrentPage} pageCount={pageCount} />
          </>
        ) : (
          <div className="pt-6">
            <EmptyState
              actionLabel="Create customer"
              description="Try a broader search or create the first customer record for this workspace."
              onAction={() => navigate('/customers/create')}
              title="No customers found"
            />
          </div>
        )}
      </Card>

      <Link
        className="fixed bottom-[92px] right-4 z-20 flex h-14 w-14 items-center justify-center rounded-[16px] bg-[linear-gradient(135deg,#4c42e8_0%,#5a49f4_100%)] text-white shadow-[0_18px_30px_-20px_rgba(76,66,232,0.85)] lg:hidden"
        to="/customers/create"
      >
        <Plus className="h-5 w-5" />
      </Link>
    </div>
  );
}

export default CustomersPage;
