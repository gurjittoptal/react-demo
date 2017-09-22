import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

//const API_ROOT = 'https://conduit.productionready.io/api';
const API_ROOT = 'http://localhost:64080/api';

const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `${token}`);
  }
}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

const Auth = {
  current: () =>
    requests.get('/miscl/user'),
  login: (email, password) =>
    requests.post('/miscl/login', { user: { email, password } }),
  register: (email, password, role) =>
    requests.post('/users', { user: { email, password, role } }),
  save: user =>
    requests.put('/user', { user })
};

const Users = {
  all: () =>
    requests.get('/users'),
  save: user =>
    requests.put('/user', { user })
};

export default {
  Auth,
  Users,
  setToken: _token => { token = _token; }
};