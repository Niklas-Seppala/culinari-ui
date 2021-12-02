import { TopMenuView } from "./views/TopMenu/TopMenuView";
import { UserMenuView } from "./views/UserMenu/UserMenuView";

const main = () => {

  const topMenu = new TopMenuView('top-panel-view');
  // Content navigation clicks.
  topMenu.contentNav.on.talkedClicked(e => console.log('talked') )
  topMenu.contentNav.on.likedClicked(e => console.log('liked'))
  topMenu.contentNav.on.latestClicked(e => console.log('latest'))
  // Search and menu clicks.
  topMenu.on.searchClicked(e => console.log('search'))
  topMenu.on.userMenuClicked(e => console.log('menu'))

  const userMenu = new UserMenuView('main');
  // Set profile state.
  userMenu.profile.render({
    username: 'Markoboy',
    avatar: 'https://yt3.ggpht.com/ytc/AKedOLQe8H7ugXR3Y054TX2CXg5iY1ojDFB6Qoes2b1n=s900-c-k-c0x00ffffff-no-rj',
    likes: 6,
    comments: 12,
    forks: 666
  })

  userMenu.detach();

  // Menu click events.
  userMenu.anonymous.on.aboutClicked(e => console.log('about'))
  userMenu.anonymous.on.loginClicked(e => console.log('login'))
  userMenu.anonymous.on.registerClicked(e => console.log('register'))
  userMenu.logged.on.friendsClicked(e => console.log('friends'))
  userMenu.logged.on.logoutClicked(e => console.log('logout'))
  userMenu.logged.on.myRecipesClicked(e => console.log('my recipes'))
  userMenu.logged.on.newRecipeClicked(e => console.log('new recipe'))

  // Detach anonymous part from user menu.
  userMenu.anonymous.detach();
};

window.onload = main;
