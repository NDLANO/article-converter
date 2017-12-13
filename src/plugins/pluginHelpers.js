/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import classnames from 'classnames';
import isNumber from 'lodash/fp/isNumber';

export const wrapInFigure = (content, resize = true) => {
  const embedClassnames = classnames('c-figure', {
    'c-figure--resize': resize,
  });
  return `<figure class="${embedClassnames}">${content}</figure>`;
};

export const makeIframe = (url, width, height, resize = true) => {
  const strippedWidth = isNumber(width) ? width : width.replace(/\s*px/, '');
  const strippedHeight = isNumber(height)
    ? height
    : height.replace(/\s*px/, '');
  return wrapInFigure(
    `<iframe src="${url}" width="${strippedWidth}" height="${
      strippedHeight
    }" allowfullscreen scrolling="no" frameborder="0" ></iframe>`,
    resize
  );
};
