
let user = undefined;

/**
 * 
 * @returns {boolean}
 */
const loadCurrent = () => {
  const token = localStorage.getItem('jwt');
  const user = JSON.parse(localStorage.getItem('user'));

  if (token && user) {
    user = {
      token,
      user
    }
    return true;
  }
  return false;
};

const getUser = () => {
  if (user) { return {...user} }
  else return undefined;
}

export default {
  loadCurrent,
  getUser,
};
