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
import { fetchH5p } from '../api/h5pApi'

export default function createExternalPlugin() {
  const fetchResource = (embed, headers) => fetchOembed(embed, headers);

  const onError = (embed, locale) =>
    render(
      <figure className="c-figure">
        <img alt={t(locale, 'external.error')} src={errorSvgSrc} />
        <figcaption>{t(locale, 'external.error')}</figcaption>
      </figure>
    );

  const embedToHTML = embed => wrapInFigure(embed.oembed.html);

  const getMetaData = embed => {
    // TODO: build the structure like the one we need in graphql type "copyright"
    if(embed && embed.data && embed.data.resource && embed.data.resource === 'external' && embed.data.url ){
      console.log('h5p url' , embed.data.url);
      let arrUrl = embed.data.url.split('/');
      let h5pID = (arrUrl && arrUrl.length && arrUrl[arrUrl.length -1])?arrUrl[arrUrl.length -1] : false;
      if(h5pID){
        let content = fetchH5p(h5pID);
        console.log(content);
      }
    }
    return {};
  };

  return {
    resource: 'external',
    onError,
    fetchResource,
    embedToHTML,
    getMetaData
  };
}
