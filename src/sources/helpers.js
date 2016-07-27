import 'isomorphic-fetch';
import defined from 'defined';
import config from '../config';

const NDLA_API_URL = config.ndlaContentApiUrl;


const apiBaseUrl = (() => {
  if (process.env.NODE_ENV === 'unittest') {
    return 'http://ndla-api';
  }
  return NDLA_API_URL;
})();


export { apiBaseUrl };

export function apiResourceUrl(path) { return apiBaseUrl + path; }

export function createErrorPayload(status, message, json) {
  return Object.assign(new Error(message), { status, json });
}

export function resolveJsonOrRejectWithError(res) {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      return res.status === 204 ? resolve() : resolve(res.json());
    }
    return res.json()
      .then(json => createErrorPayload(res.status, defined(json.message, res.statusText), json))
      .then(reject);
  });
}
