import { Icons } from '@/components/icons';
import { User } from 'next-auth';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export interface CardItem {
  cardButton?: boolean;
  cardButtonText?: string;
  cardTitle: string;
  cardValue: string | number | undefined;
  cardIcon: keyof typeof Icons;
  // Color of the cardIcon. Accepts hexadecimal color format
  cardIconColor?: string;
  cardSubText?: string;
  className?: string;
  trending?: 'up' | 'down';
  redirectTo?: RedirectParams;
}

export interface RedirectParams {
  page: string;
  status?: string;
}

export interface TableFilter {
  [key: string]: string | number;
}

export interface Roles {
  role: 'Administrator' | 'User' | 'Member';
}

export interface LeaveBalanceType {
  balance: number;
  convertible_balance: number;
  leave_type_id: string;
  leave_type_name: string;
}

export interface Organization {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface PaginationTypes {
  limit: string;
  page: string;
  totalCount: number;
  totalPage: number;
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
