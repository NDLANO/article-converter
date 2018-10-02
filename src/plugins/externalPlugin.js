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

export default function createExternalPlugin() {
  const fetchResource = (embed, headers) => fetchOembed(embed, headers);

  const onError = (embed, locale) =>
    render(
      <figure className="c-figure">
        <img alt={t(locale, 'external.error')} src={errorSvgSrc} />
        <figcaption>{t(locale, 'external.error')}</figcaption>
      </figure>
    );

  const embedToHTML = embed => wrapInFigure(embed.oembed.html);

  return {
    resource: 'external',
    onError,
    fetchResource,
    embedToHTML,
  };
}
