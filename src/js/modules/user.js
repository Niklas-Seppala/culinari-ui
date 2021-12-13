import { UserMenuView } from '../views/UserMenu/UserMenuView';

/**
 * @type {}
 */
 let __user = undefined;

/**
 * 
 * @returns {boolean}
 */
const loadStorage = () => {
  __user = JSON.parse(localStorage.getItem('user'))
  return Boolean(__user)
};

const store = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  __user = user
}

const getUser = () => {
  if (__user) { return {...__user} }
  else return undefined;
}

const dispose = () => {
  __user = undefined;
  localStorage.clear();
}

const components = () => {
  return {
    userMenu: new UserMenuView('main').detach()
  }
}

export default {
  loadStorage,
  getUser,
  store,
  dispose,
  components
};
