/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { fetchOembed } from '../api/oembedProxyApi';
import { wrapInFigure, errorSvgSrc } from './pluginHelpers';
import t from '../locale/i18n';
import { render } from '../utils/render';

export default function createExternalPlugin(options = { concept: false }) {
  const fetchResource = (embed, accessToken) =>
    new Promise((resolve, reject) => {
      fetchOembed(embed, accessToken, options)
        .then((data) => {
          return resolve(data);
        })
        .catch(reject);
    });

  const onError = (embed, locale) =>
    render(
      <figure className={options.concept ? '' : 'c-figure'}>
        <img alt={t(locale, 'external.error')} src={errorSvgSrc} />
        <figcaption>{t(locale, 'external.error')}</figcaption>
      </figure>,
    );

  const embedToHTML = (embed) => wrapInFigure(embed.oembed.html, true, options.concept);

  return {
    resource: 'external',
    onError,
    fetchResource,
    embedToHTML,
  };
}
