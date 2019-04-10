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

export default function createExternalPlugin() {
  const fetchResource = (embed, headers) =>
    new Promise((resolve, reject) => {
      fetchOembed(embed, headers)
        .then(data => data)
        .then(data => {
          if (data && data.embed && data.embed.data) {
            const myData = data.embed.data();
            let h5pID = false;
            if (myData.url) {
              const arrUrl = myData.url.split('/');
              // making sure we don't search for non hp5 urls
              if (arrUrl[2].includes('h5p')) {
                h5pID =
                  arrUrl && arrUrl.length && arrUrl[arrUrl.length - 1]
                    ? arrUrl[arrUrl.length - 1]
                    : false;
              }
            }

            if (h5pID) {
              fetchH5pLicenseInformation(h5pID)
                .then(h5pData => {
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

  const onError = (embed, locale) =>
    render(
      <figure className="c-figure">
        <img alt={t(locale, 'external.error')} src={errorSvgSrc} />
        <figcaption>{t(locale, 'external.error')}</figcaption>
      </figure>
    );

  const embedToHTML = embed => wrapInFigure(embed.oembed.html);

  const getMetaData = embed => {
    if (embed && embed.embed && embed.embed.h5p) {
      return embed.embed.h5p;
    } else {
      return null;
    }
  };

  return {
    resource: 'external',
    onError,
    fetchResource,
    embedToHTML,
    getMetaData,
  };
}
