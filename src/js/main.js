import { TopMenuView } from "./views/TopMenu/TopMenuView";

const main = () => {
  const topMenu = new TopMenuView(document.getElementById('top-panel-view'));
  topMenu.dom.contentNav.on.talkedClicked(e => console.log('talked') )
  topMenu.dom.contentNav.on.likedClicked(e => console.log('liked'))
  topMenu.dom.contentNav.on.latestClicked(e => console.log('latest'))

  topMenu.on.searchClicked(e => console.log('search'))
  topMenu.on.userMenuClicked(e => console.log('menu'))
};

window.onload = main;
