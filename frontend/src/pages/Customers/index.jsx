import { useEffect, useMemo, useState } from 'react';
import { Download, Filter, MoreVertical, Plus, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { PAGE_SIZE } from '../../utils/constants';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { useCustomers } from '../../hooks/useCustomers';
import { useDebounce } from '../../hooks/useDebounce';
import Pagination from '../../components/ui/Pagination';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/ui/Badge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';

const tabs = ['All Customers', 'Active', 'At Risk', 'Onboarding'];

function getStatusVariant(status) {
  switch (status) {
    case 'VIP':
      return 'brand';
    case 'Active':
      return 'warning';
    case 'Inactive':
      return 'danger';
    default:
      return 'default';
  }
}

function CustomersPage() {
  const navigate = useNavigate();
  const { customers, loading, error, refetch } = useCustomers();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Customers');
  const [currentPage, setCurrentPage] = useState(1);
  const debouncedQuery = useDebounce(query, 250);

  const filteredCustomers = useMemo(
    () =>
      customers
        .filter((customer) => {
          const searchPool = [customer.fullName, customer.company, customer.email].join(' ').toLowerCase();
          const matchesQuery = searchPool.includes(debouncedQuery.toLowerCase());
          const matchesTab =
            activeTab === 'All Customers' ||
            (activeTab === 'Active' && customer.status === 'Active') ||
            (activeTab === 'At Risk' && customer.status === 'Inactive') ||
            (activeTab === 'Onboarding' && ['New', 'VIP'].includes(customer.status));
          return matchesQuery && matchesTab;
        })
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
    [activeTab, customers, debouncedQuery],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, debouncedQuery]);

  if (loading) {
    return <LoadingSkeleton rows={4} />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={refetch} title="Something went wrong" />;
  }

  const pageCount = Math.max(1, Math.ceil(filteredCustomers.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const paginatedCustomers = filteredCustomers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[26px] font-black tracking-[-0.05em] text-[#14213d]">Customers</h1>
          <p className="mt-1 text-[12px] font-medium text-[#52627b]">Manage your active accounts and pipeline.</p>
        </div>
        <Link to="/customers/create">
          <Button>
            <Plus className="h-3.5 w-3.5" />
            Add Customer
          </Button>
        </Link>
      </div>

      <Card className="rounded-[8px] p-0">
        <div className="flex flex-col gap-4 border-b border-[#edf2fb] p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                className={`rounded-[6px] px-4 py-2 text-[12px] font-bold transition ${
                  activeTab === tab ? 'bg-[#eef2ff] text-[#4c42e8]' : 'text-[#52627b] hover:bg-[#f7f9ff]'
                }`}
                key={tab}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden w-[220px] sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aa8bf]" />
              <input
                className="h-8 w-full rounded-[6px] bg-[#f3f7ff] pl-8 pr-3 text-[12px] outline-none"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search customers..."
                value={query}
              />
            </div>
            <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#52627b]" type="button">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
            <button className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#52627b]" type="button">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>
        </div>

        {paginatedCustomers.length ? (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#fbfcff] text-left text-[10px] font-black uppercase tracking-[0.1em] text-[#52627b]">
                    {['Customer', 'Company', 'Status', 'Last Contacted', 'Revenue (YTD)', 'Actions'].map((label) => (
                      <th className="px-5 py-3" key={label}>
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.map((customer) => (
                    <tr className="border-t border-[#edf2fb]" key={customer.id}>
                      <td className="px-5 py-4">
                        <Link className="flex items-center gap-3" to={`/customers/${customer.id}`}>
                          <Avatar name={customer.fullName} size="sm" />
                          <div>
                            <p className="text-[12px] font-black text-[#14213d]">{customer.fullName}</p>
                            <p className="text-[10px] font-medium text-[#70809a]">{customer.email}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-[12px] font-medium text-[#52627b]">{customer.company}</td>
                      <td className="px-5 py-4">
                        <Badge variant={getStatusVariant(customer.status)}>{customer.status}</Badge>
                      </td>
                      <td className="px-5 py-4 text-[12px] font-medium text-[#52627b]">
                        {formatRelativeTime(customer.lastContactedAt || customer.updatedAt)}
                      </td>
                      <td className="px-5 py-4 text-[12px] font-black text-[#14213d]">{formatCurrency(customer.dealValue)}</td>
                      <td className="px-5 py-4">
                        <Link className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] text-[#52627b] hover:bg-[#eef2ff]" to={`/customers/${customer.id}`}>
                          <MoreVertical className="h-4 w-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-4 lg:hidden">
              {paginatedCustomers.map((customer) => (
                <Link className="rounded-[10px] border border-[#edf2fb] bg-white p-4" key={customer.id} to={`/customers/${customer.id}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={customer.fullName} size="sm" />
                      <div>
                        <p className="font-bold text-[#14213d]">{customer.company}</p>
                        <p className="text-xs text-[#70809a]">{customer.fullName}</p>
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(customer.status)}>{customer.status}</Badge>
                  </div>
                </Link>
              ))}
            </div>

            <div className="border-t border-[#edf2fb] px-5 py-4">
              <Pagination currentPage={safePage} onPageChange={setCurrentPage} pageCount={pageCount} />
            </div>
          </>
        ) : (
          <EmptyState actionLabel="Add Your First Customer" onAction={() => navigate('/customers/create')} />
        )}
      </Card>
    </div>
  );
}

export default CustomersPage;
