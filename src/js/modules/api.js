const BASE_URL = 'https://127.0.0.1:8000';

const ROUTES = {
  STATIC: resource => `${BASE_URL}/static/${resource}`,
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
  },
  USER: {
    ALL: `${BASE_URL}/user`,
    SINGLE: id => `${BASE_URL}/user/${id}`,
    AVATAR: id => `${BASE_URL}/user/${id}/avatar`,
    PRIVATE: id => `${BASE_URL}/user/${id}/private`,
    UPDATE: `${BASE_URL}/user`,
    PASSWORD: `${BASE_URL}/user/password`,
  },
  RECIPE: {
    ALL: `${BASE_URL}/recipe`,
    POST: `${BASE_URL}/recipe`,
    POST_IMG: id => `${BASE_URL}/recipe/${id}/img`,
    SINGLE: id => `${BASE_URL}/recipe/${id}`,
    LIKE: id => `${BASE_URL}/recipe/${id}/like`,
    DELETE: id => `${BASE_URL}/recipe/${id}`,
  },
  COMMENT: {
    ALL: `${BASE_URL}/comment`,
    POST: `${BASE_URL}/comment`,
    SINGLE: id => `${BASE_URL}/comment/${id}`,
    LIKE: id => `${BASE_URL}/comment/${id}/like`,
    REMOVE: id => `${BASE_URL}/comment/${id}`,
  },
};

const METHODS = {
  POST_FORM: (body, auth) => {
    return {
      method: 'POST',
      headers: {
        // 'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + auth,
      },
      body: body,
    };
  },

  POST: (body, auth) => {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth,
      },
      body: JSON.stringify(body),
    };
  },
  DELETE: (body, auth) => {
    return {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth,
      },
      body: JSON.stringify(body),
    };
  },
  PUT: (body, auth) => {
    return {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth,
      },
      body: JSON.stringify(body),
    };
  },
  GET: auth => {
    return {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth,
      },
    };
  },
};

export default { METHODS, ROUTES };
