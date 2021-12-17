import { UserMenuView } from '../views/UserMenu/UserMenuView';
import api from './api';

/**
 * @type {{
 *  token: string,
 *  name: string,
 *  commentCount: number,
 *  id: number,
 *  role: number,
 *  score: number,
 *  email: string,
 *  recipe: []
 *  admin: boolean,
 *  forkCount: number
 * }}
 */
 let __user = undefined;

 let __users = undefined;


const loadStorage = async () => {
  console.log('loading storage')
  __user = JSON.parse(localStorage.getItem('user'))
  console.log(__user)
  if (__user) {
    const response = await fetch(api.ROUTES.USER.PRIVATE(__user.id), api.METHODS.GET(__user.token));
    const temp = await response.json();
    temp.token = __user.token;
    temp.admin = __user.role === 1;
    __user = temp;
    console.log(__user.name, __user, 'active')
  }
  return Boolean(__user)
};

const store = (user) => {
  user.commentCount = user.recipes.reduce((a, b) => (b.comment.length || 0) + a, 0)
  user.forkCount = user.recipes.reduce((a,b) => (b.forked_from ? 1 : 0  + a), 0)
  localStorage.setItem('user', JSON.stringify(user));
  __user = user
}

const getUser = () => {
  if (__user) {
    return {...__user}
  }
  else {
    return undefined;
  }
}

const hasUser = () => Boolean(__user)

const dispose = () => {
  console.log(__user.name, 'logged out')
  __user = undefined;
  localStorage.clear();
}

const components = () => {
  return {
    userMenu: new UserMenuView('main').detach()
  }
}

const __fetch = async (route) => {
  console.log('fetching users from remote..')
  const response = await fetch(route);
  if (response.ok) {
    __users = {};
    const temp = await response.json();
    temp.forEach(usr => {
      __users[usr.id] = usr;
    })
    console.log('success:', __users)
    return __users
  }
  console.log('failed to fetch :(')
  return undefined;
}

const getUsers = () => __users

const getMyRecipes = (recipes) => {
  if (__user) {
    __user.recipe = recipes.filter(res => res.owner_id === __user.id)
    __user.forkCount = __user.recipe.reduce((b,a) => { return b + a.fork.length}, 0);
    console.log(__user)
  }
}

export default {
  loadStorage,
  getUser,
  hasUser,
  getUsers,
  store,
  dispose,
  components,
  getMyRecipes,
  fetch: __fetch
};
