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

export const clientMenu: MenuItem[] = [
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
      // {
      //   name: 'Duels',
      //   key: 'menu.duels',
      //   path: resources.Duels,
      //   pathName: 'battles-duels',
      //   selectionPrefix: resources.Duels,
      //   icon: 'mdi:shield-sword',
      //   active: true,
      // },
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

export const adminMenu: MenuItem[] = [
  {
    name: 'Problems',
    key: 'admin.groups.problems',
    path: resources.AdminProblems,
    pathName: 'admin-problems',
    selectionPrefix: resources.AdminProblems,
    icon: 'mdi:code-tags',
    active: true,
    items: [
      {
        name: 'Problems',
        key: 'admin.problems.title',
        path: resources.AdminProblems,
        pathName: 'admin-problems-list',
        icon: 'mdi:code-tags',
        active: true,
      },
      {
        name: 'Attempts',
        key: 'admin.resources.problemAttempts.title',
        path: resources.AdminProblemAttempts,
        pathName: 'admin-problem-attempts',
        selectionPrefix: resources.AdminProblemAttempts,
        icon: 'mdi:source-branch',
        active: true,
      },
      {
        name: 'Chapters',
        key: 'admin.resources.problemChapters.title',
        path: resources.AdminProblemChapters,
        pathName: 'admin-problem-chapters',
        selectionPrefix: resources.AdminProblemChapters,
        icon: 'mdi:book-open-page-variant-outline',
        active: true,
      },
      {
        name: 'Tags',
        key: 'admin.resources.problemTags.title',
        path: resources.AdminProblemTags,
        pathName: 'admin-problem-tags',
        selectionPrefix: resources.AdminProblemTags,
        icon: 'mdi:tag-multiple-outline',
        active: true,
      },
    ],
  },
  {
    name: 'Contests',
    key: 'admin.groups.contests',
    path: resources.AdminContests,
    pathName: 'admin-contests',
    selectionPrefix: resources.AdminContests,
    icon: 'mdi:podium-gold',
    active: true,
    items: [
      {
        name: 'Contests',
        key: 'admin.contests.title',
        path: resources.AdminContests,
        pathName: 'admin-contests-list',
        icon: 'mdi:podium-gold',
        active: true,
      },
      {
        name: 'Contest questions',
        key: 'admin.resources.contestQuestions.title',
        path: resources.AdminContestQuestions,
        pathName: 'admin-contest-questions',
        selectionPrefix: resources.AdminContestQuestions,
        icon: 'mdi:comment-question-outline',
        active: true,
      },
      {
        name: 'Contest types',
        key: 'admin.resources.contestTypes.title',
        path: resources.AdminContestTypes,
        pathName: 'admin-contest-types',
        selectionPrefix: resources.AdminContestTypes,
        icon: 'mdi:shape-outline',
        active: true,
      },
      {
        name: 'Filters',
        key: 'admin.resources.contestFilters.title',
        path: resources.AdminContestFilters,
        pathName: 'admin-contest-filters',
        selectionPrefix: resources.AdminContestFilters,
        icon: 'mdi:filter-variant',
        active: true,
      },
    ],
  },
  {
    name: 'Users',
    key: 'admin.groups.users',
    path: resources.AdminUsers,
    pathName: 'admin-users',
    selectionPrefix: resources.AdminUsers,
    icon: 'mdi:account-multiple-outline',
    active: true,
    items: [
      {
        name: 'Users',
        key: 'admin.users.title',
        path: resources.AdminUsers,
        pathName: 'admin-users-list',
        icon: 'mdi:account-multiple-outline',
        active: true,
      },
      {
        name: 'Teams',
        key: 'admin.resources.teams.title',
        path: resources.AdminTeams,
        pathName: 'admin-teams',
        selectionPrefix: resources.AdminTeams,
        icon: 'mdi:account-group-outline',
        active: true,
      },
    ],
  },
];

export default clientMenu;
