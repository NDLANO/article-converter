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

export {
  createNRKPlugin,
  createAudioPlugin,
  createImagePlugin,
  createBrightcovePlugin,
};

export default [
  createNRKPlugin(),
  createAudioPlugin(),
  createImagePlugin(),
  createBrightcovePlugin(),
];
