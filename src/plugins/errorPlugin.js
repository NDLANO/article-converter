/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export default function createContentLinkPlugin() {
  const createEmbedObject = obj => ({
    id: parseInt(obj.id, 10),
    resource: obj.resource,
    message: obj.message,
  });

  const embedToHTML = embed =>
    embed.embed.replaceWIth(
      `<div><strong>${embed.data.message}</strong></div>`
    );

  return {
    resource: 'error',
    createEmbedObject,
    embedToHTML,
  };
}
