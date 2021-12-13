const BASE_URL = 'http://127.0.0.1:3000';

const ROUTES = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
  },
  USER: {
    ALL: `${BASE_URL}/user`,
    SINGLE: (id) => `${BASE_URL}/user/${id}`
  }
};

const METHODS = {
  POST: body => {
    return {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    };
  },
  GET: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
};

export default { METHODS, ROUTES };
