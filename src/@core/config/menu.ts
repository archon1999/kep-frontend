import { Resources } from "@app/resources";

export interface Menu {
  id: string;
  title: string;
  icon: string;
  type: 'link' | 'sub',
  path?: string,
  children?: Menu[];
}

export const MENU: Menu[] = [
  {
    id: 'home',
    title: 'Menu.Home',
    icon: 'home',
    type: 'link',
    path: Resources.Home,
  },
  // {
  //   id: 'learn',
  //   title: 'Menu.Learn',
  //   icon: 'learn',
  //   type: 'sub',
  //   children: [
  //     {
  //       id: 'courses',
  //       title: 'Menu.Courses',
  //       icon: 'course',
  //       type: 'link',
  //       path: Resources.Courses,
  //     },
  //     {
  //       id: 'blog',
  //       title: 'Menu.Blog',
  //       icon: 'blog',
  //       type: 'link',
  //       path: Resources.Blog,
  //     },
  //     {
  //       id: 'lugavar',
  //       title: 'Menu.Lugavar',
  //       icon: 'bookmark',
  //       type: 'link',
  //       path: Resources.Lugavar,
  //     },
  //   ],
  // },
  {
    id: 'practice',
    title: 'Menu.Practice',
    icon: 'practice',
    type: 'sub',
    children: [
      {
        id: 'problems',
        title: 'Menu.Problems',
        icon: 'problem',
        type: 'link',
        path: Resources.Problems,
      },
      {
        id: 'challenges',
        title: 'Menu.Challenges',
        icon: 'challenge',
        type: 'link',
        path: Resources.Challenges,
      },
      // {
      //   id: 'duels',
      //   title: 'Menu.Duels',
      //   icon: 'duel',
      //   type: 'link',
      //   path: Resources.Duels,
      // },
      {
        id: 'projects',
        title: 'Menu.Projects',
        icon: 'project',
        type: 'link',
        path: Resources.Projects,
      },
      {
        id: 'tests',
        title: 'Menu.Tests',
        icon: 'test',
        type: 'link',
        path: Resources.Tests,
      },
    ],
  },
  {
    id: 'competitions',
    title: 'Menu.Competitions',
    icon: 'cup',
    type: 'sub',
    children: [
      {
        id: 'contests',
        title: 'Menu.Contests',
        icon: 'contest',
        type: 'link',
        path: Resources.Contests,
      },
      {
        id: 'arenas',
        title: 'Menu.Arena',
        icon: 'arena',
        type: 'link',
        path: Resources.Arena,
      },
      {
        id: 'tournaments',
        title: 'Menu.Tournaments',
        icon: 'tournament',
        type: 'link',
        path: Resources.Tournaments,
      },
      {
        id: 'hackathons',
        title: 'Menu.Hackathons',
        icon: 'hackathons',
        type: 'link',
        path: Resources.Hackathons,
      },
    ],
  },
  {
    id: 'users',
    title: 'Menu.Users',
    icon: 'users',
    type: 'link',
    path: Resources.Users,
  },
  {
    id: 'kepcoin',
    title: 'Kepcoin',
    icon: 'dollar',
    type: 'link',
    path: Resources.Kepcoin,
  },
  {
    id: 'calendar',
    title: 'Menu.Calendar',
    icon: 'calendar',
    type: 'link',
    path: Resources.Calendar,
  },
  {
    id: 'shop',
    title: 'Menu.Shop',
    icon: 'shop',
    type: 'link',
    path: Resources.Shop,
  },
  // {
  //   id: 'kep-cover',
  //   title: 'KEP Cover',
  //   icon: 'design',
  //   type: 'link',
  //   path: Resources.KepCover,
  // },
];
