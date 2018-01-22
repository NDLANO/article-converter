/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cheerio from 'cheerio';
import { replaceEmbedsInHtml } from './replacer';
import { getEmbedsFromHtml } from './parser';
import getEmbedMetaData from './getEmbedMetaData';
import log from './utils/logger';
import { createAside, createFactbox } from './utils/aside';

export const moveReactPortals = content => {
  const dialog = cheerio.html(content(`[data-react-universal-portal='true']`));
  content(`[data-react-universal-portal='true']`).remove();
  content('body').append(dialog);
};

export const transformAsides = content => {
  content('aside').each((_, aside) => {
    const isFactAside =
      aside.attribs && aside.attribs['data-type'] === 'factAside';
    if (isFactAside) {
      const factbox = createFactbox({}, content(aside).children());
      content(aside).after(factbox);
    } else {
      const narrowAside = createAside(
        { narrowScreen: true },
        content(aside).children()
      );

      const wideAside = createAside(
        { wideScreen: true },
        content(aside).children()
      );

      const parent = aside.parent;
      content(parent).prepend(wideAside);
      if (parent.name === 'section') {
        // Only append duplicate if we are in a section
        content(parent).append(narrowAside);
      }
    }
    content(aside).remove();
  });
};

export const htmlTransforms = [
  transformAsides,
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
  moveReactPortals,
];

export async function transform(content, lang, accessToken, visualElement) {
  if (visualElement && visualElement.visualElement) {
    content('body').prepend(
      `<section>${visualElement.visualElement}</section>`
    );
  }
  const embeds = await getEmbedsFromHtml(content);
  const embedsWithResources = await Promise.all(
    embeds.map(async embed => {
      const plugin = embed.plugin;
      if (plugin && plugin.fetchResource) {
        try {
          const resource = await plugin.fetchResource(embed, accessToken, lang);
          return resource;
        } catch (e) {
          log.warn('Failed to fetch embed resource data for ', embed.data);
          log.warn(e);
          return { ...embed, status: 'error' };
        }
      }
      return embed;
    })
  );

  replaceEmbedsInHtml(embedsWithResources, lang);
  const embedMetaData = getEmbedMetaData(embedsWithResources, lang);
  htmlTransforms.forEach(replacer => replacer(content));

  return {
    html: content('body').html(),
    embedMetaData,
  };
}
