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
import config from '../config';

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
  if (!roles?.length) {
    return '';
  }
  return (
    roles
      .map(creator => {
        const type = creator.type && t(locale, `${creator.type.toLowerCase()}`);
        return `${type}: ${creator.name?.trim()}`;
      })
      .join(', ') + '. '
  );
};

const getValueOrFallback = (value, fallback) => {
  if (value === undefined) {
    return fallback;
  }
  return value;
};

const makeDateString = () => {
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

export const getCopyString = (title, src, path, copyright, locale) => {
  const credits = getLicenseCredits(copyright);
  const creators = makeCreditCopyString(credits.creators, locale);
  const processors = makeCreditCopyString(credits.processors, locale);
  const rightsholders = makeCreditCopyString(credits.rightsholders, locale);
  const titleString =
    getValueOrFallback(title, t(locale, 'license.copyText.noTitle')) + ' ';
  const url = path ? config.ndlaFrontendDomain + path : src;
  const date = makeDateString();

  // Ex: Fotograf: Ola Nordmann. Tittel [Internett]. Opphaver: NTB. Hentet fra: www.ndla.no/urn:resource:123 Lest: 04.05.2021
  return (
    creators +
    processors +
    titleString +
    t(locale, 'license.copyText.internet') +
    rightsholders +
    t(locale, 'license.copyText.downloadedFrom') +
    url +
    ' ' +
    t(locale, 'license.copyText.readDate') +
    date
  );
};

export const getLicenseCredits = copyright => {
  return {
    creators: copyright?.creators?.length > 0 ? copyright.creators : [],
    rightsholders:
      copyright?.rightsholders?.length > 0 ? copyright.rightsholders : [],
    processors: copyright?.processors?.length > 0 ? copyright.processors : [],
  };
};
