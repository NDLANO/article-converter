/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse5 from 'parse5';
import log from './utils/logger';

function createEmbedObject(attrs) {
  // Reduce attributes array to object with attribute name (striped of date-) as keys.
  const obj = attrs.reduce((all, attr) => Object.assign({}, all, { [attr.name.replace('data-', '')]: attr.value }), {});

  switch (obj.resource) {
    case 'image':
      return { id: parseInt(obj.id, 10), resource: obj.resource, align: obj.align, caption: obj.caption, size: obj.size, url: obj.url };
    case 'brightcove':
      return { id: parseInt(obj.id, 10), resource: obj.resource, account: parseInt(obj.account, 10), player: obj.player, videoid: obj.videoid };
    case 'h5p':
      return { id: parseInt(obj.id, 10), resource: obj.resource, url: obj.url };
    case 'audio':
      return { id: parseInt(obj.id, 10), resource: obj.resource, url: obj.url };
    case 'nrk':
      return { id: parseInt(obj.id, 10), resource: obj.resource, nrkVideoId: obj['nrk-video-id'] };
    case 'content-link':
      return { id: parseInt(obj.id, 10), resource: obj.resource, contentId: obj['content-id'], linkText: obj['link-text'] };
    default:
      log.warn(obj, 'Unknown embed');
      return { id: parseInt(obj.id, 10), resource: obj.resource, url: obj.url };
  }
}


function findEmbedNodes(node, embeds = []) {
  if (node.childNodes) {
    if (node.tagName === 'embed') {
      embeds.push(node);
    }

    node.childNodes.forEach(n => findEmbedNodes(n, embeds));
  }
  return embeds;
}

export function getEmbedsFromHtml(html) {
  return new Promise((resolve, reject) => {
    try {
      const root = parse5.parseFragment(html);
      const embedNodes = findEmbedNodes(root);
      const embeds = embedNodes.map(node => createEmbedObject(node.attrs)).filter(f => f);
      resolve(embeds);
    } catch (e) {
      log.error(html, 'Error occoured while parsing html content and creating embed ojects from it');
      log.error(e);
      reject(e);
    }
  });
}
