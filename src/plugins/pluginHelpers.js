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

export const wrapInFigure = (content, resize = true, concept = false) => {
  const embedClassnames = classnames(
    { 'c-figure': !concept },
    {
      'c-figure--resize': resize,
    }
  );
  return `<figure class="${embedClassnames}" ${
    resize ? 'resizeIframe' : ''
  }>${content}</figure>`;
};

export const makeIframe = (url, width, height, title = '', resize = true) => {
  return wrapInFigure(makeIframeString(url, width, height, title), resize);
};

export const makeIframeString = (url, width, height, title = '') => {
  const strippedWidth = isNumber(width) ? width : width.replace(/\s*px/, '');
  const strippedHeight = isNumber(height)
    ? height
    : height.replace(/\s*px/, '');
  const urlOrTitle = title || url;
  return `<iframe title="${urlOrTitle}" aria-label="${urlOrTitle}" src="${url}" width="${strippedWidth}" height="${strippedHeight}" allowfullscreen scrolling="no" frameborder="0" loading="lazy"></iframe>`;
};

export const errorSvgSrc = `data:image/svg+xml;charset=UTF-8,%3Csvg fill='%238A8888' height='400' viewBox='0 0 24 12' width='100%25' xmlns='http://www.w3.org/2000/svg' style='background-color: %23EFF0F2'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath transform='scale(0.3) translate(28, 8.5)' d='M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z'/%3E%3C/svg%3E`;

const makeCreditCopyString = (roles, locale) => {
  return (
    roles
      .map(creator => {
        const type = t(locale, `${creator.type.toLowerCase()}`);
        return `${type}: ${creator.name.trim()}`;
      })
      .join(', ') + '. '
  );
};

export const getCopyString = (title, url, creators, locale) => {
  const originatorTypes = [
    'originator',
    'photographer',
    'writer',
    'composer',
    'director',
    'scriptwriter',
    'illustrator',
    'artist',
  ];
  const originators = creators.filter(creator =>
    originatorTypes.includes(creator.type.toLowerCase())
  );

  const publisherTypes = ['publisher', 'rightsholder', 'supplier'];
  const publishers = creators.filter(creator =>
    publisherTypes.includes(creator.type.toLowerCase())
  );

  const originatorsCopyString = !!originators.length
    ? makeCreditCopyString(originators, locale)
    : '';
  const publishersCopyString = !!publishers.length
    ? makeCreditCopyString(publishers, locale)
    : '';

  var today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  today = `${dd}.${mm}.${yyyy}`;

  const copyStringInApa7 = `${originatorsCopyString}${title} [Internett]. ${publishersCopyString}NO: Hentet fra: <u>${url}</u> Lest: ${today}`;

  return copyStringInApa7;
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
