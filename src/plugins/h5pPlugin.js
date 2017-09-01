/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetchOembed } from '../api/oembedProxyApi';

export default function createH5pPlugin() {
  const createEmbedObject = obj => ({
    id: parseInt(obj.id, 10),
    resource: obj.resource,
    url: obj.url,
  });

  const fetchResource = (embed, headers) =>
    embed.data.url.startsWith('https://ndlah5p.joubel.com')
      ? fetchOembed(embed, headers)
      : embed;

  const embedToHTML = h5p => {
    if (h5p.oembed) {
      h5p.embed.replaceWith(`<figure>${h5p.oembed.html}</figure>`);
    } else {
      h5p.embed.replaceWith(
        `<figure><iframe src="${h5p.data.url}"></iframe></figure>`
      );
    }
  };

  return {
    resource: 'h5p',
    createEmbedObject,
    fetchResource,
    embedToHTML,
  };
}
