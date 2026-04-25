import { useEffect, useMemo, useState } from 'react';
import { Building2, Plus, Search, UserRound } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Avatar from '../../components/common/Avatar';
import { useCustomers } from '../../hooks/useCustomers';

function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const { customers, loading, error, refetch } = useCustomers();

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const results = useMemo(() => {
    const needle = initialQuery.trim().toLowerCase();
    if (!needle) {
      return customers.slice(0, 4);
    }

    return customers.filter((customer) =>
      [customer.company, customer.fullName, customer.email, customer.location].join(' ').toLowerCase().includes(needle),
    );
  }, [customers, initialQuery]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    setSearchParams(trimmedQuery ? { q: trimmedQuery } : {});
  }

  if (loading) {
    return <LoadingSkeleton rows={4} />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-7">
      <form className="relative max-w-[360px]" onSubmit={handleSubmit}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aa8bf]" />
        <input
          className="h-8 w-full rounded-[6px] bg-white pl-8 pr-3 text-[12px] outline-none"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search..."
          value={query}
        />
      </form>

      <div className="grid gap-7 lg:grid-cols-[1fr_220px]">
        <div>
          <p className="text-[10px] font-bold text-[#52627b]">Search Results for</p>
          <h1 className="mt-1 text-[24px] font-black tracking-[-0.05em] text-[#14213d]">
            {initialQuery ? `“${initialQuery}”` : 'All searchable records'}
          </h1>
          <p className="mt-2 text-[12px] text-[#52627b]">
            {results.length ? `Found ${results.length} match${results.length === 1 ? '' : 'es'} across your organization.` : 'No records exist in this workspace yet.'}
          </p>

          <div className="mt-8 space-y-7">
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-[12px] font-black text-[#4c42e8]">
                <Building2 className="h-4 w-4" />
                Accounts
              </h2>
              <div className="space-y-3">
                {results.slice(0, 2).map((customer) => (
                  <Link className="flex items-center justify-between rounded-[9px] bg-white p-4 shadow-[0_18px_40px_-38px_rgba(31,42,68,0.2)]" key={customer.id} to={`/customers/${customer.id}`}>
                    <div className="flex items-center gap-3">
                      <Avatar name={customer.company} size="sm" />
                      <div>
                        <p className="text-[12px] font-black text-[#14213d]">{customer.company}</p>
                        <p className="text-[10px] text-[#70809a]">{customer.industry || 'Enterprise Client'} · {customer.location || 'San Francisco, CA'}</p>
                      </div>
                    </div>
                    <Badge variant="brand">{customer.status}</Badge>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 flex items-center gap-2 text-[12px] font-black text-[#4c42e8]">
                <UserRound className="h-4 w-4" />
                Contacts
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {results.slice(0, 2).map((customer) => (
                  <Link className="flex items-center gap-3 rounded-[9px] bg-white p-4 shadow-[0_18px_40px_-38px_rgba(31,42,68,0.2)]" key={`${customer.id}-contact`} to={`/customers/${customer.id}`}>
                    <Avatar name={customer.fullName} size="sm" />
                    <div>
                      <p className="text-[12px] font-black text-[#14213d]">{customer.fullName}</p>
                      <p className="text-[10px] text-[#70809a]">{customer.jobTitle || 'VP of Sales'}, {customer.company}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>

        <Card className="h-fit rounded-[9px] p-6 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#eef2ff] text-[#4c42e8]">
            <Search className="h-5 w-5" />
          </div>
          <h2 className="mt-5 text-[15px] font-black tracking-[-0.03em] text-[#14213d]">No results found?</h2>
          <p className="mt-3 text-[11px] leading-5 text-[#52627b]">If you can&apos;t find what you&apos;re looking for, try adjusting your search terms or create a new record.</p>
          <Link to="/customers/create">
            <Button className="mt-5 w-full">
              <Plus className="h-3.5 w-3.5" />
              Create New Record
            </Button>
          </Link>
        </Card>
      </div>

      {!results.length ? <EmptyState title="No matching results" /> : null}
    </div>
  );
}

export default SearchResultsPage;
