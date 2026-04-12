import { apiClient } from './apiClient';
import { normalizeListResponse, pickFirstDefined, unwrapApiData } from './normalizers';

function normalizeRevenueSeries(data = []) {
  return normalizeListResponse(data, 'revenue').map((item, index) => ({
    name: item.name || item.label || item.month || `M${index + 1}`,
    revenue: Number(pickFirstDefined(item.revenue, item.value, item.totalRevenue, item.amount, 0)),
    deals: Number(pickFirstDefined(item.deals, item.totalDeals, item.count, 0)),
  }));
}

function normalizeDashboardSummary(data) {
  const payload = unwrapApiData(data) || {};

  return {
    totalCustomers: Number(pickFirstDefined(payload.totalCustomers, payload.customerCount, payload.customersTotal, 0)),
    activeDeals: Number(pickFirstDefined(payload.activeDeals, payload.openDeals, payload.dealsInProgress, 0)),
    pipelineValue: Number(pickFirstDefined(payload.pipelineValue, payload.totalPipelineValue, payload.pipelineTotal, 0)),
    conversionRate: Number(pickFirstDefined(payload.conversionRate, payload.winRate, payload.closeRate, 0)),
    revenue: normalizeRevenueSeries(payload.revenue || payload.revenueSeries || payload.salesTrend || []),
    activity: normalizeListResponse(payload.activity || payload.recentActivity || [], 'activity'),
    tasks: normalizeListResponse(payload.tasks || payload.openTasks || [], 'tasks'),
  };
}

export async function getDashboardSummary() {
  const { data } = await apiClient.get('/dashboard/summary');
  return normalizeDashboardSummary(data);
}
