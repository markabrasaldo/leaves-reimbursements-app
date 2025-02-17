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
  cardTitle: string;
  cardValue: string | number | undefined;
  cardIcon: keyof typeof Icons;
  cardSubText: string;
  trending: 'up' | 'down';
}

export interface TableFilter {
  page: number;
  limit: number;
  categories?: string;
  search?: string;
}

export interface UserSessionType extends User {
  role: string;
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
