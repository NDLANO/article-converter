/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import classnames from 'classnames';
import isNumber from 'lodash/fp/isNumber';

export const wrapInFigureEmbedded = (content, resize = true) => {
  const embedClassnames = classnames('c-embedded', {
    'c-embedded--resize': resize,
  });
  return `<figure class="${embedClassnames}">${content}</figure>`;
};

export const makeIframe = (url, width, height, resize = true) => {
  const strippedWidth = isNumber(width) ? width : width.replace(/\s*px/, '');
  const strippedHeight = isNumber(height)
    ? height
    : height.replace(/\s*px/, '');
  return wrapInFigureEmbedded(
    `<iframe src="${url}" width="${strippedWidth}" height="${
      strippedHeight
    }" allowfullscreen scrolling="no" frameborder="0" ></iframe>`,
    resize
  );
};

function getContributorGroups(copyright, lang) {
  const creators = mkContributorString(copyright.creators, lang, 'originator');
  const rightsholders = mkContributorString(
    copyright.rightsholders,
    lang,
    'rightsholder'
  );
  const processors = mkContributorString(
    copyright.processors,
    lang,
    'processor'
  );

  return [
    {
      type: contributorTypes[lang].creator,
      name: creators,
    },
    {
      type: contributorTypes[lang].rightsholder,
      name: rightsholders,
    },
    {
      type: contributorTypes[lang].processor,
      name: processors,
    },
  ].filter(item => item.name !== '');
}
