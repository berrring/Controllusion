import { useContext, useEffect, useMemo, useState } from 'react';
import { Clock3, Download, Filter, Plus } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useCustomers } from '../../hooks/useCustomers';
import { ACTIVITY_UPDATED_EVENT, addActivityEntry, addNotification, getActivityLog } from '../../services/storage';
import { formatRelativeTime } from '../../utils/formatters';
import { UIContext } from '../../context/UIContext';

function ActivityPage() {
  const { showToast } = useContext(UIContext);
  const { customers, loading, error, refetch } = useCustomers();
  const [activityLog, setActivityLog] = useState(() => getActivityLog());

  useEffect(() => {
    function refreshActivityLog() {
      setActivityLog(getActivityLog());
    }

    window.addEventListener(ACTIVITY_UPDATED_EVENT, refreshActivityLog);
    return () => window.removeEventListener(ACTIVITY_UPDATED_EVENT, refreshActivityLog);
  }, []);

  const timeline = useMemo(() => {
    const customerTimeline = customers
      .flatMap((customer) =>
        (customer.timeline || []).map((item) => ({
          ...item,
          company: customer.company,
          customerName: customer.fullName,
        })),
      )
      .sort((left, right) => new Date(right.date) - new Date(left.date));

    const manualTimeline = activityLog.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      company: 'Workspace',
      date: item.createdAt,
    }));

    return [...manualTimeline, ...customerTimeline].slice(0, 10);
  }, [activityLog, customers]);

  function addReviewCheckpoint() {
    addActivityEntry({
      title: 'Strategic sync: Globex Account',
      description: 'Initial discovery call completed. Client is evaluating our cloud infrastructure solutions for Q4 implementation.',
    });
    addNotification({
      title: 'Activity report created',
      message: 'A new activity checkpoint was added to your workspace timeline.',
      path: '/activity',
    });
    setActivityLog(getActivityLog());
    showToast({ title: 'Activity report created' });
  }

  function exportLog() {
    if (!timeline.length) {
      showToast({ title: 'No activity to export', description: 'Workspace actions will appear here once you start using the CRM.', type: 'info' });
      return;
    }

    const blob = new Blob([JSON.stringify(timeline, null, 2)], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'controllusion-activity-log.json';
    link.click();
    URL.revokeObjectURL(url);
    showToast({ title: 'Activity log exported', type: 'info' });
  }

  if (loading) {
    return <LoadingSkeleton rows={4} />;
  }

  if (error) {
    return <ErrorState description={error} onRetry={refetch} />;
  }

  return (
    <div className="mx-auto max-w-[720px] space-y-6">
      <div>
        <h1 className="text-[24px] font-black tracking-[-0.05em] text-[#14213d]">Organization Activity</h1>
        <p className="mt-1 text-[12px] font-medium text-[#52627b]">Real-time timeline of critical events and updates across all teams.</p>
      </div>

      <Card className="rounded-[9px] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button className="inline-flex items-center gap-2 text-[12px] font-bold text-[#52627b]" type="button">
            <Filter className="h-3.5 w-3.5" />
            All Activities
          </button>
          <div className="flex gap-3">
            <Button onClick={exportLog} variant="secondary">
              <Download className="h-3.5 w-3.5" />
              Export Log
            </Button>
            <Button onClick={addReviewCheckpoint}>Create Report</Button>
          </div>
        </div>
      </Card>

      {timeline.length ? (
        <div className="relative space-y-7 pl-8">
          <div className="absolute bottom-10 left-[15px] top-4 w-px bg-[#dfe7f4]" />
          {timeline.map((item, index) => (
            <div className="relative" key={item.id || `${item.title}-${index}`}>
              <span className={`absolute -left-8 top-5 flex h-7 w-7 items-center justify-center rounded-full border-4 border-[#f7f9ff] bg-white ${
                index % 3 === 0 ? 'text-[#4c42e8]' : index % 3 === 1 ? 'text-[#ef7c47]' : 'text-[#9aa8bf]'
              }`}>
                <Clock3 className="h-3.5 w-3.5" />
              </span>
              {(index === 0 || index === 2) ? (
                <p className="mb-3 inline-flex rounded-full bg-white px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-[#8b98ae]">
                  {index === 0 ? 'Today' : 'Yesterday'}
                </p>
              ) : null}
              <Card className="rounded-[8px] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-[13px] font-black text-[#14213d]">{item.title || item.type || 'Activity updated'}</h2>
                    <p className="mt-2 text-[11px] leading-5 text-[#52627b]">{item.description || `${item.company} was updated by the team.`}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant={index % 2 === 0 ? 'brand' : 'warning'}>{item.company || 'Workspace'}</Badge>
                      <span className="text-[10px] font-semibold text-[#70809a]">{item.customerName}</span>
                    </div>
                  </div>
                  <span className="rounded-[5px] bg-[#eef4ff] px-2 py-1 text-[10px] font-bold text-[#52627b]">
                    {formatRelativeTime(item.date || item.createdAt)}
                  </span>
                </div>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState actionLabel="Create activity" onAction={addReviewCheckpoint} title="No activity yet" />
      )}

      <div className="flex justify-center">
        <Button onClick={addReviewCheckpoint} variant="secondary">
          <Plus className="h-3.5 w-3.5" />
          Load Older Activities
        </Button>
      </div>
    </div>
  );
}

export default ActivityPage;
