/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetchAudio } from '../api/audioApi';

export default function createAudioPlugin() {
  const fetchResource = (embed, headers) => fetchAudio(embed, headers);

  const embedToHTML = embed => {
    const { audio: { title, audioFile: { mimeType, url } } } = embed;
    const replacement = `<figure class="article_audio"><audio controls type="${mimeType}" src="${url}"></audio><figcaption>${title.title}</figcaption></figure>`;
    embed.embed.replaceWith(replacement);
  };

  return {
    resource: 'audio',
    fetchResource,
    embedToHTML,
  };
}
