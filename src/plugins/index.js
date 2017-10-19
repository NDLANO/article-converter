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
import createPreziPlugin from './preziPlugin';
import createCommoncraftPlugin from './commoncraftPlugin';
import createNdlaFilmIUndervisning from './ndlaFilmIUndervisningPlugin';
import createKahootPlugin from './kahootPlugin';
import createKhanAcademyPlugin from './khanAcademyPlugin';
import createFootnotePlugin from './footNotePlugin';
import createConceptPluin from './conceptPlugin';

export {
  createNRKPlugin,
  createAudioPlugin,
  createImagePlugin,
  createBrightcovePlugin,
  createH5pPlugin,
  createExternalPlugin,
  createContentLinkPlugin,
  createErrorPlugin,
  createPreziPlugin,
  createCommoncraftPlugin,
  createNdlaFilmIUndervisning,
  createKahootPlugin,
  createKhanAcademyPlugin,
  createFootnotePlugin,
  createConceptPluin,
};

export default [
  createNRKPlugin(),
  createAudioPlugin(),
  createImagePlugin(),
  createBrightcovePlugin(),
  createH5pPlugin(),
  createExternalPlugin(),
  createContentLinkPlugin(),
  createErrorPlugin(),
  createPreziPlugin(),
  createCommoncraftPlugin(),
  createNdlaFilmIUndervisning(),
  createKahootPlugin(),
  createKhanAcademyPlugin(),
  createFootnotePlugin(),
  createConceptPluin(),
];
