import 'isomorphic-fetch';
import defined from 'defined';

function createErrorPayload(status, message, json) {
  return Object.assign(new Error(message), { status, json });
}

function resolveJsonOrRejectWithError(res) {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      return res.status === 204 ? resolve() : resolve(res.json());
    }
    return res.json()
      .then(json => createErrorPayload(res.status, defined(json.message, res.statusText), json))
      .then(reject);
  });
}


const fetchResource = (url) => fetch(url).then(resolveJsonOrRejectWithError);

export {
  fetchResource,
};
