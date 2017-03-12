/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import createNRKPlugin from './nrkPlugin';
import createAudioPlugin from './audioPlugin';

export {
  createNRKPlugin,
  createAudioPlugin,
};

export default [createNRKPlugin(), createAudioPlugin()];
