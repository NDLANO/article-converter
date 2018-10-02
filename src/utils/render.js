/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { renderToStaticMarkup } from 'react-dom/server';
import { renderStylesToString } from 'emotion-server';

export function render(component) {
  return renderStylesToString(renderToStaticMarkup(component));
}
