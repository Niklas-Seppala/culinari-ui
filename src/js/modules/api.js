const BASE_URL = 'https://127.0.0.1:8000';

const ROUTES = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
  },
  USER: {
    ALL: `${BASE_URL}/user`,
    SINGLE: (id) => `${BASE_URL}/user/${id}`
  },
  RECIPE: {
    ALL: `${BASE_URL}/recipe`,
    POST: `${BASE_URL}/recipe`,
    SINGLE: (id) => `${BASE_URL}/recipe/${id}`,
    LIKE: (id) => `${BASE_URL}/recipe/${id}/like`,
  },
  COMMENT: {
    ALL: `${BASE_URL}/comment`,
    POST: `${BASE_URL}/comment`,
    SINGLE: (id) => `${BASE_URL}/comment/${id}`,
    LIKE: (id) => `${BASE_URL}/comment/${id}/like`,
  }
};

const METHODS = {
  POST: (body, auth) => {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + auth,
      },
      body: JSON.stringify(body),
    };
  },
  DELETE: (body, auth) => {
    return {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + auth,
      },
      body: JSON.stringify(body)
    }
  },
  GET: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
};

export default { METHODS, ROUTES };