/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { replaceEmbedsInHtml } from './replacer';
import { getEmbedsFromHtml } from './parser';
import getEmbedMetaData from './getEmbedMetaData';

export const tagReplacers = [
  content => {
    content('aside').each((_, aside) => {
      const isFactAside =
        aside.attribs && aside.attribs['data-type'] === 'factAside';
      const expandButton = isFactAside
        ? '<button class="c-button c-aside__button"/>'
        : '';
      const innerAside = `<div class="c-aside__content">${content(
        aside
      ).children()}</div>${expandButton}`;
      content(aside)
        .removeAttr('data-type')
        .addClass(`c-aside ${!isFactAside ? 'c-aside--float expanded' : ''}`);
      content(aside).html(innerAside);
    });
  },
  content => {
    content('math').attr('display', 'block');
  },
  content =>
    content('ol[data-type="letters"]')
      .removeAttr('data-type')
      .addClass('ol-list--roman'),
  content =>
    content('p[data-align="center"]')
      .removeAttr('data-align')
      .addClass('u-text-center'),
];

export async function transform(content, lang, accessToken, visualElement) {
  if (visualElement && visualElement.visualElement) {
    content('body').prepend(
      `<section>${visualElement.visualElement}</section>`
    );
  }
  const embeds = await getEmbedsFromHtml(content);
  const embedsWithResources = await Promise.all(
    embeds.map(embed => {
      const plugin = embed.plugin;
      if (plugin && plugin.fetchResource) {
        return plugin.fetchResource(embed, accessToken, lang);
      }
      return embed;
    })
  );

  replaceEmbedsInHtml(embedsWithResources, lang);
  const embedMetaData = getEmbedMetaData(embedsWithResources, lang);
  tagReplacers.forEach(replacer => replacer(content));

  return {
    html: content('body').html(),
    embedMetaData,
  };
}
