/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import classnames from 'classnames';
import { alttextsI18N, captionI18N } from '../utils/i18nFieldFinder';
import { fetchImageResources } from '../api/imageApi';


export default function createImagePlugin() {
  const createEmbedObject = obj => (
    { id: parseInt(obj.id, 10), resource: obj.resource, align: obj.align, caption: obj.caption, size: obj.size, url: obj.url }
  );

  const fetchResource = embed => fetchImageResources(embed);

  const embedToHTML = (embed, lang) => {
    const { image, align, ...rest } = embed;
    const altText = alttextsI18N(image, lang, true);
    const caption = defined(captionI18N(image, lang, true), rest.caption);
    const figureClassNames = classnames('article_figure', {
      'article_figure--float-right': align === 'right',
      'article_figure--float-left': align === 'left',
    });

    const figcaption = caption ? `<figcaption class="article_caption">${caption}</figcaption>` : '';

    return `<figure class="${figureClassNames}"><img class="article_image" alt="${altText}" src="${image.imageUrl}"/>${figcaption}</figure>`;
  };


  return {
    resource: 'image',
    fetchResource,
    createEmbedObject,
    embedToHTML,
  };
}
