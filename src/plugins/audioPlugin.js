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

  const getMetaData = embed => {
    const { audio } = embed;
    return {
      title: audio.title.title,
      copyright: audio.copyright,
      src: audio.audioFile.url,
    };
  };

  const embedToHTML = embed => {
    const { audio: { title, audioFile: { mimeType, url } } } = embed;
    return `<figure class="article_audio"><audio controls type="${mimeType}" src="${url}"></audio><figcaption>${
      title.title
    }</figcaption></figure>`;
  };

  return {
    resource: 'audio',
    getMetaData,
    fetchResource,
    embedToHTML,
  };
}
