import admin from './admin.json';
import arena from './arena.json';
import auth from './auth.json';
import blog from './blog.json';
import calendar from './calendar.json';
import challenges from './challenges.json';
import common from './common.json';
import contests from './contests.json';
import duels from './duels.json';
import giveaways from './giveaways.json';
import game from './game.json';
import hackathons from './hackathons.json';
import homePage from './home-page.json';
import kepCover from './kep-cover.json';
import kepcoinPage from './kepcoin-page.json';
import menu from './menu.json';
import pageTitles from './page-titles.json';
import problems from './problems.json';
import projects from './projects.json';
import search from './search.json';
import settings from './settings.json';
import shop from './shop.json';
import tests from './tests.json';
import tournaments from './tournaments.json';
import users from './users.json';

export const uzTranslation = {
  ...giveaways,
  ...game,
  ...admin,
  ...common,
  ...menu,
  ...pageTitles,
  ...settings,
  ...arena,
  ...homePage,
  ...kepCover,
  ...shop,
  ...auth,
  ...calendar,
  ...hackathons,
  ...projects,
  ...tests,
  ...users,
  ...search,
  ...kepcoinPage,
  ...challenges,
  ...blog,
  ...problems,
  ...tournaments,
  ...contests,
  ...duels,
};

export default uzTranslation;
