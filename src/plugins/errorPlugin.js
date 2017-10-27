/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export default function createContentLinkPlugin() {
  const embedToHTML = embed =>
    `<div><strong>${embed.data.message}</strong></div>`;

  return {
    resource: 'error',
    embedToHTML,
  };
}
