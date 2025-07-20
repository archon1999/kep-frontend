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
    title: 'MENU.HOME',
    icon: 'home',
    type: 'link',
    path: Resources.Home,
  },
  {
    id: 'learn',
    title: 'MENU.LEARN',
    icon: 'learn',
    type: 'sub',
    children: [
      {
        id: 'courses',
        title: 'MENU.COURSES',
        icon: 'course',
        type: 'link',
        path: Resources.Courses,
      },
      {
        id: 'blog',
        title: 'MENU.BLOG',
        icon: 'blog',
        type: 'link',
        path: Resources.Blog,
      },
      {
        id: 'lugavar',
        title: 'MENU.LUGAVAR',
        icon: 'bookmark',
        type: 'link',
        path: Resources.Lugavar,
      },
    ],
  },
  {
    id: 'practice',
    title: 'MENU.PRACTICE',
    icon: 'practice',
    type: 'sub',
    children: [
      {
        id: 'problems',
        title: 'MENU.PROBLEMS',
        icon: 'problem',
        type: 'link',
        path: Resources.Problems,
      },
      {
        id: 'challenges',
        title: 'MENU.CHALLENGES',
        icon: 'challenge',
        type: 'link',
        path: Resources.Challenges,
      },
      {
        id: 'tests',
        title: 'MENU.TESTS',
        icon: 'test',
        type: 'link',
        path: Resources.Tests,
      },
      {
        id: 'projects',
        title: 'MENU.PROJECTS',
        icon: 'project',
        type: 'link',
        path: Resources.Projects,
      },
    ],
  },
  {
    id: 'competitions',
    title: 'MENU.COMPETITIONS',
    icon: 'cup',
    type: 'sub',
    children: [
      {
        id: 'contests',
        title: 'MENU.CONTESTS',
        icon: 'contest',
        type: 'link',
        path: Resources.Contests,
      },
      {
        id: 'arenas',
        title: 'MENU.ARENA',
        icon: 'arena',
        type: 'link',
        path: Resources.Arena,
      },
      {
        id: 'tournaments',
        title: 'MENU.TOURNAMENTS',
        icon: 'tournament',
        type: 'link',
        path: Resources.Tournaments,
      },
      {
        id: 'hackathons',
        title: 'MENU.HACKATHONS',
        icon: 'hackathons',
        type: 'link',
        path: Resources.Hackathons,
      },
    ],
  },
  {
    id: 'users',
    title: 'MENU.USERS',
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
    title: 'MENU.CALENDAR',
    icon: 'calendar',
    type: 'link',
    path: Resources.Calendar,
  },
  {
    id: 'shop',
    title: 'MENU.SHOP',
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
