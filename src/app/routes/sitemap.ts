import { SxProps } from '@mui/material';
import { rootPaths } from './route-config';
import { resources } from './resources';

export interface MenuItem {
  name: string;
  pathName: string;
  key?: string;
  selectionPrefix?: string;
  path?: string;
  active?: boolean;
  icon?: string;
  iconSx?: SxProps;
  items?: MenuItem[];
}

const sitemap: MenuItem[] = [
  {
    name: 'Home',
    key: 'menu.home',
    path: rootPaths.root,
    pathName: 'home',
    icon: 'material-symbols:home-rounded',
    active: true,
  },
  // {
  //   name: 'Learn',
  //   key: 'menu.learn',
  //   pathName: 'learn',
  //   icon: 'mdi:school-outline',
  //   active: true,
  //   items: [
  //     {
  //       name: 'Blog',
  //       key: 'menu.blog',
  //       path: resources.Blog,
  //       pathName: 'learn-blog',
  //       selectionPrefix: resources.Blog,
  //       icon: 'mdi:notebook-outline',
  //       active: true,
  //     },
  //   ],
  // },
  {
    name: 'Practice',
    key: 'menu.practice',
    pathName: 'practice',
    icon: 'mdi:target-variant',
    active: true,
    items: [
      {
        name: 'Problems',
        key: 'menu.problems',
        path: resources.Problems,
        pathName: 'practice-problems',
        selectionPrefix: resources.Problems,
        icon: 'mdi:code-tags',
        active: true,
      },
      {
        name: 'Projects',
        key: 'menu.projects',
        path: resources.Projects,
        pathName: 'practice-projects',
        selectionPrefix: resources.Projects,
        icon: 'mdi:briefcase-outline',
        active: true,
      },
      {
        name: 'Tests',
        key: 'menu.tests',
        path: resources.Tests,
        pathName: 'practice-tests',
        selectionPrefix: resources.Tests,
        icon: 'mdi:clipboard-text-outline',
        active: true,
      },
    ],
  },
  {
    name: 'Battles',
    key: 'menu.battles',
    pathName: 'battles',
    icon: 'mdi:sword-cross',
    active: true,
    items: [
      {
        name: 'Challenges',
        key: 'menu.challenges',
        path: resources.Challenges,
        pathName: 'battles-challenges',
        selectionPrefix: resources.Challenges,
        icon: 'mdi:flag-checkered',
        active: true,
      },
      {
        name: 'Duels',
        key: 'menu.duels',
        path: resources.Duels,
        pathName: 'battles-duels',
        selectionPrefix: resources.Duels,
        icon: 'mdi:shield-sword',
        active: true,
      },
    ],
  },
  {
    name: 'Competitions',
    key: 'menu.competitions',
    pathName: 'competitions',
    icon: 'mdi:trophy-outline',
    active: true,
    items: [
      {
        name: 'Contests',
        key: 'menu.contests',
        path: resources.Contests,
        pathName: 'competitions-contests',
        selectionPrefix: resources.Contests,
        icon: 'mdi:podium-gold',
        active: true,
      },
      {
        name: 'Arena',
        key: 'menu.arena',
        path: resources.Arena,
        pathName: 'competitions-arena',
        selectionPrefix: resources.Arena,
        icon: 'mdi:sword-cross',
        active: true,
      },
      {
        name: 'Tournaments',
        key: 'menu.tournaments',
        path: resources.Tournaments,
        pathName: 'competitions-tournaments',
        selectionPrefix: resources.Tournaments,
        icon: 'mdi:tournament',
        active: true,
      },
      {
        name: 'Hackathons',
        key: 'menu.hackathons',
        path: resources.Hackathons,
        pathName: 'competitions-hackathons',
        selectionPrefix: resources.Hackathons,
        icon: 'mdi:laptop-account',
        active: true,
      },
    ],
  },
  {
    name: 'Users',
    key: 'menu.users',
    path: resources.Users,
    pathName: 'users',
    selectionPrefix: resources.Users,
    icon: 'mdi:account-multiple-outline',
    active: true,
  },
  // {
  //   name: 'Kepcoin',
  //   key: 'menu.kepcoin',
  //   path: resources.Kepcoin,
  //   pathName: 'kepcoin',
  //   selectionPrefix: resources.Kepcoin,
  //   icon: 'mdi:currency-usd-circle',
  //   active: true,
  // },
  {
    name: 'Calendar',
    key: 'menu.calendar',
    path: resources.Calendar,
    pathName: 'calendar',
    selectionPrefix: resources.Calendar,
    icon: 'material-symbols:calendar-month-outline',
    active: true,
  },
  {
    name: 'Shop',
    key: 'menu.shop',
    path: resources.Shop,
    pathName: 'shop',
    selectionPrefix: resources.Shop,
    icon: 'mdi:store-outline',
    active: true,
  },
];

export default sitemap;
