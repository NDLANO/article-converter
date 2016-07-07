import jsdom, {serializeDocument} from 'jsdom';
import { fetchResource } from './sources';
function parseImage(element) {
  const url = element.data('url');
  const size = element.data('size');
  return fetchResource(url)
    .then((image) => {
      console.log(image);
      return `<img class="img-${size}_image" src="${image.images.full.url}"></img>`;
    })
    .catch((err) => {
      console.log(err);
    });
}

function parser(element) {
  switch (element.data('resource')) {
    case 'image':
      return parseImage(element).then((html) => html);
    case 'video':
      return undefined;
    case 'h5p':
      return undefined;
    default:
      return undefined;
  }
}

export function parseHtmlString(content, callback) {
  if (!content) {
    return;
  }
  const promises = [];
  jsdom.env({
    html: content,
    scripts: ['http://code.jquery.com/jquery.js'],
    done: (err, window) => {
      const $ = window.$;
      $('figure').each((i, el) => {
        const newHtmlElement = parser($(el));
        if (newHtmlElement) {
          const promise = newHtmlElement.then((html) => {
            $(el).replaceWith(html);
          });
          promises.push(promise);
        }
      });
      callback(
        Promise.all(promises.map(p => p.catch(e => e)))
          .then(() => window.document.documentElement.outerHTML) // 1,Error: 2,3
          .catch(e => console.log(e))
      );
    },
  });
}
