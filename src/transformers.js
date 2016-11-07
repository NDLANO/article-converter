/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import { fetchImageResources } from './api/imageApi';
import { fetchAudio } from './api/audioApi';
import { replaceEmbedsInHtml } from './replacer';
import { getEmbedsFromHtml } from './parser';
import { alttextsI18N, captionI18N } from './utils/i18nFieldFinder';

export async function transformContent(content, lang, requiredLibraries) {
  const embeds = await getEmbedsFromHtml(content);

  const embedsWithResources = await Promise.all(embeds.map((embed) => {
    if (embed.resource === 'image') {
      return fetchImageResources(embed);
    } else if (embed.resource === 'audio') {
      return fetchAudio(embed);
    }
    return embed;
  }));

  return await replaceEmbedsInHtml(embedsWithResources, content, lang, requiredLibraries);
}

export async function transformIntroduction(introduction, lang) {
  if (!introduction) {
    return {};
  }

  if (introduction.image) {
    const { image: imageInfo } = await fetchImageResources({ url: introduction.image });
    const altText = alttextsI18N(imageInfo, lang, true);
    const caption = defined(captionI18N(imageInfo, lang, true), '');
    return {
      image: {
        altText,
        caption,
        src: imageInfo.imageUrl,
      },
      text: introduction.introduction,
    };
  }

  return {
    text: introduction.introduction,
  };
}
