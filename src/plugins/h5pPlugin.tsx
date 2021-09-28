/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { fetchOembed } from '../api/oembedProxyApi';
import { wrapInFigure, errorSvgSrc, getCopyString } from './pluginHelpers';
import t from '../locale/i18n';
import { render } from '../utils/render';
import {
  fetchH5pLicenseInformation,
  fetchPreviewOembed,
  H5PLicenseInformation,
  H5POembedResponse,
} from '../api/h5pApi';
import config from '../config';
import { EmbedType, LocaleType, TransformOptions } from '../interfaces';
import { EmbedMetaData, Plugin } from './index';

export interface H5PEmbedType extends EmbedType {
  oembed: H5POembedResponse;
  h5pLicenseInformation?: H5PLicenseInformation;
  h5pUrl?: string;
}

interface H5PPlugin extends Plugin<H5PEmbedType> {
  resource: 'h5p';
}

export default function createH5pPlugin(options: TransformOptions = { concept: false }): H5PPlugin {
  const fetchH5pOembed = options.previewH5p ? fetchPreviewOembed : fetchOembed;
  const fetchResource = async (
    embed: EmbedType,
    accessToken: string,
    locale: LocaleType,
  ): Promise<H5PEmbedType> => {
    const lang = locale === 'en' ? 'en-gb' : 'nb-no';
    const cssUrl = `${config.ndlaFrontendDomain}/static/h5p-custom-css.css`;
    embed.data.url = `${embed.data.url}?locale=${lang}&cssUrl=${cssUrl}`;
    const data = await fetchH5pOembed(embed, accessToken);
    if (data?.embed?.data) {
      const myData = data.embed.data();
      const pathArr = (myData as Record<string, string>).path?.split('/') || [];
      const h5pID = pathArr[pathArr.length - 1];

      if (h5pID) {
        const h5pLicenseInformation = await fetchH5pLicenseInformation(h5pID);
        return {
          ...data,
          h5pLicenseInformation,
          h5pUrl: myData.url as string,
        };
      }
    }

    return data;
  };

  const embedToHTML = async (h5p: H5PEmbedType): Promise<string> => {
    if (h5p.oembed) {
      return wrapInFigure(h5p.oembed.html, true, options.concept);
    }
    return wrapInFigure(
      `<iframe title="${h5p.data.url}" aria-label="${h5p.data.url}" src="${h5p.data.url}"></iframe>`,
      true,
      options.concept,
    );
  };

  const onError = (embed: H5PEmbedType, locale: LocaleType) =>
    render(
      <figure className={options.concept ? '' : 'c-figure'}>
        <img alt={t(locale, 'h5p.error')} src={errorSvgSrc} />
        <figcaption>{t(locale, 'h5p.error')}</figcaption>
      </figure>,
    );

  const mapRole = (role: string) => {
    const objRoles: Record<string, string> = {
      Author: 'Writer',
      Editor: 'Editorial',
      Licensee: 'Rightsholder',
    };
    return objRoles[role] ?? role;
  };

  const getMetaData = async (
    embed: H5PEmbedType,
    locale: LocaleType,
  ): Promise<EmbedMetaData | undefined> => {
    const h5p = embed?.h5pLicenseInformation;
    if (h5p) {
      const creators = h5p.h5p.authors?.map((author) => {
        return { name: author.name, type: mapRole(author.role) };
      });
      const copyString = getCopyString(
        h5p.h5p.title,
        embed.h5pUrl,
        options.path,
        { creators },
        locale,
      );
      return {
        ...h5p,
        copyText: copyString,
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
