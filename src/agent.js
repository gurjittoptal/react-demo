import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

//const API_ROOT = '/api';
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


const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;

const Users = {
  all: page =>
    requests.get(`/users?${limit(5, page)}`),
  get: uid =>
    requests.get(`/user/${uid}`),
  del: uid =>
    requests.del(`/user/${uid}`),
  save: user =>
    requests.put('/user', { user })
};

const Repairs = {
  create: (payload) =>
    requests.post('/repairs', { repair: payload }),
  all: page =>
    requests.get(`/repairs?${limit(5, page)}`),
  get: uid =>
    requests.get(`/repair/${uid}`),
  del: uid =>
    requests.del(`/repair/${uid}`),
  changestate: (uid,astate) =>
    requests.put(`/repair/${uid}`, { state: astate, method: 'changestate' }),
};

const Comments = {
  create: (payload) =>
    requests.post('/miscl/comment', { comment: payload })
};



export default {
  Auth,
  Comments,
  Repairs,
  Users,
  setToken: _token => { token = _token; }
};