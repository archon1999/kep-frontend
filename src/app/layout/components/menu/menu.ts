import { CoreMenu } from '../../../../@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'home',
    title: 'Home',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: '/home',
    exactMatch: true,
  },
  {
    id: 'learn',
    title: 'Learn',
    translate: 'MENU.LEARN',
    type: 'section',
    icon: 'book',
    children: [
      {
        id: 'courses',
        title: 'Courses',
        translate: 'MENU.COURSES',
        type: 'item',
        icon: 'book-open',
        url: '/learn/courses',  
      },
      {
        id: 'lugavar',
        title: 'Lugavar',
        translate: 'MENU.LUGAVAR',
        type: 'item',
        icon: 'bookmark',
        url: '/learn/lugavar',  
      },
      {
        id: 'blog',
        title: 'Blog',
        translate: 'MENU.BLOG',
        type: 'item',
        icon: 'edit-2',
        url: '/learn/blog',  
      },
    ]
  },
  {
    id: 'practice',
    title: 'Practice',
    translate: 'MENU.PRACTICE',
    type: 'section',
    icon: 'edit',
    children: [
      {
        id: 'problems',
        title: 'Problems',
        translate: 'MENU.PROBLEMS',
        type: 'item',
        icon: 'menu',
        url: '/practice/problems',
      },
      {
        id: 'tests',
        title: 'Tests',
        translate: 'MENU.TESTS',
        type: 'item',
        icon: 'edit-3',
        url: '/practice/tests',
      },
      {
        id: 'challenges',
        title: 'Challenges',
        translate: 'MENU.CHALLENGES',
        type: 'item',
        icon: 'zap',
        url: '/practice/challenges',
      },
      {
        id: 'projects',
        title: 'Projects',
        translate: 'MENU.PROJECTS',
        type: 'item',
        icon: 'slack',
        url: '/practice/projects',
      },
    ]
  },
  {
    id: 'competitions',
    title: 'Competitions',
    translate: 'MENU.COMPETITIONS',
    type: 'section',
    icon: 'zap',
    children: [
      {
        id: 'contests',
        title: 'Contests',
        translate: 'MENU.CONTESTS',
        type: 'item',
        icon: 'flag',
        url: '/competitions/contests',
      },
      {
        id: 'arena',
        title: 'Arena',
        translate: 'MENU.ARENA',
        type: 'item',
        icon: 'shield',
        url: '/competitions/arena',
      },
      {
        id: 'tournaments',
        title: 'Tournaments',
        translate: 'MENU.TOURNAMENTS',
        type: 'item',
        icon: 'award',
        url: '/competitions/tournaments',
      },
    ]
  },
  {
    id: 'users',
    title: 'Users',
    translate: 'MENU.USERS',
    type: 'item',
    icon: 'users',
    url: '/users',
  },

  {
    id: 'help',
    title: 'Help',
    translate: 'MENU.HELP',
    type: 'section',
    icon: 'help-circle',
    children: [
      
    ]
  },
  {
    id: 'help_project',
    title: 'Help project',
    translate: 'MENU.HELP_PROJECT',
    type: 'section',
    icon: 'git-pull-request',
    children: [
      
    ]
  },
]