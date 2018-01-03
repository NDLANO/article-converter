/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { fetchOembed } from '../api/oembedProxyApi';
import { wrapInFigure, errorSvgSrc } from './pluginHelpers';
import t from '../locale/i18n';

export default function createExternalPlugin() {
  const fetchResource = (embed, headers) => fetchOembed(embed, headers);

  const onError = (embed, locale) =>
    wrapInFigure(`
      <img
        alt="${t(locale, 'external.error')}"
        role="presentation"
        src="${errorSvgSrc}"
      />
    `);

  const embedToHTML = embed => wrapInFigure(embed.oembed.html);

  return {
    resource: 'external',
    onError,
    fetchResource,
    embedToHTML,
  };
}
