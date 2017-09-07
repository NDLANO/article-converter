/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetchOembed } from '../api/oembedProxyApi';

export default function createExternalPlugin() {
  const fetchResource = (embed, headers) => fetchOembed(embed, headers);

  const embedToHTML = embed =>
    embed.embed.replaceWith(
      `<figure class="article__oembed">${embed.oembed.html}</figure>`
    );

  return {
    resource: 'external',
    fetchResource,
    embedToHTML,
  };
}
