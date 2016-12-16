/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import log from './utils/logger';
import Brightcove from './markup/Brightcove';
import Image from './markup/Image';
import H5P from './markup/H5P';
import getAudioMarkup from './markup/audio';
import { ndlaFrontendUrl } from './config';

function createEmbedMarkup(embed, lang) {
  switch (embed.resource) {
    case 'image':
      return renderToStaticMarkup(<Image align={embed.align} caption={embed.caption} image={embed.image} lang={lang} />);
    case 'brightcove':
      return renderToStaticMarkup(<Brightcove video={embed} />);
    case 'h5p':
      return renderToStaticMarkup(<H5P h5p={embed} />);
    case 'nrk':
      return `<div class="nrk-video" data-nrk-id="${embed.nrkVideoId}"></div>`;
    case 'audio':
      return getAudioMarkup(embed.audio, lang);
    case 'content-link':
      return `<a href="${ndlaFrontendUrl}/${lang}/article/${embed.contentId}">${embed.linkText}</a>`;
    case 'error':
      return `<div><strong>${embed.message}</strong></div>`;
    default:
      log.warn(embed, 'Do not create markup for unknown/external resource');
      return undefined;
  }
}
export function replaceEmbedsInHtml(embeds, lang, requiredLibraries) {
  return (html) => {
    const reEmbeds = new RegExp(/<embed.*?\/>/g);
    const reDataId = new RegExp(/data-id="(.*?)"/);
    const markup = html.replace(reEmbeds, (embedHtml) => {
      const id = embedHtml.match(reDataId)[1];
      const embed = embeds.find(f => f.id.toString() === id);
      return createEmbedMarkup(embed, lang) || '';
    });

    const scripts = requiredLibraries.map(library =>
          `<script type="${library.mediaType}" src="${library.url}"></script>`
        ).join();

    return markup + scripts;
  };
}

export function appendHtmlToTag(tag, htmlToAppend) {
  return (html) => {
    const reTag = new RegExp(`<\/${tag}>`, 'g');
    const markup = html.replace(reTag, `${htmlToAppend}</aside>`);
    return markup;
  };
}
