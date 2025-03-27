import { CardItem, NavItem } from 'types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Leave',
    url: '/dashboard/leave',
    icon: 'leaves',
    isActive: false,
    shortcut: ['l', 'l'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Reimbursements',
    url: '/dashboard/reimbursement',
    icon: 'reimbursement',
    shortcut: ['r', 'r'],
    isActive: false,
    items: [] // No child items
  }

  //hid pages for reference
  // {
  //   title: 'Account',
  //   url: '#', // Placeholder as there is no direct link for the parent
  //   icon: 'billing',
  //   isActive: true,

  //   items: [
  //     {
  //       title: 'Profile',
  //       url: '/dashboard/profile',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm']
  //     }
  //   ]
  // }
  // {
  //   title: 'Kanban',
  //   url: '/dashboard/kanban',
  //   icon: 'kanban',
  //   shortcut: ['k', 'k'],
  //   isActive: false,
  //   items: [] // No child items
  // }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];

//Info: The following data is used for the data displayed on the top part of dashboard page.
export const dashboardCardItems: CardItem[] = [
  {
    cardTitle: 'Pending Leaves Requests',
    cardValue: 60,
    cardIcon: 'leaves',
    // cardSubText: `${'5%'} Last Month`,
    trending: 'up'
  },
  {
    cardTitle: 'Approved Leaves',
    cardValue: 2,
    cardIcon: 'leaves',
    // cardSubText: `${'1%'} Last Month`,
    trending: 'up'
  },
  {
    cardTitle: 'Pending Reimbursements',
    cardValue: 5,
    cardIcon: 'clockAlert',
    // cardSubText: `${'1%'} Last Month`,
    trending: 'up'
  },
  {
    cardTitle: 'Approved Reimbursements',
    cardValue: 5,
    cardIcon: 'clockAlert',
    // cardSubText: `${'6%'} Last Month`,
    trending: 'up'
  }
];

export const userCardItems: CardItem[] = [
  {
    cardTitle: 'Pending Requests',
    cardValue: 2,
    cardIcon: 'leaves',
    // cardSubText: `${'1%'} Last Month`,
    trending: 'up'
  },
  {
    cardTitle: 'Approved Requests',
    cardValue: 5,
    cardIcon: 'leaves',
    // cardSubText: `${'1%'} Last Month`,
    trending: 'up'
  },
  {
    cardTitle: 'Pending Reimbursements',
    cardValue: 250,
    cardIcon: 'clockAlert',
    // cardSubText: `${'6%'} Last Month`,
    trending: 'up'
  },
  {
    cardTitle: 'Approved Reimbursements',
    cardValue: 5,
    cardIcon: 'clockAlert',
    // cardSubText: `${'1%'} Last Month`,
    trending: 'up'
  }
];
