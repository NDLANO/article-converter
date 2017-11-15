/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import classnames from 'classnames';
import { Figure, FigureDetails, FigureCaption } from 'ndla-ui/lib/Figure';
import Button from 'ndla-ui/lib/button/Button';
import Image from 'ndla-ui/lib/Image';
import { getLicenseByAbbreviation } from 'ndla-licenses';
import { fetchImageResources } from '../api/imageApi';
import t from '../locale/i18n';
import { CREATOR_TYPES } from '../constants';

const getFocalPoint = data => {
  if (data.focalX && data.focalY) {
    return { x: data.focalX, y: data.focalY };
  }
  return undefined;
};

const getCrop = data => {
  if (
    data.lowerRightX &&
    data.lowerRightY &&
    data.upperLeftX &&
    data.upperLeftY
  ) {
    return {
      startX: data.lowerRightX,
      startY: data.lowerRightY,
      endX: data.upperLeftX,
      endY: data.upperLeftY,
    };
  }
  return undefined;
};

export default function createImagePlugin() {
  const fetchResource = (embed, headers) => fetchImageResources(embed, headers);

  const embedToHTML = (embed, locale) => {
    const { image, data: { align, caption: embedCaption } } = embed;
    const src = encodeURI(image.imageUrl);
    const { authors, license: { license } } = image.copyright;
    const altText = image.alttext.alttext;
    const caption = embedCaption === '' ? image.caption.caption : embedCaption;
    const licenseRights = getLicenseByAbbreviation(license, locale).rights;

    const figureClassNames = classnames('c-figure', {
      'u-float-right': align === 'right',
      'u-float-left': align === 'left',
    });

    const messages = {
      close: t(locale, 'close'),
      rulesForUse: t(locale, 'image.rulesForUse'),
      learnAboutOpenLicenses: t(locale, 'learnAboutOpenLicenses'),
      source: t(locale, 'source'),
    };

    const focalPoint = getFocalPoint(embed.data);
    const crop = getCrop(embed.data);
    const licenseCopyString = `${
      license.toLowerCase().includes('by') ? 'CC ' : ''
    }${license}`.toUpperCase();

    const creators = authors.filter(author =>
      CREATOR_TYPES.find(type => author.type === type)
    );

    const authorsCopyString = authors
      .filter(author => author.type !== 'Leverandør')
      .map(author => author.name)
      .join(', ');
    const copyString = `${licenseCopyString} ${authorsCopyString}`;

    return renderToStaticMarkup(
      <Figure className={figureClassNames}>
        <div className="c-figure__img">
          <Image
            focalPoint={focalPoint}
            crop={crop}
            alt={altText}
            src={`${src}`}
          />
        </div>
        <FigureCaption
          caption={caption}
          reuseLabel={t(locale, 'image.reuse')}
          licenseRights={licenseRights}
          authors={creators}
        />
        <FigureDetails
          licenseRights={licenseRights}
          authors={authors}
          origin={image.copyright.origin}
          messages={messages}>
          <Button
            outline
            className="c-licenseToggle__button"
            data-copied-title={t(locale, 'reference.copied')}
            data-copy-string={copyString}>
            {t(locale, 'reference.copy')}
          </Button>
          <a
            href={src}
            className="c-button c-button--outline c-licenseToggle__button"
            download>
            {t(locale, 'image.download')}
          </a>
        </FigureDetails>
      </Figure>
    );
  };

  return {
    resource: 'image',
    fetchResource,
    embedToHTML,
  };
}
