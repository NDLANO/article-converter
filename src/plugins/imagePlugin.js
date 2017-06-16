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
    const figureClassNames = classnames('c-figure', {
      'article_figure--float-right': align === 'right',
      'article_figure--float-left': align === 'left',
    });

    const srcSets = [
      `${image.imageUrl}?width=2720 2720w`,
      `${image.imageUrl}?width=2080 2080w`,
      `${image.imageUrl}?width=1760 1760w`,
      `${image.imageUrl}?width=1440 1440w`,
      `${image.imageUrl}?width=1120 1120w`,
      `${image.imageUrl}?width=1000 1000w`,
      `${image.imageUrl}?width=960 960w`,
      `${image.imageUrl}?width=800 800w`,
      `${image.imageUrl}?width=640 640w`,
      `${image.imageUrl}?width=480 480w`,
      `${image.imageUrl}?width=320 320w`,
    ].join(', ');

    return render(
      <Figure className={figureClassNames}>
        <div className="c-figure__img">
          <picture>
            <source
              srcSet={srcSets}
              sizes="(min-width: 1000px) 1000px, 100vw" // max-width 1024 - 52 padding = 972 ≈ 1000
            />
            <img
              alt={altText}
              src={`${image.imageUrl}?width=1024`}
              srcSet={`${image.imageUrl}?width=2048 2x`}
            />
          </picture>
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
