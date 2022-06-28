/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getLicenseByAbbreviation } from '@ndla/licenses';
import { IImageMetaInformationV2 } from '@ndla/types-image-api';
import { Figure, ResourceBox } from '@ndla/ui';
import React from 'react';
import { fetchImageResources } from '../api/imageApi';
import { ApiOptions, Embed, LocaleType, PlainEmbed, Plugin, TransformOptions } from '../interfaces';
import { apiResourceUrl } from '../utils/apiHelpers';
import { render } from '../utils/render';
import { makeIframe } from './pluginHelpers';

export interface IframeEmbed extends Embed<IframeEmbedData> {
  iframeImage?: IImageMetaInformationV2;
}

export interface IframePlugin extends Plugin<IframeEmbed, IframeEmbedData> {
  resource: 'iframe';
}

export interface IframeEmbedData {
  resource: 'iframe';
  type: string;
  url: string;
  width?: string;
  height?: string;
  title?: string;
  caption?: string;
  imageid?: string;
}

export default function createIframePlugin(
  options: TransformOptions = { concept: false },
): IframePlugin {
  const fetchResource = (
    embed: PlainEmbed<IframeEmbedData>,
    apiOptions: ApiOptions,
  ): Promise<IframeEmbed> => {
    const resolve = async () => {
      if (embed.data.imageid) {
        const image = await fetchImageResources(
          apiResourceUrl(`/image-api/v2/images/${embed.data.imageid}`),
          apiOptions,
        );
        return {
          ...embed,
          iframeImage: image,
        };
      }
      return embed;
    };
    return resolve();
  };

  const embedToHTML = async (embed: IframeEmbed, locale: LocaleType) => {
    const { url, width, height, type, title, caption } = embed.data;
    const { iframeImage } = embed;

    const license =
      iframeImage?.copyright.license &&
      getLicenseByAbbreviation(iframeImage.copyright.license.license, locale);

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
              licenseRights={license?.rights || []}
            />
          </Figure>,
        ),
      };
    }
    const resize = !url.includes('trinket.io');
    return { html: makeIframe(url, width ?? '', height ?? '', '', resize, options.concept) };
  };

  return {
    resource: 'iframe',
    embedToHTML,
    fetchResource,
  };
}
