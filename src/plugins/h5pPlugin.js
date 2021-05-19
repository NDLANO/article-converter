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
import { fetchH5pLicenseInformation, fetchPreviewOembed } from '../api/h5pApi';
import config from '../config';

export default function createH5pPlugin(options = { concept: false }) {
  const fetchH5pOembed = options.previewH5p ? fetchPreviewOembed : fetchOembed;
  const fetchResource = (embed, accessToken, locale) =>
    new Promise((resolve, reject) => {
      const lang = locale === 'en' ? 'en-gb' : 'nb-no';
      const cssUrl = `${config.ndlaFrontendDomain}/static/h5p-custom-css.css`;
      embed.data.url = `${embed.data.url}?locale=${lang}&cssUrl=${cssUrl}`;
      fetchH5pOembed(embed, accessToken, options)
        .then(data => data)
        .then(data => {
          if (data?.embed?.data) {
            const myData = data.embed.data();
            const pathArr = myData.path?.split('/') || [];
            const h5pID = pathArr[pathArr.length - 1];

            if (h5pID) {
              fetchH5pLicenseInformation(h5pID)
                .then(h5pData => {
                  h5pData.url = myData.url;
                  data.embed.h5p = h5pData;
                  resolve(data);
                })
                .catch(() => resolve(data));
            } else {
              return resolve(data);
            }
          }
        })
        .catch(reject);
    });

  const embedToHTML = h5p => {
    if (h5p.oembed) {
      return wrapInFigure(h5p.oembed.html, true, options.concept);
    }
    return wrapInFigure(
      `<iframe title="${h5p.data.url}" aria-label="${h5p.data.url}" src="${
        h5p.data.url
      }"></iframe>`,
      true,
      options.concept
    );
  };

  const onError = (embed, locale) =>
    render(
      <figure className={options.concept ? '' : 'c-figure'}>
        <img alt={t(locale, 'h5p.error')} src={errorSvgSrc} />
        <figcaption>{t(locale, 'h5p.error')}</figcaption>
      </figure>
    );

  const mapRole = role => {
    const objRoles = {
      Author: 'Writer',
      Editor: 'Editorial',
      Licensee: 'Rightsholder',
    };
    return objRoles[role] || role;
  };

  const getMetaData = (embed, locale, metaOptions) => {
    const h5p = embed?.embed?.h5p;
    if (h5p) {
      const {
        h5p: { title, authors },
        url,
      } = h5p;
      const creators = authors.map(author => {
        return { name: author.name, type: mapRole(author.role) };
      });
      const copyString = getCopyString(title, url, metaOptions.path, { creators }, locale);
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
