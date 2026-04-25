import {
  BarChart3,
  BriefcaseBusiness,
  Clock3,
  Diamond,
  LayoutDashboard,
  Settings,
  Table2,
  TrendingUp,
  Users,
} from 'lucide-react';

export const APP_BRAND = {
  name: 'Controllusion',
  subtitle: 'Precision CRM',
};

export const STATUS_OPTIONS = ['New', 'Active', 'Inactive', 'VIP'];
export const STAGE_OPTIONS = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
export const ROLE_OPTIONS = ['Admin', 'User'];

export const PAGE_SIZE = 6;

export const APP_NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/leads',
    label: 'Leads',
    icon: Users,
  },
  {
    to: '/customers',
    label: 'Accounts',
    icon: Table2,
  },
  {
    to: '/deals',
    label: 'Deals',
    icon: Diamond,
  },
  {
    to: '/analytics',
    label: 'Analytics',
    icon: TrendingUp,
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export const SECONDARY_NAV_ITEMS = [
  {
    to: '/activity',
    label: 'Activity',
    icon: Clock3,
  },
];

export const ADMIN_NAV_ITEM = {
  to: '/admin',
  label: 'Team',
  icon: BarChart3,
};

export const APP_SEARCH_ITEMS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    key: 'leads',
    label: 'Leads',
    path: '/leads',
  },
  {
    key: 'customers',
    label: 'Accounts',
    path: '/customers',
  },
  {
    key: 'customers-create',
    label: 'Create customer',
    path: '/customers/create',
  },
  {
    key: 'deals',
    label: 'Deals',
    path: '/deals',
  },
  {
    key: 'analytics',
    label: 'Analytics',
    path: '/analytics',
  },
  {
    key: 'activity',
    label: 'Activity timeline',
    path: '/activity',
  },
  {
    key: 'profile',
    label: 'Profile',
    path: '/profile',
  },
  {
    key: 'settings',
    label: 'Settings',
    path: '/settings',
  },
  {
    key: 'admin',
    label: 'Admin',
    path: '/admin',
    roles: ['Admin'],
  },
];

export const HOME_FEATURES = [
  {
    title: 'Pipeline visibility',
    description:
      'Track every account from first contact to close with clear stages, health indicators, and deal momentum.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Team coordination',
    description:
      'Keep activity timelines, follow-up tasks, and ownership in one CRM so teams move faster together.',
    icon: Users,
  },
  {
    title: 'Actionable analytics',
    description:
      'Monitor win rates, pipeline value, revenue trends, and customer health without switching tools.',
    icon: LayoutDashboard,
  },
];

export const KPI_TRUST_ITEMS = [
  { label: 'Pipeline accuracy', value: '94%' },
  { label: 'Faster follow-ups', value: '2.3x' },
  { label: 'Admin setup time', value: '14 min' },
  { label: 'Customer records', value: '15k+' },
];

export const CUSTOMER_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'dealValue', label: 'Highest deal value' },
];

export const DEFAULT_NOTIFICATION_TIMEOUT = 3600;
