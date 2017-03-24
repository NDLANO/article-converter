/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetchOembed } from '../api/oembedProxyApi';

export default function createExternalPlugin() {
  const createEmbedObject = obj => (
      { id: parseInt(obj.id, 10), resource: obj.resource, url: obj.url }
  );

  const fetchResource = (embed, headers) => fetchOembed(embed, headers);

  const embedToHTML = embed => `<figure class="article__oembed">${embed.oembed.html}</figure>`;

  return {
    resource: 'external',
    createEmbedObject,
    fetchResource,
    embedToHTML,
  };
}
