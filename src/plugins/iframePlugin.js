/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { makeIframe } from './pluginHelpers';

export default function createIframePlugin() {
  const embedToHTML = embed => {
    const { url, width, height } = embed.data;
    const resize = url.includes('trinket.io') ? false : true;
    return makeIframe(url, width, height, '', resize);
  };

  return {
    resource: 'iframe',
    embedToHTML,
  };
}
