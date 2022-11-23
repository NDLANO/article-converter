/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { figureApa7CopyString } from '@ndla/licenses';
import { IImageMetaInformationV2 } from '@ndla/types-image-api';
import { Figure, ResourceBox } from '@ndla/ui';
import React from 'react';
import config from '../config';
import { fetchOembed, OembedProxyResponse } from '../api/oembedProxyApi';
import { wrapInFigure, errorSvgSrc } from './pluginHelpers';
import t from '../locale/i18n';
import { fetchImageResources } from '../api/imageApi';
import { apiResourceUrl } from '../utils/apiHelpers';
import { render } from '../utils/render';
import { ApiOptions, Plugin, LocaleType, TransformOptions, Embed, PlainEmbed } from '../interfaces';

export interface OembedEmbed extends Embed<OembedEmbedData> {
  oembed: OembedProxyResponse;
  iframeImage?: IImageMetaInformationV2;
}

export interface OembedEmbedData {
  resource: 'external' | 'iframe';
  url: string;
  type?: string;
  metaData?: any;
  caption?: string;
  title?: string;
  height?: string;
  imageid?: string;
}

export interface OembedPlugin extends Plugin<OembedEmbed, OembedEmbedData> {
  resource: 'external';
}

export default function createExternalPlugin(
  options: TransformOptions = { concept: false },
): OembedPlugin {
  const fetchResource = async (
    embed: PlainEmbed<OembedEmbedData>,
    apiOptions: ApiOptions,
  ): Promise<OembedEmbed> => {
    const resolve = async () => {
      const oembedData = await fetchOembed(embed, apiOptions.accessToken);
      let image = undefined;
      if (embed.data.imageid) {
        image = await fetchImageResources(
          apiResourceUrl(`/image-api/v2/images/${embed.data.imageid}`),
          apiOptions,
        );
      }

      return {
        ...embed,
        data: {
          ...embed.data,
          url: oembedData.url || embed.data.url,
        },
        iframeImage: image,
        oembed: oembedData.oembed,
      };
    };

    return resolve();
  };

  const onError = (embed: OembedEmbed, locale: LocaleType) =>
    render(
      <figure className={options.concept ? '' : 'c-figure'}>
        <img alt={t(locale, 'external.error')} src={errorSvgSrc} />
        <figcaption>{t(locale, 'external.error')}</figcaption>
      </figure>,
    );

  const getMetaData = async (embed: OembedEmbed, locale: LocaleType) => {
    const { iframeImage } = embed;
    if (iframeImage) {
      const {
        title: { title },
        alttext: { alttext },
        copyright,
        imageUrl,
      } = iframeImage;
      const copyString = figureApa7CopyString(
        title,
        undefined,
        imageUrl,
        options.shortPath || options.path,
        copyright,
        copyright.license.license,
        config.ndlaFrontendDomain,
        (id: string) => t(locale, id),
        locale,
      );
      return {
        title: title,
        altText: alttext,
        copyright: copyright,
        src: imageUrl,
        copyText: copyString,
        resourceOverride: 'images',
      };
    }
  };

  const embedToHTML = async (embed: OembedEmbed, locale: LocaleType) => {
    const { url, type, title, caption } = embed.data;
    const { iframeImage } = embed;

    if (type === 'fullscreen') {
      const image = {
        src: iframeImage?.imageUrl || '',
        alt: iframeImage?.alttext.alttext || '',
      };
      return {
        html: render(
          <Figure type="full">
            <ResourceBox
              image={image}
              title={title || ''}
              url={url}
              caption={caption || ''}
              buttonText={t(locale, 'license.other.itemImage.ariaLabel')}
            />
          </Figure>,
        ),
      };
    }
    return { html: wrapInFigure(embed.oembed?.html, true, options.concept) };
  };

  return {
    resource: 'external',
    onError,
    fetchResource,
    embedToHTML,
    getMetaData,
  };
}
