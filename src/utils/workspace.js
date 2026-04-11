import {
  BadgeDollarSign,
  Boxes,
  CalendarDays,
  ClipboardList,
  ContactRound,
  Heart,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Mail,
  Package,
  Settings,
  TableProperties,
  UsersRound,
  WalletCards,
  Wrench,
} from 'lucide-react';

export const WORKSPACE_NAVIGATION = {
  primary: [
    {
      key: 'dashboard',
      path: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      key: 'products',
      path: '/products',
      label: 'Products',
      icon: Package,
    },
    {
      key: 'favorites',
      path: '/favorites',
      label: 'Favorites',
      icon: Heart,
    },
    {
      key: 'inbox',
      path: '/inbox',
      label: 'Inbox',
      icon: Mail,
    },
    {
      key: 'order-lists',
      path: '/order-lists',
      label: 'Order Lists',
      icon: ClipboardList,
    },
    {
      key: 'product-stock',
      path: '/product-stock',
      label: 'Product Stock',
      icon: Boxes,
    },
  ],
  secondary: [
    {
      key: 'pricing',
      path: '/pricing',
      label: 'Pricing',
      icon: BadgeDollarSign,
    },
    {
      key: 'calender',
      path: '/calender',
      label: 'Calender',
      icon: CalendarDays,
    },
    {
      key: 'to-do',
      path: '/to-do',
      label: 'To-Do',
      icon: ListTodo,
    },
    {
      key: 'contact',
      path: '/contact',
      label: 'Contact',
      icon: ContactRound,
    },
    {
      key: 'invoice',
      path: '/invoice',
      label: 'Invoice',
      icon: WalletCards,
    },
    {
      key: 'ui-elements',
      path: '/ui-elements',
      label: 'UI Elements',
      icon: Wrench,
    },
    {
      key: 'team',
      path: '/team',
      label: 'Team',
      icon: UsersRound,
    },
    {
      key: 'table',
      path: '/table',
      label: 'Table',
      icon: TableProperties,
    },
  ],
  footer: [
    {
      key: 'settings',
      path: '/settings',
      label: 'Settings',
      icon: Settings,
    },
    {
      key: 'logout',
      path: '/logout',
      label: 'Logout',
      icon: LogOut,
      isAction: true,
    },
  ],
};

export const WORKSPACE_ROUTES = [
  ...WORKSPACE_NAVIGATION.primary,
  ...WORKSPACE_NAVIGATION.secondary,
  WORKSPACE_NAVIGATION.footer[0],
];

export const WORKSPACE_BY_KEY = Object.fromEntries(
  [...WORKSPACE_ROUTES, WORKSPACE_NAVIGATION.footer[1]].map((item) => [item.key, item]),
);
