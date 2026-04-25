import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { useCustomers } from '../../hooks/useCustomers';
import { formatCurrency } from '../../utils/formatters';

const columns = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won'];

function DealsPage() {
  const { customers, loading, error, refetch } = useCustomers();

  if (loading) {
    return <LoadingSkeleton rows={4} />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-black tracking-[-0.05em] text-[#14213d]">Pipeline</h1>
        <p className="mt-1 text-[12px] font-medium text-[#52627b]">Track open opportunities by stage and value.</p>
      </div>

      {customers.length ? (
        <div className="grid gap-4 xl:grid-cols-5">
          {columns.map((stage) => {
            const items = customers.filter((customer) => customer.stage === stage).slice(0, 4);
            const total = items.reduce((sum, item) => sum + Number(item.dealValue || 0), 0);

            return (
              <Card className="min-h-[460px] rounded-[9px] p-4" key={stage}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-[13px] font-black text-[#14213d]">{stage}</h2>
                    <p className="mt-1 text-[10px] font-semibold text-[#70809a]">{formatCurrency(total)}</p>
                  </div>
                  <Badge variant="brand">{items.length}</Badge>
                </div>
                <div className="space-y-3">
                  {items.map((customer) => (
                    <Link className="block rounded-[8px] border border-[#edf2fb] bg-[#fbfcff] p-3 transition hover:border-[#dbe5ff]" key={customer.id} to={`/customers/${customer.id}`}>
                      <p className="text-[12px] font-black text-[#14213d]">{customer.company}</p>
                      <p className="mt-1 text-[10px] text-[#70809a]">{customer.fullName}</p>
                      <p className="mt-3 text-[12px] font-black text-[#4c42e8]">{formatCurrency(customer.dealValue)}</p>
                    </Link>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState title="No deals yet" />
      )}
    </div>
  );
}

export default DealsPage;
