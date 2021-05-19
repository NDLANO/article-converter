/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import createNRKPlugin from './nrkPlugin';
import createAudioPlugin from './audioPlugin';
import createImagePlugin from './imagePlugin';
import createBrightcovePlugin from './brightcovePlugin';
import createH5pPlugin from './h5pPlugin';
import createExternalPlugin from './externalPlugin';
import createContentLinkPlugin from './contentLinkPlugin';
import createErrorPlugin from './errorPlugin';
import createIframePlugin from './iframePlugin';
import createFootnotePlugin from './footNotePlugin';
import createConceptPlugin from './conceptPlugin';
import createRelatedContent from './relatedContentPlugin';
import createCodePlugin from './codePlugin';

export {
  createNRKPlugin,
  createAudioPlugin,
  createImagePlugin,
  createBrightcovePlugin,
  createH5pPlugin,
  createExternalPlugin,
  createContentLinkPlugin,
  createErrorPlugin,
  createIframePlugin,
  createFootnotePlugin,
  createConceptPlugin,
  createRelatedContent,
  createCodePlugin,
};

const plugins = options => [
  createNRKPlugin(),
  createAudioPlugin(options),
  createImagePlugin(options),
  createBrightcovePlugin(options),
  createH5pPlugin(options),
  createExternalPlugin(options),
  createContentLinkPlugin(options),
  createErrorPlugin(),
  createIframePlugin(),
  createFootnotePlugin(),
  createConceptPlugin(options),
  createRelatedContent(options),
  createCodePlugin(),
];
export default plugins;
