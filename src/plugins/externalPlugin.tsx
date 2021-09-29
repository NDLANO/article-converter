/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { fetchOembed, OembedProxyResponse } from '../api/oembedProxyApi';
import { wrapInFigure, errorSvgSrc } from './pluginHelpers';
import t from '../locale/i18n';
import { render } from '../utils/render';
import { EmbedType, LocaleType, TransformOptions } from '../interfaces';
import { Plugin } from './index';

export interface OembedEmbedType extends EmbedType {
  oembed: OembedProxyResponse;
}

export interface OembedPlugin extends Plugin<OembedEmbedType> {
  resource: 'external';
}

export default function createExternalPlugin(
  options: TransformOptions = { concept: false },
): OembedPlugin {
  const fetchResource = async (embed: EmbedType, accessToken: string): Promise<OembedEmbedType> => {
    return fetchOembed(embed, accessToken);
  };

  const onError = (embed: EmbedType, locale: LocaleType) =>
    render(
      <figure className={options.concept ? '' : 'c-figure'}>
        <img alt={t(locale, 'external.error')} src={errorSvgSrc} />
        <figcaption>{t(locale, 'external.error')}</figcaption>
      </figure>,
    );

  const embedToHTML = async (embed: OembedEmbedType) =>
    wrapInFigure(embed.oembed.html, true, options.concept);

  return {
    resource: 'external',
    onError,
    fetchResource,
    embedToHTML,
  };
}
