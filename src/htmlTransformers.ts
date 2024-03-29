/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import cheerio, { CheerioAPI, Element } from 'cheerio';
import partition from 'lodash/partition';
import {
  createAside,
  createFactbox,
  createFileSection,
  createTable,
  renderLinkButton,
} from './utils/htmlTagHelpers';
import { createRelatedArticleList } from './utils/embedGroupHelpers';
import t from './locale/i18n';
import { checkIfFileExists } from './api/filesApi';
import { LocaleType, TransformOptions } from './interfaces';

export const moveReactPortals = (content: CheerioAPI) => {
  content(`[data-react-universal-portal='true']`).each((_, el) => {
    content(el).attr('data-from-article-converter', 'true');
  });
  const dialog = cheerio.html(content(`[data-react-universal-portal='true']`));
  content(`[data-react-universal-portal='true']`).remove();
  content('body').append(dialog);

  // Clean up by removing all portals inside portals
  content(`[data-react-universal-portal='true'] [data-react-universal-portal='true']`).remove();
};

export const transformAsides = (content: CheerioAPI) => {
  content('aside').each((_, aside) => {
    const isFactAside = aside.attribs && aside.attribs['data-type'] === 'factAside';
    if (isFactAside) {
      const factbox = createFactbox({}, content(aside).children().toString());
      content(aside).after(factbox);
    } else {
      const narrowAside = createAside({ narrowScreen: true }, content(aside).children().toString());

      const wideAside = createAside({ wideScreen: true }, content(aside).children().toString());

      const parent = aside?.parent as Element | undefined;
      content(aside).after(wideAside);
      if (parent?.name === 'section' || parent?.tagName === 'section') {
        // Only append duplicate if we are in a section
        content(parent).append(narrowAside);
      }
    }
    content(aside).remove();
  });
};

export const transformRelatedContent = (content: CheerioAPI, lang: LocaleType) => {
  content('div').each((_, div) => {
    const isRelatedContentGroup = div.attribs && div.attribs['data-type'] === 'related-content';
    if (isRelatedContentGroup) {
      const divElement = content(div);
      const children = divElement.children();
      const relatedArticleList = createRelatedArticleList(
        { locale: lang, articleCount: children.length },
        children.toString(),
      );
      if (relatedArticleList) divElement.before(relatedArticleList);
      divElement.remove();
    }
  });
};

const transformFileList = async (content: CheerioAPI, locale: LocaleType) => {
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

const makeTheListFromDiv = async (content: CheerioAPI, div: Element, locale: LocaleType) => {
  const filesPromises = content(div)
    .children()
    .map(async (_, file) => {
      const { url, type, title, display } = cheerio(file).data() as Record<string, string>;
      const fileExists = await checkIfFileExists(url);
      return {
        title,
        fileExists,
        display,
        formats: [
          {
            url,
            fileType: type,
            tooltip: `${t(locale, 'download')} ${url.split('/').pop()}`,
          },
        ],
      };
    })
    .get();

  const files = await Promise.all(filesPromises);

  const [pdfs, fileList] = partition(
    files,
    (f) => f.formats[0].fileType === 'pdf' && f.display === 'block',
  );

  return createFileSection(
    fileList.filter((f) => f),
    pdfs,
    t(locale, 'files'),
  );
};

const resetOrderedLists = (content: CheerioAPI) =>
  content('ol').each((_, ol) => {
    const list = content(ol);
    const num = list.attr('start');
    if (num) {
      list.addClass(`ol-reset-${num}`);
    }
  });

export const transformTables = (content: CheerioAPI, lang: LocaleType) =>
  content('table').each((_, table) => {
    const newTable = createTable(content(table).children().toString());
    content(table).before(newTable);
    content(table).remove();
  });

export const transformLinksInOembed = (
  content: CheerioAPI,
  lang: LocaleType,
  options: TransformOptions,
) =>
  content('a').each((_, a) => {
    if (options.isOembed) {
      content(a).attr('target', '_blank');
    }
  });

export const addHeaderCopyLinkButtons = (content: CheerioAPI) => {
  content('h2')
    .filter((i, el) => {
      return (
        cheerio(el).parents(
          'figure, details, aside, div.c-bodybox, section.c-related-articles, div.c-concept-list',
        ).length === 0
      );
    })
    .each((idx, h2) => {
      const headerElement = cheerio(h2);
      const innerHTML = headerElement.html();
      if (innerHTML) {
        const container = renderLinkButton(innerHTML, innerHTML);
        if (container) headerElement.replaceWith(container);
      }
    });
};

export const addTooltipAttributes = (content: CheerioAPI) => {
  content('div[data-tooltip-container]').each((idx, tooltip) => {
    const tooltipElement = cheerio(tooltip);
    tooltipElement.attr('data-tooltip-from-article-converter', 'true');
  });
};

export const addPopoverAttributes = (content: CheerioAPI) => {
  content('div[data-popover-container]').each((idx, tooltip) => {
    const popoverElement = cheerio(tooltip);
    popoverElement.attr('data-popover-from-article-converter', 'true');
  });
};

export const htmlTransforms: ((
  content: CheerioAPI,
  lang: LocaleType,
  options: TransformOptions,
) => void)[] = [
  transformRelatedContent,
  (content: CheerioAPI) => {
    content('math').attr('display', 'block');
  },
  (content: CheerioAPI) =>
    content('ol[data-type="letters"]').removeAttr('data-type').addClass('ol-list--roman'),
  (content: CheerioAPI) =>
    content('ul[data-type="two-column"]').removeAttr('data-type').addClass('o-list--two-columns'),
  (content: CheerioAPI) =>
    content('p[data-align="center"]').removeAttr('data-align').addClass('u-text-center'),
  (content: CheerioAPI) =>
    content('span[data-size="large"]').removeAttr('data-size').addClass('u-large-body-text'),
  (content: CheerioAPI) => content('h3').attr('tabindex', '0'),
  addHeaderCopyLinkButtons,
  resetOrderedLists,
  transformTables,
  transformFileList,
  transformLinksInOembed,
  addTooltipAttributes,
  addPopoverAttributes,
  moveReactPortals,
  transformAsides, // since transformAsides duplicates content all other transforms should be run first
];
