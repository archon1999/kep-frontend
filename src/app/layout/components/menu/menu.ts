import { CoreMenu } from '@core/types';

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
        url: '/practice/problems'
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
      // {
      //   id: 'projects',
      //   title: 'Projects',
      //   translate: 'MENU.PROJECTS',
      //   type: 'item',
      //   icon: 'slack',
      //   url: '/practice/projects',
      // },
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
        id: 'arena',
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
  // {
  //   id: 'todo',
  //   title: 'Todo',
  //   translate: 'MENU.TODO',
  //   type: 'item',
  //   icon: 'todo',
  //   url: '/todo',
  // },
];
