import { CoreMenu } from '@core/types';
import { Resources } from '@app/resources';

export const menu: CoreMenu[] = [
  {
    id: 'home',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: '/home',
    exactMatch: true,
  },
  {
    id: 'learn',
    translate: 'MENU.LEARN',
    type: 'section',
    icon: 'learn',
    children: [
      {
        id: 'courses',
        translate: 'MENU.COURSES',
        type: 'item',
        icon: 'course',
        url: '/learn/courses',
      },
      // {
      //   id: 'lugavar',
      //   title: 'Lugavar',
      //   translate: 'MENU.LUGAVAR',
      //   type: 'item',
      //   icon: 'bookmark',
      //   url: '/learn/lugavar',
      // },
      {
        id: 'blog',
        translate: 'MENU.BLOG',
        type: 'item',
        icon: 'blog',
        url: '/learn/blog',
      },
    ]
  },
  {
    id: 'practice',
    translate: 'MENU.PRACTICE',
    type: 'section',
    icon: 'practice',
    children: [
      {
        id: 'problems',
        translate: 'MENU.PROBLEMS',
        type: 'item',
        icon: 'problem',
        url: '/practice/problems',
        // children: [
        //   {
        //     id: 'competitive-programming',
        //     title: 'Competitive Programming',
        //     translate: 'CompetitiveProgramming',
        //     type: 'item',
        //     url: '/practice/problems/competitive-programming',
        //     icon: 'competitive-programming',
        //   }
        // ]
      },
      {
        id: 'tests',
        translate: 'MENU.TESTS',
        type: 'item',
        icon: 'test',
        url: '/practice/tests',
      },
      {
        id: 'challenges',
        translate: 'MENU.CHALLENGES',
        type: 'item',
        icon: 'challenge',
        url: '/practice/challenges',
      },
      {
        id: 'projects',
        title: 'Projects',
        translate: 'MENU.PROJECTS',
        type: 'item',
        icon: 'project',
        url: '/practice/projects',
      },
    ]
  },
  {
    id: 'competitions',
    translate: 'MENU.COMPETITIONS',
    type: 'section',
    icon: 'cup',
    children: [
      {
        id: 'contests',
        translate: 'MENU.CONTESTS',
        type: 'item',
        icon: 'contest',
        url: '/competitions/contests',
      },
      {
        id: 'arenas',
        translate: 'MENU.ARENA',
        type: 'item',
        icon: 'arena',
        url: '/competitions/arena',
      },
      {
        id: 'tournaments',
        translate: 'MENU.TOURNAMENTS',
        type: 'item',
        icon: 'tournament',
        url: '/competitions/tournaments',
      },
      // {
      //   id: 'code-rush',
      //   title: 'Code rush',
      //   translate: 'MENU.CODE_RUSH',
      //   type: 'item',
      //   icon: 'code',
      //   url: '/competitions/code-rush',
      // },
    ]
  },
  {
    id: 'users',
    translate: 'MENU.USERS',
    type: 'item',
    icon: 'users',
    url: '/users',
  },
  {
    id: 'calendar',
    translate: 'MENU.CALENDAR',
    type: 'item',
    icon: 'calendar',
    url: '/calendar',
  },
  // {
  //   id: 'todo',
  //   title: 'Todo',
  //   translate: 'MENU.TODO',
  //   type: 'item',
  //   icon: 'todo',
  //   url: '/todo',
  // },
  {
    id: 'shop',
    translate: 'MENU.SHOP',
    type: 'item',
    icon: 'shop',
    url: Resources.Shop,
  },
  {
    id: 'kep-cover',
    translate: 'KEP Cover',
    type: 'item',
    icon: 'design',
    url: Resources.KepCover,
  },
  // {
  //   id: 'kepcoin',
  //   translate: 'Kepcoin',
  //   type: 'item',
  //   icon: 'dollar',
  //   url: Resources.Kepcoin,
  // },
];
