/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetchAudio } from '../api/audioApi';

export default function createAudioPlugin() {
  const createEmbedObject = obj => ({
    id: parseInt(obj.id, 10),
    resource: obj.resource,
    url: obj.url,
  });

  const fetchResource = (embed, headers) => fetchAudio(embed, headers);

  const embedToHTML = embed => {
    const { audio } = embed;
    const title = audio.title;
    const audioFile = audio.audioFile;
    return `<figure class="article_audio"><audio controls type="${audioFile.mimeType}" src="${audioFile.url}"></audio><figcaption>${title}</figcaption></figure>`;
  };

  return {
    resource: 'audio',
    fetchResource,
    createEmbedObject,
    embedToHTML,
  };
}
