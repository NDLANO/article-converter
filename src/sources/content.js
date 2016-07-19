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
function resolveJsonOrRejectWithImageObject(res) {
  return new Promise((resolve) => {
    if (res.ok) {
      return res.status === 204 ? resolve() : resolve(res.json());
    }
    return res.json()
      .then(json => resolve(Object.assign({ images: { full: { url: `https://placeholdit.imgix.net/~text?txtsize=28&txt=${res.statusText}&w=1000&h=500` }}})));
  });
}


const fetchResource = (url) => fetch(url).then(resolveJsonOrRejectWithError);

const fetchFigureResources = (url, id) => fetch(url).then(resolveJsonOrRejectWithImageObject).then((figure) => Object.assign({id, metaUrl: url, figure}, {}));

export {
  fetchResource,
  fetchFigureResources
};
