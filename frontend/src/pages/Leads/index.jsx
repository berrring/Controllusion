import { Download, Filter, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Avatar from '../../components/common/Avatar';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { useCustomers } from '../../hooks/useCustomers';
import { formatCurrency } from '../../utils/formatters';

function LeadsPage() {
  const { customers, loading, error, refetch } = useCustomers();

  if (loading) {
    return <LoadingSkeleton rows={4} />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={refetch} />;
  }

  const leads = customers.filter((customer) => ['Lead', 'Qualified'].includes(customer.stage)).slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[22px] font-black tracking-[-0.05em] text-[#14213d]">Active Leads</h1>
          <p className="mt-1 text-[12px] font-medium text-[#52627b]">Manage and track your pipeline prospects.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="subtle">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </Button>
          <Button variant="subtle">
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        </div>
      </div>

      <Card className="rounded-[9px] p-0">
        {leads.length ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-black uppercase tracking-[0.1em] text-[#52627b]">
                  {['Lead Name', 'Company', 'Status', 'Value', 'Actions'].map((label) => (
                    <th className="px-5 py-3" key={label}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr className="border-t border-[#edf2fb]" key={lead.id}>
                    <td className="px-5 py-4">
                      <Link className="flex items-center gap-3" to={`/customers/${lead.id}`}>
                        <Avatar name={lead.fullName} size="sm" />
                        <span className="text-[12px] font-black text-[#14213d]">{lead.fullName}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-[12px] font-medium text-[#52627b]">{lead.company}</td>
                    <td className="px-5 py-4">
                      <Badge variant={index % 2 === 0 ? 'warning' : 'default'}>{index % 2 === 0 ? 'Negotiating' : 'Initial Contact'}</Badge>
                    </td>
                    <td className="px-5 py-4 text-[12px] font-black text-[#14213d]">{formatCurrency(lead.dealValue)}</td>
                    <td className="px-5 py-4">
                      <MoreVertical className="h-4 w-4 text-[#52627b]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No active leads yet" />
        )}
      </Card>
    </div>
  );
}

export default LeadsPage;
