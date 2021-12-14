import { UserMenuView } from '../views/UserMenu/UserMenuView';

/**
 * @type {{
 *  token: string,
 *  name: string,
 *  commentCount: number,
 *  id: number,
 *  role: number,
 *  score: number,
 *  recipes: []
 * }}
 */
 let __user = undefined;

 let __users = undefined;

/**
 * 
 * @returns {boolean}
 */
const loadStorage = () => {
  __user = JSON.parse(localStorage.getItem('user'))
  return Boolean(__user)
};

const store = (user) => {
  user.commentCount = user.recipes.reduce((a, b) => (b.comment.length || 0) + a, 0)
  user.forkCount = user.recipes.reduce((a,b) => (b.forked_from ? 1 : 0  + a), 0)
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

const __fetch = async (route) => {
  const response = await fetch(route);
  __users = {};
  const temp = await response.json();
  temp.forEach(usr => {
    __users[usr.id] = usr;
  })
  return __users
}

const getUsers = () => __users

export default {
  loadStorage,
  getUser,
  getUsers,
  store,
  dispose,
  components,
  fetch: __fetch
};
