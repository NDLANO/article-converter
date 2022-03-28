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
import { Plugin, LocaleType, TransformOptions, EmbedType, SimpleEmbedType } from '../interfaces';

export interface OembedEmbedType extends EmbedType<OembedEmbedData> {
  oembed?: OembedProxyResponse;
}

export interface OembedEmbedData {
  resource: 'external' | 'iframe';
  url: string;
  type?: string;
  metaData?: any;
  caption?: string;
  title?: string;
  height?: string;
}

export interface OembedPlugin extends Plugin<OembedEmbedType, OembedEmbedData> {
  resource: 'external';
}

export default function createExternalPlugin(
  options: TransformOptions = { concept: false },
): OembedPlugin {
  const fetchResource = async (
    embed: SimpleEmbedType<OembedEmbedData>,
    accessToken: string,
  ): Promise<OembedEmbedType> => {
    const resolve = async () => {
      const oembedData = await fetchOembed(embed, accessToken);
      return {
        ...embed,
        data: {
          ...embed.data,
          url: oembedData.url || embed.data.url,
        },
        oembed: oembedData.oembed,
      };
    };

    return resolve();
  };

  const onError = (embed: OembedEmbedType, locale: LocaleType) =>
    render(
      <figure className={options.concept ? '' : 'c-figure'}>
        <img alt={t(locale, 'external.error')} src={errorSvgSrc} />
        <figcaption>{t(locale, 'external.error')}</figcaption>
      </figure>,
    );

  const embedToHTML = async (embed: OembedEmbedType) => ({
    html: wrapInFigure(embed.oembed?.html, true, options.concept),
  });

  return {
    resource: 'external',
    onError,
    fetchResource,
    embedToHTML,
  };
}
