/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


export default function createNRKPlugin() {
  const createEmbedObject = obj => (
    { id: parseInt(obj.id, 10), resource: obj.resource, nrkVideoId: obj['nrk-video-id'] }
  );

  const embedToHTML = embed => `<div class="nrk-video" data-nrk-id="${embed.nrkVideoId}"></div>`;

  return {
    resource: 'nrk',
    createEmbedObject,
    embedToHTML,
  };
}
