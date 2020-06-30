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
import { fetchH5pLicenseInformation } from '../api/h5pApi';

export default function createH5pPlugin() {
  const fetchResource = (embed, accessToken) =>
    new Promise((resolve, reject) => {
      fetchOembed(embed, accessToken)
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
      return wrapInFigure(h5p.oembed.html);
    }
    return wrapInFigure(
      `<iframe title="${h5p.data.url}" aria-label="${h5p.data.url}" src="${
        h5p.data.url
      }"></iframe>`
    );
  };

  const onError = (embed, locale) =>
    render(
      <figure className="c-figure">
        <img alt={t(locale, 'h5p.error')} src={errorSvgSrc} />
        <figcaption>{t(locale, 'h5p.error')}</figcaption>
      </figure>
    );

  const getMetaData = embed => embed?.embed?.h5p || null;

  return {
    resource: 'h5p',
    onError,
    fetchResource,
    embedToHTML,
    getMetaData,
  };
}
