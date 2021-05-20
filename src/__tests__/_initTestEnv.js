/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import 'regenerator-runtime/runtime';

global.requestAnimationFrame = function raf(callback) {
  setTimeout(callback, 0);
};

Date.now = jest.fn(() => new Date(Date.UTC(2021, 4, 19).valueOf()));
