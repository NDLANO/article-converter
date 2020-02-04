/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cheerio from 'cheerio';
import {
  createAside,
  createFactbox,
  createFileList,
  createTable,
} from './utils/htmlTagHelpers';
import { createRelatedArticleList } from './utils/embedGroupHelpers';
import t from './locale/i18n';
import { checkIfFileExists } from './api/filesApi';

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
      const factbox = createFactbox(
        {},
        content(aside)
          .children()
          .toString()
      );
      content(aside).after(factbox);
    } else {
      const narrowAside = createAside(
        { narrowScreen: true },
        content(aside)
          .children()
          .toString()
      );

      const wideAside = createAside(
        { wideScreen: true },
        content(aside)
          .children()
          .toString()
      );

      const parent = aside.parent;
      content(aside).after(wideAside);
      if (parent.name === 'section') {
        // Only append duplicate if we are in a section
        content(parent).append(narrowAside);
      }
    }
    content(aside).remove();
  });
};

export const transformRelatedContent = (content, lang, options) => {
  content('div').each((_, div) => {
    const isRelatedContentGroup =
      div.attribs && div.attribs['data-type'] === 'related-content';
    if (isRelatedContentGroup) {
      if (!options.removeRelatedContent) {
        const relatedArticleList = createRelatedArticleList(
          { locale: lang, articleCount: content(div).children().length },
          content(div)
            .children()
            .toString()
        );
        content(div).before(relatedArticleList);
      }
      content(div).remove();
    }
  });
};

const transformFileList = async (content, locale) => {
  const promises = content('div').map(async (_, div) => {
    const isFileList = div.attribs && div.attribs['data-type'] === 'file';
    if (isFileList) {
      const fileList = await makeTheListFromDiv(content, div, locale);
      content(div).before(fileList);
      content(div).remove();
    }
  });

  await Promise.all(promises.get());
};

const makeTheListFromDiv = async (content, div, locale) => {
  const filesPromises = content(div)
    .children()
    .map(async (_, file) => {
      const { url, type, title, path } = file.data;
      const fileExists = await checkIfFileExists(path);
      if (fileExists) {
        return {
          title,
          formats: [
            {
              url,
              fileType: type,
              tooltip: `${t(locale, 'download')} ${url.split('/').pop()}`,
            },
          ],
        };
      }
    })
    .get();

  const files = await Promise.all(filesPromises);

  return createFileList({
    files: files.filter(x => x),
    heading: t(locale, 'files'),
  });
};

export const transformTables = (content, lang) =>
  content('table').each((_, table) => {
    const newTable = createTable(
      {},
      content(table)
        .children()
        .toString(),
      lang
    );
    content(table).before(newTable);
    content(table).remove();
  });

export const htmlTransforms = [
  transformRelatedContent,
  content => {
    content('math').attr('display', 'block');
  },
  content =>
    content('ol[data-type="letters"]')
      .removeAttr('data-type')
      .addClass('ol-list--roman'),
  content =>
    content('ul[data-type="two-column"]')
      .removeAttr('data-type')
      .addClass('o-list--two-columns'),
  content =>
    content('p[data-align="center"]')
      .removeAttr('data-align')
      .addClass('u-text-center'),
  moveReactPortals,
  content =>
    content('span[data-size="large"]')
      .removeAttr('data-size')
      .addClass('u-large-body-text'),
  transformTables,
  transformFileList,
  transformAsides, // since transformAsides duplicates content all other transforms should be run first
];
