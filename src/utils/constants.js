import {
  LayoutDashboard,
  Users,
  UserRound,
  Shield,
  PlusCircle,
  BriefcaseBusiness,
} from 'lucide-react';

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
    to: '/customers',
    label: 'Customers',
    icon: Users,
  },
  {
    to: '/customers/create',
    label: 'Add Customer',
    icon: PlusCircle,
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: UserRound,
  },
];

export const ADMIN_NAV_ITEM = {
  to: '/admin',
  label: 'Admin',
  icon: Shield,
};

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
      'Keep activity timelines, follow-up tasks, and ownership in one workspace so teams move faster together.',
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
