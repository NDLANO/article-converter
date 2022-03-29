/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { fetchOembed, OembedProxyData, OembedProxyResponse } from '../api/oembedProxyApi';
import { wrapInFigure, errorSvgSrc } from './pluginHelpers';
import t from '../locale/i18n';
import { render } from '../utils/render';
import {
  fetchH5pLicenseInformation,
  fetchPreviewOembed,
  H5PLicenseInformation,
  H5POembedResponse,
  OembedPreviewData,
} from '../api/h5pApi';
import config from '../config';
import {
  Plugin,
  Embed,
  LocaleType,
  TransformOptions,
  EmbedToHTMLReturnObj,
  PlainEmbed,
} from '../interfaces';

export interface H5PEmbed extends Embed<H5pEmbedData> {
  oembed?: H5POembedResponse | OembedProxyResponse;
  h5pLicenseInformation?: H5PLicenseInformation;
  h5pUrl?: string;
}

export interface H5PPlugin extends Plugin<H5PEmbed, H5pEmbedData> {
  resource: 'h5p';
}

export interface H5pEmbedData {
  resource: 'h5p';
  path: string;
  url?: string;
  title?: string;
}

export interface H5PMetaData {
  url: string | undefined;
  h5p: {
    title: string;
    authors: {
      name: string;
      role: string;
    }[];
  };
}

export default function createH5pPlugin(options: TransformOptions = { concept: false }): H5PPlugin {
  const fetchH5pOembed: (
    embed: PlainEmbed<H5pEmbedData>,
    accessToken: string,
  ) => Promise<OembedProxyData | OembedPreviewData> = options.previewH5p
    ? fetchPreviewOembed
    : fetchOembed;

  const fetchResource = async (
    embed: PlainEmbed<H5pEmbedData>,
    accessToken: string,
    locale: LocaleType,
  ): Promise<H5PEmbed> => {
    const lang = locale === 'en' ? 'en-gb' : 'nb-no';
    const cssUrl = `${config.ndlaFrontendDomain}/static/h5p-custom-css.css`;
    embed.data.url = `${embed.data.url}?locale=${lang}&cssUrl=${cssUrl}`;
    const oembedData = await fetchH5pOembed(embed, accessToken);
    if (embed?.data) {
      const { data } = embed;
      const pathArr = data.path?.split('/') || [];
      const h5pID = pathArr[pathArr.length - 1];
      const url = 'url' in oembedData && oembedData.url;

      if (h5pID) {
        const h5pLicenseInformation = await fetchH5pLicenseInformation(h5pID);
        return {
          ...embed,
          data: {
            ...data,
            url: url || data.url,
          },
          h5pLicenseInformation,
          h5pUrl: data.url,
          oembed: oembedData.oembed,
        };
      }
    }

    return embed;
  };

  const embedToHTML = async (h5p: H5PEmbed): Promise<EmbedToHTMLReturnObj> => {
    if (h5p.oembed) {
      return { html: wrapInFigure(h5p.oembed.html, true, options.concept) };
    }
    return {
      html: wrapInFigure(
        `<iframe title="${h5p.data.url}" aria-label="${h5p.data.url}" src="${h5p.data.url}"></iframe>`,
        true,
        options.concept,
      ),
    };
  };

  const onError = (embed: H5PEmbed, locale: LocaleType) =>
    render(
      <figure className={options.concept ? '' : 'c-figure'}>
        <img alt={t(locale, 'h5p.error')} src={errorSvgSrc} />
        <figcaption>{t(locale, 'h5p.error')}</figcaption>
      </figure>,
    );

  const getMetaData = async (embed: H5PEmbed, locale: LocaleType) => {
    const h5p = embed?.h5pLicenseInformation;
    if (h5p) {
      return {
        ...h5p,
        url: embed.h5pUrl,
      };
    }
  };

  return {
    resource: 'h5p',
    onError,
    fetchResource,
    embedToHTML,
    getMetaData,
  };
}
