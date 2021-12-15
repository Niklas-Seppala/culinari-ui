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
  console.log('loading storage')
  __user = JSON.parse(localStorage.getItem('user'))
  if (__user) {
    console.log(__user.name, 'active')
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

export default {
  loadStorage,
  getUser,
  getUsers,
  store,
  dispose,
  components,
  fetch: __fetch
};
