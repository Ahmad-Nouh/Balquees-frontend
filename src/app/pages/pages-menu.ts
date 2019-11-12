import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: 'PAGES.Home.TITLE',
  //   icon: 'home-outline',
  //   link: '/pages/dashboard',
  //   home: true,
  // },
  {
    title: 'PAGES.Warehouses.warehouses',
    icon: 'inbox-outline',
    link: '/pages/materials',
    home: true,
  },
  {
    title: 'PAGES.ProductsCards.productsCards',
    icon: 'file-text-outline',
    link: '/pages/productsCards',
    home: true,
  },
  {
    title: 'PAGES.PaintMixes.paintMixes',
    icon: `brush-outline`,
    link: '/pages/paintMixes',
    home: true,
  },
  {
    title: 'PAGES.BodyMixes.bodyMixes',
    icon: 'archive-outline',
    link: '/pages/bodyMixes',
    home: true,
  },
  {
    title: 'PAGES.EngobMixes.engobMixes',
    icon: 'cube-outline',
    link: '/pages/engobMixes',
    home: true,
  },
  {
    title: 'PAGES.Inventory.inventory',
    icon: 'calendar-outline',
    link: '/pages/inventory',
    home: true,
  }
  // {
  //   title: 'FEATURES',
  //   group: true,
  // },
  // {
  //   title: 'Auth',
  //   icon: 'lock-outline',
  //   children: [
  //     {
  //       title: 'Login',
  //       link: '/auth/login',
  //     },
  //     {
  //       title: 'Register',
  //       link: '/auth/register',
  //     },
  //     {
  //       title: 'Request Password',
  //       link: '/auth/request-password',
  //     },
  //     {
  //       title: 'Reset Password',
  //       link: '/auth/reset-password',
  //     },
  //   ],
  // },
];
