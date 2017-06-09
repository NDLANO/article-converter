/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import defined from 'defined';
import classnames from 'classnames';
import {
  Figure,
  FigureDetails,
  FigureCaption,
} from 'ndla-ui/lib/article/Figure';
import Icon from 'ndla-ui/lib/icons/Icon';
import { alttextsI18N, captionI18N } from '../utils/i18nFieldFinder';
import { fetchImageResources } from '../api/imageApi';

const { render } = require('rapscallion');

export default function createImagePlugin() {
  const createEmbedObject = obj => ({
    id: parseInt(obj.id, 10),
    resource: obj.resource,
    align: obj.align,
    caption: obj.caption,
    size: obj.size,
    url: obj.url,
  });

  const fetchResource = (embed, headers) => fetchImageResources(embed, headers);

  const embedToHTML = (embed, lang) => {
    const { image, align, ...rest } = embed;
    const { authors, license: { license } } = image.copyright;
    const altText = alttextsI18N(image, lang, true);
    const caption = defined(captionI18N(image, lang, true), rest.caption);
    const figureClassNames = classnames('article_figure', {
      'article_figure--float-right': align === 'right',
      'article_figure--float-left': align === 'left',
    });

    const figcaption = caption ? `<figcaption>${caption}</figcaption>` : '';

    if (align === 'right' || align === 'left') {
      return `<figure class="${figureClassNames}"><img class="article_image" alt="${altText}" src="${image.imageUrl}"/>${figcaption}</figure>`;
    }

    return render(
      <Figure>
        <div className="c-figure__img">
          <img alt={altText} src={image.imageUrl} />
        </div>
        <FigureCaption
          caption={caption}
          reuseLabel="Gjenbruk"
          licenseAbbreviation={license}
          authors={authors}
        />
        <FigureDetails licenseAbbreviation={license} authors={authors}>
          <button
            className="c-button c-button--small c-button--transparent c-licenseToggle__button"
            type="button">
            <Icon.Copy /> Kopier referanse
          </button>
          <button
            className="c-button c-button--small c-button--transparent c-licenseToggle__button"
            type="button">
            <Icon.Link /> Gå til kilde
          </button>
          <button className="c-button c-licenseToggle__button" type="button">
            <Icon.OpenWindow /> Vis bilde
          </button>
        </FigureDetails>
      </Figure>
    )
      .includeDataReactAttrs(false)
      .toPromise();
  };

  return {
    resource: 'image',
    fetchResource,
    createEmbedObject,
    embedToHTML,
  };
}
