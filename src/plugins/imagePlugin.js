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
import ReactDOMServerStream from 'react-dom/server';
import {
  Figure,
  FigureDetails,
  FigureCaption,
} from 'ndla-ui/lib/article/Figure';
import Button from 'ndla-ui/lib/button/Button';
import { alttextsI18N, captionI18N } from '../utils/i18nFieldFinder';
import { fetchImageResources } from '../api/imageApi';

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
    const src = encodeURI(image.imageUrl);
    const { authors, license: { license } } = image.copyright;
    const altText = alttextsI18N(image, lang, true);
    const caption = defined(captionI18N(image, lang, true), rest.caption);
    const figureClassNames = classnames('c-figure', {
      'article_figure--float-right': align === 'right',
      'article_figure--float-left': align === 'left',
    });

    const srcSets = [
      `${src}?width=2720 2720w`,
      `${src}?width=2080 2080w`,
      `${src}?width=1760 1760w`,
      `${src}?width=1440 1440w`,
      `${src}?width=1120 1120w`,
      `${src}?width=1000 1000w`,
      `${src}?width=960 960w`,
      `${src}?width=800 800w`,
      `${src}?width=640 640w`,
      `${src}?width=480 480w`,
      `${src}?width=320 320w`,
    ].join(', ');

    return ReactDOMServerStream.renderToStaticMarkup(
      <Figure className={figureClassNames}>
        <div className="c-figure__img">
          <picture>
            <source
              srcSet={srcSets}
              sizes="(min-width: 1000px) 1000px, 100vw" // max-width 1024 - 52 padding = 972 ≈ 1000
            />
            <img
              alt={altText}
              src={`${src}?width=1024`}
              srcSet={`${src}?width=2048 2x`}
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
          <Button outline className="c-licenseToggle__button">
            Kopier referanse
          </Button>
          <a
            href={src}
            className="c-button c-button--outline c-licenseToggle__button"
            download>
            Last ned bilde
          </a>
        </FigureDetails>
      </Figure>
    );
  };

  return {
    resource: 'image',
    fetchResource,
    createEmbedObject,
    embedToHTML,
  };
}
