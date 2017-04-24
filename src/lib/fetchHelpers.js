import 'whatwg-fetch';

export function checkThrowError(res) {
  if (res.status !== 200) {
    return res.json().then((json) => {
      throw json;
    });
  }
  return res.json();
}

export function fetchJSON(endpoint) {
  const options = {};
  if (localStorage.token) {
    options.headers = {
      Authorization: `Bearer ${localStorage.token}`,
    };
  }
  return fetch(endpoint, options)
    .then(checkThrowError);
}

/* eslint-disable no-param-reassign */
export function postJSON(endpoint, body, headers) {
  headers = headers || {};

  headers['Content-Type'] = 'application/json';

  if (!headers.Authorization && localStorage.token) {
    headers.Authorization = `Bearer ${localStorage.token}`;
  }

  return fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  }).then(checkThrowError);
}
