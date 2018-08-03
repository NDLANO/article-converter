/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import classnames from 'classnames';
import isNumber from 'lodash/fp/isNumber';
import t from '../locale/i18n';

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
    `<iframe src="${url}" width="${strippedWidth}" height="${strippedHeight}" allowfullscreen scrolling="no" frameborder="0" ></iframe>`,
    resize
  );
};

export const errorSvgSrc = `data:image/svg+xml;charset=UTF-8,
      <svg fill="#8A8888" height="400" viewBox="0 0 24 12" width="100%" xmlns="http://www.w3.org/2000/svg" style="background-color: #EFF0F2">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path transform="scale(0.3) translate(28, 8.5)" d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
      </svg>
    `;

export const getCopyString = (licenseAbbreviation, creators, locale) => {
  const licenseCopyString = `${
    licenseAbbreviation.toLowerCase().includes('by') ? 'CC ' : ''
  }${licenseAbbreviation}`.toUpperCase();
  const contributorsCopyString = creators
    .map(creator => {
      const type = t(locale, `${creator.type.toLowerCase()}`);
      return `${type}: ${creator.name}`;
    })
    .join('\n');
  return `${licenseCopyString} ${contributorsCopyString}`;
};

export const getLicenenseCredits = copyright => {
  if (copyright.creators && copyright.creators.length > 0) {
    return copyright.creators;
  }
  if (copyright.rightsholders && copyright.rightsholders.length > 0) {
    return copyright.rightsholders;
  }
  if (copyright.processors && copyright.processors.length > 0) {
    return copyright.processors;
  }
  return [];
};
