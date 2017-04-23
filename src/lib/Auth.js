import { postJSON } from './fetchHelpers';

const AUTH_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000/auth/' : 'https://galvanize-admissions-portfolio-api.galvanize.network/auth/';

/* eslint-disable camelcase */
export default class Auth {
  static exchange(token) {
    return postJSON(`${AUTH_URL}exchange`, undefined, {
      Authorization: `Bearer ${token}`,
    });
  }
}
